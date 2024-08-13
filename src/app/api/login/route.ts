import { NextResponse } from 'next/server'

const API_SECRET_KEY = process.env.QUILTT_API_SECRET_KEY
const AUTH_ENDPOINT = 'https://auth.quiltt.io/v1/users/sessions'

export async function POST(request: Request) {
	const { profileId } = await request.json()

	try {
		const response = await fetch(AUTH_ENDPOINT, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${API_SECRET_KEY}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ userId: profileId }),
		})

		if (!response.ok) {
			const errorData = await response.json()
			console.error('Quiltt API error:', errorData)
			return NextResponse.json({ error: errorData.message || 'Authentication failed' }, { status: response.status })
		}

		const data = await response.json()

		return NextResponse.json({
			token: data.token,
			userId: data.userId,
			expiresAt: data.expiresAt,
		})
	} catch (error) {
		console.error('Error in authentication process:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}
