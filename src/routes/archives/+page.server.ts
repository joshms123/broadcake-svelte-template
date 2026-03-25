import { getClient } from '$lib/sdk'
import { config } from '$lib/config'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ url }) => {
	const bc = getClient()
	const cursor = url.searchParams.get('cursor') ?? undefined
	const showSlug = url.searchParams.get('show') ?? undefined

	const [archives, shows] = await Promise.all([
		bc.archives({
			show: showSlug,
			cursor,
			limit: config.archivesPerPage,
		}),
		bc.shows(),
	])

	return {
		archives,
		shows,
		selectedShow: showSlug ?? null,
	}
}
