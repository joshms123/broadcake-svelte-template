<!--
  HOMEPAGE — Compose your station's homepage by arranging blocks below.

  Available blocks (import from '$lib/components/blocks/'):
    - HeroBlock        — Full-width banner image with optional tagline overlay.
    - NowPlayingBlock  — Shows the currently airing show (auto-hides when nothing is on).
    - TodayScheduleBlock — Lists all shows for today with a link to the full week.
    - ContentBlock     — Titled section with a slot for custom HTML/Svelte content.

  You can freely rearrange, remove, or add blocks. The data object provides:
    - data.nowPlaying.now   — current show (ScheduleSlot | null)
    - data.todaySchedule    — { slots: ScheduleSlot[], date, timezone }
    - data.config.siteName  — station display name
    - data.config.tagline   — station tagline

  Examples:
    Add a hero image:
      <HeroBlock image="/hero.jpg" tagline="Your station tagline" />

    Add custom content:
      <ContentBlock title="Welcome!">
        <p>We are a community radio station based in...</p>
      </ContentBlock>

    Remove the schedule:
      Just delete the <TodayScheduleBlock> line.
-->
<script lang="ts">
	import PageMeta from '$lib/components/PageMeta.svelte'
	import TodayScheduleBlock from '$lib/components/blocks/TodayScheduleBlock.svelte'
	import { buildPageTitle } from '$lib/utils/seo'

	let { data } = $props()
	const title = $derived(buildPageTitle('Home', data.config.siteName))
</script>

<PageMeta {title} description={data.config.tagline} />

<div class="mb-12 text-center">
	<h2 class="text-3xl font-bold sm:text-4xl">{data.config.siteName}</h2>
	{#if data.config.tagline}
		<p class="mt-2 text-lg text-muted-foreground">{data.config.tagline}</p>
	{/if}
</div>

<!-- Arrange, remove, or add blocks below to customize your homepage.
     The NowPlayingBar in the layout already shows what's on air.
     To add it back: import NowPlayingBlock and add <NowPlayingBlock now={data.nowPlaying.now} /> -->

<TodayScheduleBlock slots={data.todaySchedule.slots} hasMore={data.hasMoreSlots} date={data.scheduleDate} />
