import { getClient } from '$lib/sdk'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
	const bc = getClient()
	const events = await bc.events()
	return { events }
}
