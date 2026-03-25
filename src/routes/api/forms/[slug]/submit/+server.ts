import { json } from '@sveltejs/kit'
import { validateTurnstileToken } from '$lib/server/captcha'
import { getClient } from '$lib/sdk'
import { BroadcakeError } from '@techcake/broadcake-sdk'
import type { RequestHandler } from './$types'

export const POST: RequestHandler = async ({ params, request, getClientAddress }) => {
	const body = await request.json()

	const turnstileToken = body._turnstile
	delete body._turnstile

	if (!turnstileToken || typeof turnstileToken !== 'string') {
		return json({ success: false, error: 'CAPTCHA verification failed.' }, { status: 400 })
	}

	const valid = await validateTurnstileToken(turnstileToken, getClientAddress())
	if (!valid) {
		return json({ success: false, error: 'CAPTCHA verification failed.' }, { status: 400 })
	}

	try {
		const bc = getClient()
		const result = await bc.submitForm(params.slug, body)
		return json(result)
	} catch (err) {
		if (err instanceof BroadcakeError) {
			const body = err.body as Record<string, unknown> | undefined
			return json(
				{ success: false, error: err.message, field_errors: body?.field_errors },
				{ status: err.status || 500 },
			)
		}
		return json({ success: false, error: 'Something went wrong.' }, { status: 500 })
	}
}
