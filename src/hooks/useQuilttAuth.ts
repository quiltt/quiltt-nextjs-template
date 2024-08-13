import { useQuilttSession } from '@quiltt/react'
import { useEffect } from 'react'

export const useQuilttAuth = () => {
	const { importSession } = useQuilttSession()

	useEffect(() => {
		const fetchSession = async () => {
			const response = await fetch('/api/quiltt-session')
			const data = await response.json()
			if (data.token) {
				importSession(data.token)
			}
		}

		fetchSession()
	}, [importSession])
}
