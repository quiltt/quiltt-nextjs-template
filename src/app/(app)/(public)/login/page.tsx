'use client'

import { useQuilttSession } from '@quiltt/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

const LoginPage = () => {
	const [profileId, setProfileId] = useState('')
	const [error, setError] = useState('')
	const router = useRouter()
	const { importSession } = useQuilttSession()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError('')

		try {
			const response = await fetch('/api/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ profileId }),
			})

			if (!response.ok) {
				const errorData = await response.json()
				throw new Error(errorData.error || 'Authentication failed')
			}

			const { token, userId, expiresAt } = await response.json()
			importSession(token)
				.then(() => {
					console.log('User authenticated:', userId)
					console.log('Session expires at:', expiresAt)

					router.push('/')
				})
				.catch(console.error)
		} catch (err) {
			setError((err as Error).message || 'Invalid credentials')
		}
	}

	return (
		<div className="flex min-h-screen items-center justify-center">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle>Login</CardTitle>
					<CardDescription>Enter your Profile ID to log in</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-4">
						{error && <p className="text-red-500">{error}</p>}
						<div>
							<label htmlFor="profileId" className="block mb-1">
								Profile ID
							</label>
							{/* For the actual implementation, you might want to make this an email field,
							and cross-reference that with their respective Profile IDs stored in your backend */}
							<Input
								type="text"
								id="profileId"
								value={profileId}
								onChange={(e) => setProfileId(e.target.value)}
								required
							/>
						</div>
						<Button type="submit" className="w-full">
							Log In
						</Button>
						<p className="text-center">
							Don't have an account?{' '}
							<Link href="/signup" className="text-blue-500 hover:underline">
								Sign up
							</Link>
						</p>
					</form>
				</CardContent>
			</Card>
		</div>
	)
}

export default LoginPage
