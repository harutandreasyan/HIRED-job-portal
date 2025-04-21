// src/api/apiJobs.js
import supabaseClient from '@/utils/supabase'

// Fetch Jobs
export async function getJobs(token, { location, company_id, searchQuery }) {
	const supabase = await supabaseClient(token)
	let query = supabase
		.from('jobs')
		.select(
			'*, saved: saved_jobs!saved_jobs_job_id_fkey(id), company: companies(name,logo_url)'
		)

	if (location) {
		query = query.eq('location', location)
	}

	if (company_id) {
		query = query.eq('company_id', company_id)
	}

	if (searchQuery) {
		query = query.ilike('title', `%${searchQuery}%`)
	}

	const { data, error } = await query

	if (error) {
		console.error('Error fetching Jobs:', error)
		return null
	}

	return data
}

// Read Saved Jobs
export async function getSavedJobs(token) {
	const supabase = await supabaseClient(token)
	const { data, error } = await supabase
		.from('saved_jobs')
		.select(
			'*, job: jobs!saved_jobs_job_id_fkey(*, company: companies(name,logo_url))'
		)

	if (error) {
		console.error('Error fetching Saved Jobs:', error)
		return null
	}

	return data
}

// Read single job
export async function getSingleJob(token, { job_id }) {
	const supabase = await supabaseClient(token)
	const { data, error } = await supabase
		.from('jobs')
		.select(
			'*, company: companies(name,logo_url), applications: applications(*)'
		)
		.eq('id', job_id)
		.single()

	if (error) {
		console.error('Error fetching Job:', error)
		return null
	}

	return data
}

// - Add / Remove Saved Job (toggle)
export async function saveJob(
	token,
	_options,
	{ alreadySaved, user_id, job_id }
) {
	const supabase = await supabaseClient(token)

	if (alreadySaved) {
		// remove exactly that user/job pair
		const { error: deleteError } = await supabase
			.from('saved_jobs')
			.delete()
			.eq('job_id', job_id)
			.eq('user_id', user_id)

		if (deleteError) console.error('Error removing saved job:', deleteError)
		return []
	}

	// otherwise, insert new saved_jobs row
	const { data, error: insertError } = await supabase
		.from('saved_jobs')
		.insert([{ user_id, job_id }])
		.select()

	if (insertError) {
		console.error('Error saving job:', insertError)
		return []
	}

	return data
}

// - job isOpen toggle - (recruiter_id = auth.uid())
export async function updateHiringStatus(token, { job_id }, isOpen) {
	const supabase = await supabaseClient(token)
	const { data, error } = await supabase
		.from('jobs')
		.update({ isOpen })
		.eq('id', job_id)
		.select()

	if (error) {
		console.error('Error Updating Hiring Status:', error)
		return null
	}

	return data
}

// get my created jobs
export async function getMyJobs(token, { recruiter_id }) {
	const supabase = await supabaseClient(token)
	const { data, error } = await supabase
		.from('jobs')
		.select('*, company: companies(name,logo_url)')
		.eq('recruiter_id', recruiter_id)

	if (error) {
		console.error('Error fetching Jobs:', error)
		return null
	}

	return data
}

// Delete job
export async function deleteJob(token, { job_id }) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("jobs")
    .delete()
    .eq("id", job_id)
    .select();

  if (error) {
    console.error("Error deleting job:", error);
    return null;
  }

  return data;
}

// - post job
export async function addNewJob(token, _, jobData) {
	const supabase = await supabaseClient(token)
	const { data, error } = await supabase.from('jobs').insert([jobData]).select()

	if (error) {
		console.error(error)
		throw new Error('Error Creating Job')
	}

	return data
}
