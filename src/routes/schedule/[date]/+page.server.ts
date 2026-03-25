import { getClient } from '$lib/sdk'
import { error } from '@sveltejs/kit'
import { BroadcakeError } from '@techcake/broadcake-sdk'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ params }) => {
	const { date } = params
	if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
		error(400, 'Invalid date format. Use YYYY-MM-DD.')
	}

	const bc = getClient()
	try {
		const slots = await bc.schedule(date)
		return { slots, date }
	} catch (err) {
		if (err instanceof BroadcakeError) {
			error(err.status || 500, err.message)
		}
		throw err
	}
}
