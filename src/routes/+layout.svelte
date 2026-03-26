<!--
  SITE LAYOUT — Controls the overall page structure.

  You can rearrange, remove, or add components to change the site-wide layout.
  Current order: Nav → NowPlayingBar (audio player) → Page Content → Footer

  Common customizations:
    - Move NowPlayingBar below <main> for a bottom-sticky player
    - Remove NowPlayingBar entirely if you don't want a persistent player
    - Add a site-wide banner between Nav and NowPlayingBar
    - Add a sidebar by wrapping <main> in a flex container

  Data available via `data`:
    - data.station      — station detail (name, slug, timezone, streams, social_links)
    - data.nowPlaying   — { now, next } schedule slots
    - data.config       — merged site config (siteName, logo, links, etc.)
    - data.enabledPages — which pages are toggled on
-->
<script lang="ts">
	import { setContext } from 'svelte'
	import { ModeWatcher } from 'mode-watcher'
	import { afterNavigate } from '$app/navigation'
	import SkipLink from '$lib/components/SkipLink.svelte'
	import Nav from '$lib/components/Nav.svelte'
	import NowPlayingBar from '$lib/components/NowPlayingBar.svelte'
	import Footer from '$lib/components/Footer.svelte'
	import TimezoneIndicator from '$lib/components/TimezoneIndicator.svelte'
	import '../app.css'

	let { data, children } = $props()

	// Provide station timezone to all child components (used by SlotTime).
	// Station timezone is constant per site, so capturing it once is correct.
	// eslint-disable-next-line svelte/valid-compile -- intentionally capturing initial value
	setContext('stationTimezone', data.station.timezone)

	// Focus main content after navigation for screen readers
	afterNavigate(() => {
		const main = document.getElementById('main-content')
		if (main) main.focus()
	})
</script>

<ModeWatcher />
<SkipLink />
<Nav
	siteName={data.config.siteName}
	logo={data.config.logo}
	navigation={data.config.navigation}
	enabledPages={data.enabledPages}
	links={data.config.links}
	socialLinks={data.station.social_links ?? []}
	headerClass={data.config.headerClass}
/>
<NowPlayingBar
	initialNow={data.nowPlaying.now}
	initialNext={data.nowPlaying.next}
	stationSlug={data.station.slug}
	baseUrl={data.config.baseUrl}
	interval={data.config.nowPlayingInterval}
	listenUrl={data.station.listen_url}
	streams={data.station.streams ?? []}
/>
<TimezoneIndicator stationTimezone={data.station.timezone} />
<main id="main-content" tabindex="-1" class="mx-auto min-h-[60vh] max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
	{@render children()}
</main>
<Footer siteName={data.config.siteName} footerText={data.config.footerText} socialLinks={data.station.social_links ?? []} />
