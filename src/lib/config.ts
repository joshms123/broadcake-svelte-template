import rawConfig from '../../broadcake.config'
import type { BroadcakeSiteConfig } from '../../broadcake.config'

export type { BroadcakeSiteConfig }

export const config: BroadcakeSiteConfig = {
	baseUrl: 'https://app.broadcake.com',
	nowPlayingInterval: 15_000,
	archivesPerPage: 20,
	schedule: {
		showAutomation: true,
		weekStartDay: 1,
	},
	...rawConfig,
}

type PageKey = keyof NonNullable<BroadcakeSiteConfig['pages']>

export function isPageEnabled(page: PageKey): boolean {
	return config.pages?.[page] !== false
}
