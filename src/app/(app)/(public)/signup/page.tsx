'use client'

import { useQuilttSession } from '@quiltt/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

const SignupPage = () => {
	const [email, setEmail] = useState('')
	const [error, setError] = useState('')
	const router = useRouter()
	const { importSession } = useQuilttSession()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError('')

		try {
			const response = await fetch('/api/signup', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email }),
			})

			if (!response.ok) {
				const errorData = await response.json()
				throw new Error(errorData.error || 'Signup failed')
			}

			const { token, userId, expiresAt } = await response.json()
			importSession(token)

			console.log('New user created:', userId)
			console.log('Session expires at:', expiresAt)

			router.push('/dashboard')
		} catch (err) {
			setError((err as Error).message || 'Signup failed')
		}
	}

	return (
		<div className="flex min-h-screen items-center justify-center">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle>Sign Up</CardTitle>
					<CardDescription>Create a new account</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-4">
						{error && <p className="text-red-500">{error}</p>}
						<div>
							<label htmlFor="email" className="block mb-1">
								Email
							</label>
							<Input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
						</div>
						<Button type="submit" className="w-full">
							Sign Up
						</Button>
						<p className="text-center">
							Already have an account?{' '}
							<Link href="/login" className="text-blue-500 hover:underline">
								Log in
							</Link>
						</p>
					</form>
				</CardContent>
			</Card>
		</div>
	)
}

export default SignupPage
