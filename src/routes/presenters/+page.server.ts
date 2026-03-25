import { getClient } from '$lib/sdk'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
	const bc = getClient()
	const presenters = await bc.presenters()
	return { presenters }
}
