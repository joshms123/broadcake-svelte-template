import { isPageEnabled } from '$lib/config'
import { error } from '@sveltejs/kit'
import type { Handle } from '@sveltejs/kit'

const PAGE_ROUTES: Record<string, 'schedule' | 'shows' | 'presenters' | 'archives' | 'events'> = {
	'/schedule': 'schedule',
	'/shows': 'shows',
	'/presenters': 'presenters',
	'/archives': 'archives',
	'/events': 'events',
}

export const handle: Handle = async ({ event, resolve }) => {
	for (const [prefix, page] of Object.entries(PAGE_ROUTES)) {
		if (event.url.pathname === prefix || event.url.pathname.startsWith(prefix + '/')) {
			if (!isPageEnabled(page)) {
				error(404, 'Page not found')
			}
		}
	}
	return resolve(event)
}
