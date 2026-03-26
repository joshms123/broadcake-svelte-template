import { getClient } from '$lib/sdk'
import { config, isPageEnabled } from '$lib/config'
import { error } from '@sveltejs/kit'
import { BroadcakeError } from '@techcake/broadcake-sdk'
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async () => {
	const bc = getClient()

	let station
	let nowPlaying
	try {
		;[station, nowPlaying] = await Promise.all([bc.station(), bc.nowPlaying()])
	} catch (err) {
		if (err instanceof BroadcakeError) {
			error(err.status || 502, `Could not connect to station: ${err.message}`)
		}
		throw err
	}

	const enabledPages = {
		schedule: isPageEnabled('schedule'),
		shows: isPageEnabled('shows'),
		presenters: isPageEnabled('presenters'),
		archives: isPageEnabled('archives'),
		events: isPageEnabled('events'),
	}

	return {
		station,
		nowPlaying,
		config: {
			siteName: config.siteName ?? station.name,
			tagline: config.tagline,
			siteUrl: config.siteUrl,
			logo: config.logo,
			footerText: config.footerText,
			navigation: (config.navigation ?? null) as Array<{ label: string; href: string; external?: boolean }> | null,
			links: config.links ?? [],
			nowPlayingInterval: config.nowPlayingInterval ?? 15_000,
			baseUrl: config.baseUrl,
			headerClass: config.theme?.headerClass ?? '',
		},
		enabledPages,
	}
}
