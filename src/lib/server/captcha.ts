import { env } from '$env/dynamic/private'

const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

export async function validateTurnstileToken(token: string, remoteip?: string): Promise<boolean> {
	const secret = env.TURNSTILE_SECRET_KEY
	if (!secret) {
		console.error('TURNSTILE_SECRET_KEY env var is not set')
		return false
	}

	try {
		const res = await fetch(VERIFY_URL, {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: new URLSearchParams({
				secret,
				response: token,
				...(remoteip ? { remoteip } : {}),
			}),
		})
		const data = await res.json()
		return data.success === true
	} catch {
		return false
	}
}
