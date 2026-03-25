export interface BroadcakeTheme {
	/** Primary brand color in oklch format (e.g. "oklch(0.65 0.25 260)") */
	primary: string
	/** Primary foreground (text on primary bg). Defaults to white. */
	primaryForeground?: string
}

export interface BroadcakeSiteConfig {
	/** Station slug as registered in Broadcake (required) */
	stationSlug: string

	/** Broadcake API base URL. Defaults to "https://app.broadcake.com" */
	baseUrl?: string

	/** Site display name. Falls back to station name from API. */
	siteName?: string

	/** Site tagline for meta description / hero area */
	tagline?: string

	/** Absolute URL where this site is deployed (used for OG tags, canonical URLs) */
	siteUrl?: string

	/** Path to logo image in static/ directory (e.g. "/logo.svg") */
	logo?: string

	/** Theme customization */
	theme?: {
		light?: Partial<BroadcakeTheme>
		dark?: Partial<BroadcakeTheme>
	}

	/** Toggle listing pages on/off. All default to true.
	 *  Detail pages (/shows/[slug], /presenters/[slug], /events/[slug]) always work
	 *  even when their listing page is disabled, so links from the schedule etc. aren't broken.
	 */
	pages?: {
		schedule?: boolean
		shows?: boolean
		presenters?: boolean
		archives?: boolean
		events?: boolean
	}

	/** Navigation items shown in the nav bar (and mobile menu).
	 *  Replaces the auto-generated page list + links. You control the exact items, order, and labels.
	 *  Internal routes: { label: 'Schedule', href: '/schedule' }
	 *  External links: { label: 'Listen Live', href: 'https://...', external: true }
	 *  Custom pages: { label: 'About', href: '/about' }
	 *
	 *  If omitted, auto-generates nav from enabled pages (backwards compatible).
	 */
	navigation?: Array<{
		label: string
		href: string
		external?: boolean
	}>

	/** @deprecated Use `navigation` instead. Kept for backwards compatibility. */
	links?: Array<{
		label: string
		href: string
		external?: boolean
	}>

	/** Footer text / copyright line */
	footerText?: string

	/** Now-playing polling interval in ms. Defaults to 15000. Set 0 to disable. */
	nowPlayingInterval?: number

	/** Number of archives per page. Defaults to 20. */
	archivesPerPage?: number

	/** CAPTCHA protection for forms. Omit to disable. */
	captcha?: {
		provider: 'turnstile'
		/** Cloudflare Turnstile site key (public). Secret key goes in TURNSTILE_SECRET_KEY env var. */
		siteKey: string
	}

	/** Schedule display preferences */
	schedule?: {
		/** Show automation (auto DJ) slots. Defaults to true. */
		showAutomation?: boolean
		/** Default week start day: 0=Sun, 1=Mon. Defaults to 1. */
		weekStartDay?: 0 | 1
	}
}

const config: BroadcakeSiteConfig = {
	stationSlug: 'cake-fm',
	baseUrl: 'http://localhost:5173',
	// siteName: 'My Radio Station',
	// tagline: 'Your community station',
	// siteUrl: 'https://mystation.com',
	// logo: '/logo.svg',
	// theme: {
	// 	light: { primary: 'oklch(0.55 0.25 30)' },
	// 	dark: { primary: 'oklch(0.75 0.2 30)' },
	// },
	// pages: { schedule: true, shows: true, presenters: true, archives: true, events: true },
	// links: [{ label: 'Listen Live', href: 'https://...', external: true }],
	// footerText: '© 2026 My Radio Station',
	// nowPlayingInterval: 15000,
	// archivesPerPage: 20,
	// schedule: { showAutomation: true, weekStartDay: 1 },
}

export default config
