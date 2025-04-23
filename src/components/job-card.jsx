import { Heart, MapPinIcon, Trash2Icon } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Link } from 'react-router-dom'
import useFetch from '@/hooks/use-fetch'
import { deleteJob, saveJob } from '@/api/apiJobs'
import { useUser } from '@clerk/clerk-react'
import { useState } from 'react'
import { BarLoader } from 'react-spinners'

const JobCard = ({
	job,
	savedInit = false,
	onJobAction = () => {},
	isMyJob = false,
}) => {
	const [saved, setSaved] = useState(savedInit)
	const { isLoaded, isSignedIn, user } = useUser()

	const { loading: loadingDeleteJob, fn: fnDeleteJob } = useFetch(deleteJob, {
		job_id: job.id,
	})
	const { loading: loadingSavedJob, fn: fnSavedJob } = useFetch(saveJob)

	const handleSaveJob = async () => {
		// if not signed in, kick off Clerk's login flow
		if (!isLoaded || !isSignedIn) {
			window.location.href = '/?sign-in=true'
			return
		}
		// optimistic UI
		setSaved((prev) => !prev)

		// actual toggle
		await fnSavedJob({
			alreadySaved: saved,
			user_id: user.id,
			job_id: job.id,
		})

		// re-fetch lists (jobs or saved-jobs)
		onJobAction()
	}

	const handleDeleteJob = async () => {
		await fnDeleteJob()
		onJobAction()
	}

	return (
		<Card className='flex flex-col'>
			{loadingDeleteJob && (
				<BarLoader className='mt-4' width={'100%'} color='#36d7b7' />
			)}
			<CardHeader className='flex'>
				<CardTitle className='flex justify-between font-bold'>
					{job.title}
					{isMyJob && (
						<Trash2Icon
							fill='red'
							size={18}
							className='text-red-300 cursor-pointer'
							onClick={handleDeleteJob}
						/>
					)}
				</CardTitle>
			</CardHeader>
			<CardContent className='flex flex-col gap-4 flex-1'>
				<div className='flex justify-between'>
					{job.company && job.company.logo_url ? (
						<img
							src={job.company.logo_url}
							alt={job.company.name || 'Company'}
							className='h-6'
						/>
					) : (
						<div className='h-6 w-24 bg-gray-700 rounded animate-pulse'></div>
					)}
					<div className='flex gap-2 items-center'>
						<MapPinIcon size={15} /> {job.location}
					</div>
				</div>
				<hr />
				{job.description &&
					job.description.substring(
						0,
						Math.min(
							job.description.indexOf('.') > 0
								? job.description.indexOf('.')
								: 100,
							100
						)
					)}
				{job.description && job.description.indexOf('.') > 0 ? '.' : '...'}
			</CardContent>
			<CardFooter className='flex gap-2'>
				<Link to={`/job/${job.id}`} className='flex-1'>
					<Button variant='secondary' className='w-full'>
						More Details
					</Button>
				</Link>
				{!isMyJob && (
					<Button
						variant='outline'
						className='w-15 text-gray-500'
						onClick={handleSaveJob}
						disabled={loadingSavedJob}
					>
						<Heart
							size={20}
							fill={saved ? 'red' : 'none'}
							stroke={saved ? 'red' : 'currentColor'}
						/>
					</Button>
				)}
			</CardFooter>
		</Card>
	)
}

export default JobCard
