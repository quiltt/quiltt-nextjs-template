'use client'

import { gql, useQuery, useQuilttSession } from '@quiltt/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import type { Account } from '@/generated/graphql'

const QUERY = gql`query Query {
  accounts {
    id
    name
    balance {
      current
    }
  }
}`

const Dashboard = () => {
	const { data, loading } = useQuery<{ accounts: Array<Partial<Account>> }>(QUERY)
	const { session } = useQuilttSession()
	const router = useRouter()

	useEffect(() => {
		if (!session) {
			router.push('/login')
		}
	}, [session, router])

	if (!session) {
		return null // or a loading indicator
	}

	const { accounts } = data || {}
	console.log({ data })

	return (
		<div className="p-8 space-y-6">
			<section>
				<h1 className="text-2xl font-bold mb-4">Dashboard</h1>
				<p suppressHydrationWarning>
					Session token: <span className="break-all font-mono bg-gray-200 py-1">{session.token}</span>
				</p>
			</section>

			<section>
				{loading ? (
					<div>Loading...</div>
				) : (
					<ul className="list-disc">
						{accounts?.map((account) => (
							<li key={account.id}>
								{account.name} - ${account?.balance?.current}
							</li>
						))}
					</ul>
				)}
			</section>
		</div>
	)
}

export default Dashboard
