import { getClient } from '$lib/sdk'
import { config } from '$lib/config'
import { error } from '@sveltejs/kit'
import { BroadcakeError } from '@techcake/broadcake-sdk'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ params }) => {
	const bc = getClient()
	try {
		const [show, archives, schedule] = await Promise.all([
			bc.show(params.slug),
			bc.showArchives(params.slug, { limit: config.archivesPerPage }),
			bc.showSchedule(params.slug),
		])
		return { show, archives, schedule }
	} catch (err) {
		if (err instanceof BroadcakeError) {
			error(err.status || 500, err.status === 404 ? 'Show not found' : 'Failed to load show')
		}
		throw err
	}
}
