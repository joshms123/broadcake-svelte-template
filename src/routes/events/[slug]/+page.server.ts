import { getClient } from '$lib/sdk'
import { error } from '@sveltejs/kit'
import { BroadcakeError } from '@techcake/broadcake-sdk'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ params }) => {
	const bc = getClient()
	try {
		const event = await bc.event(params.slug)
		return { event }
	} catch (err) {
		if (err instanceof BroadcakeError) {
			error(err.status || 500, err.status === 404 ? 'Event not found' : 'Failed to load event')
		}
		throw err
	}
}
