import { getClient } from '$lib/sdk'
import { error } from '@sveltejs/kit'
import { BroadcakeError } from '@techcake/broadcake-sdk'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ params }) => {
	const bc = getClient()
	try {
		const presenter = await bc.presenter(params.slug)
		return { presenter }
	} catch (err) {
		if (err instanceof BroadcakeError) {
			error(err.status || 500, err.status === 404 ? 'Presenter not found' : 'Failed to load presenter')
		}
		throw err
	}
}
