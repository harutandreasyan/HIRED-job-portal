import { useSession } from '@clerk/clerk-react'
import { useState } from 'react'

const useFetch = (cb, options = {}) => {
	const [data, setData] = useState(undefined)
	const [loading, setLoading] = useState(null)
	const [error, setError] = useState(null)

	const { session } = useSession()

	const fn = async (...args) => {
		setLoading(true)
		setError(null)

		// Attempt to get a Supabase token; if not signed in, fall back to anon
		let supabaseAccessToken = null
		try {
			supabaseAccessToken = await session.getToken({ template: 'supabase' })
		} catch (err) {
			supabaseAccessToken = null
		}

		try {
			const response = await cb(supabaseAccessToken, options, ...args)
			setData(response)
			setError(null)
		} catch (err) {
			setError(err)
		} finally {
			setLoading(false)
		}
	}

	return { data, loading, error, fn }
}

export default useFetch
