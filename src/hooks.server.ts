import { isPageEnabled } from '$lib/config'
import { error } from '@sveltejs/kit'
import type { Handle } from '@sveltejs/kit'

/**
 * Only block LISTING pages when disabled.
 * Detail pages (/shows/[slug], /presenters/[slug], etc.) always work
 * so links from the schedule, other pages, and direct URLs aren't broken.
 */
const LISTING_ROUTES: Record<string, 'schedule' | 'shows' | 'presenters' | 'archives' | 'events'> = {
	'/schedule': 'schedule',
	'/shows': 'shows',
	'/presenters': 'presenters',
	'/archives': 'archives',
	'/events': 'events',
}

export const handle: Handle = async ({ event, resolve }) => {
	const { pathname } = event.url

	for (const [route, page] of Object.entries(LISTING_ROUTES)) {
		if (!isPageEnabled(page)) {
			// Block the exact listing page (e.g. /shows)
			if (pathname === route) {
				error(404, 'Page not found')
			}
			// For schedule, also block sub-routes like /schedule/2026-03-25
			// since the schedule page IS the detail page
			if (page === 'schedule' && pathname.startsWith(route + '/')) {
				error(404, 'Page not found')
			}
			// For archives, block sub-routes too (archives don't have meaningful standalone detail pages)
			if (page === 'archives' && pathname.startsWith(route + '/')) {
				error(404, 'Page not found')
			}
			// Shows, presenters, events: detail pages (/shows/[slug], etc.) remain accessible
		}
	}
	return resolve(event)
}
