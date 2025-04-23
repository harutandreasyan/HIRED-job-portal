import { useEffect } from 'react'
import { BarLoader } from 'react-spinners'
import MDEditor from '@uiw/react-md-editor'
import { useParams } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'
import { Briefcase, DoorClosed, DoorOpen, MapPinIcon } from 'lucide-react'

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { ApplyJobDrawer } from '@/components/apply-job'
import ApplicationCard from '@/components/application-card'

import useFetch from '@/hooks/use-fetch'
import { getSingleJob, updateHiringStatus } from '@/api/apiJobs'

const JobPage = () => {
	const { id } = useParams()
	const { isSignedIn, user } = useUser()

	// Always fetch the job
	const {
		loading: loadingJob,
		data: job,
		fn: fnJob,
	} = useFetch(getSingleJob, { job_id: id })

	useEffect(() => {
		fnJob()
	}, [])

	const { loading: loadingHiringStatus, fn: fnHiringStatus } = useFetch(
		updateHiringStatus,
		{ job_id: id }
	)

	const handleStatusChange = (value) =>
		fnHiringStatus(value === 'open').then(() => fnJob())

	// Show loader until job is fetched
	if (loadingJob || !job) {
		return <BarLoader className='mb-4' width='100%' color='#36d7b7' />
	}

	// Did this user already apply?
	const candidateApplied = isSignedIn
		? job.applications?.some((ap) => ap.candidate_id === user.id)
		: false

	return (
		<div className='flex flex-col gap-8 mt-5'>
			{/* Title + Logo */}
			<div className='flex flex-col-reverse gap-6 md:flex-row justify-between items-center'>
				<h1 className='gradient-title font-extrabold pb-3 text-4xl sm:text-6xl'>
					{job.title}
				</h1>
				<img
					src={job.company?.logo_url}
					alt={job.company?.name || 'Company logo'}
					className='h-12'
				/>
			</div>

			{/* Meta Info */}
			<div className='flex justify-between'>
				<div className='flex gap-2 items-center'>
					<MapPinIcon /> {job.location}
				</div>
				<div className='flex gap-2 items-center'>
					<Briefcase /> {job.applications?.length} Applicants
				</div>
				<div className='flex gap-2 items-center'>
					{job.isOpen ? <DoorOpen /> : <DoorClosed />}{' '}
					{job.isOpen ? 'Open' : 'Closed'}
				</div>
			</div>

			{/* Recruiter-only toggle */}
			{job.recruiter_id === user?.id && (
				<Select onValueChange={handleStatusChange}>
					<SelectTrigger
						className={`w-full ${job.isOpen ? 'bg-green-950' : 'bg-red-950'}`}
					>
						<SelectValue
							placeholder={`Hiring Status ${
								job.isOpen ? '( Open )' : '( Closed )'
							}`}
						/>
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='open'>Open</SelectItem>
						<SelectItem value='closed'>Closed</SelectItem>
					</SelectContent>
				</Select>
			)}

			{/* Description */}
			<h2 className='text-2xl sm:text-3xl font-bold'>About the job</h2>
			<p className='sm:text-lg'>{job.description}</p>

			{/* Requirements */}
			<h2 className='text-2xl sm:text-3xl font-bold'>
				What we are looking for
			</h2>
			<MDEditor.Markdown
				source={job.requirements}
				className='bg-transparent sm:text-lg'
			/>

			{/* Apply drawer for candidates */}
			{job.recruiter_id !== user?.id && (
				<ApplyJobDrawer
					job={job}
					user={user}
					fetchJob={fnJob}
					applied={candidateApplied}
				/>
			)}

			{loadingHiringStatus && <BarLoader width='100%' color='#36d7b7' />}

			{/* Applications list (recruiter) */}
			{job.applications?.length > 0 && job.recruiter_id === user?.id && (
				<div className='flex flex-col gap-2'>
					<h2 className='font-bold mb-4 text-xl ml-1'>Applications</h2>
					{job.applications.map((application) => (
						<ApplicationCard key={application.id} application={application} />
					))}
				</div>
			)}
		</div>
	)
}

export default JobPage
