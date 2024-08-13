'use client'

import { QuilttButton, useQuilttSession } from '@quiltt/react'
import type { ConnectorSDKCallbackMetadata } from '@quiltt/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'

const Home = () => {
	const { session, revokeSession } = useQuilttSession()
	const [connectionId, setConnectionId] = useState<string>()
	const router = useRouter()

	useEffect(() => {
		if (!session) {
			router.push('/login')
		}
	}, [session, router])

	const handleExitSuccess = (metadata: ConnectorSDKCallbackMetadata) => {
		setConnectionId(metadata?.connectionId)
		console.log('Successfully connected:', metadata.connectionId)
	}

	const logOut = () => {
		revokeSession()
		router.push('/login')
	}

	if (!session) {
		return null // or a loading indicator
	}

	return (
		<main className="flex min-h-screen flex-col items-center justify-center p-24" suppressHydrationWarning>
			<h1 className="text-4xl font-bold mb-8">Quiltt Next.js Template</h1>
			<div className="flex flex-col gap-3">
				<Button asChild>
					<QuilttButton
						connectorId={process.env.NEXT_PUBLIC_QUILTT_CONNECTOR_ID as string}
						onExitSuccess={handleExitSuccess}
					>
						Connect Account
					</QuilttButton>
				</Button>
				<Button asChild>
					<Link href="/dashboard">Go to Dashboard</Link>
				</Button>
				{connectionId && <p className="mb-4">Connected account ID: {connectionId}</p>}
				<Button type="button" onClick={logOut} variant="destructive">
					Log Out
				</Button>
			</div>
		</main>
	)
}

export default Home
