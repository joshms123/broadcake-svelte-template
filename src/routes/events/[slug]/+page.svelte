<script lang="ts">
	import PageMeta from '$lib/components/PageMeta.svelte'
	import EventTimeline from '$lib/components/EventTimeline.svelte'
	import { buildPageTitle } from '$lib/utils/seo'
	import { formatDateRange } from '$lib/utils/format'
	import Calendar from '@lucide/svelte/icons/calendar'
	import { renderMarkdown } from '$lib/utils/markdown'

	let { data } = $props()
	const title = $derived(buildPageTitle(data.event.name, data.config.siteName))
</script>

<PageMeta {title} description={data.event.description ?? `${data.event.name} at ${data.config.siteName}`} />

<a href="/events" class="mb-4 inline-block text-sm text-muted-foreground hover:text-foreground transition-colors">
	&larr; All Events
</a>

{#if data.event.cover_url}
	<img
		src={data.event.cover_url}
		alt=""
		class="mb-6 w-full rounded-lg object-cover"
		aria-hidden="true"
	/>
{/if}

<h2 class="text-3xl font-bold">{data.event.name}</h2>

<p class="mt-2 flex items-center gap-1.5 text-muted-foreground">
	<Calendar class="h-4 w-4" aria-hidden="true" />
	{formatDateRange(data.event.start_at, data.event.end_at)}
</p>

{#if data.event.description}
	<div class="mt-4 prose prose-sm dark:prose-invert max-w-none text-muted-foreground">{@html renderMarkdown(data.event.description)}</div>
{/if}

{#if data.event.shows.length > 0}
	<div class="mt-10">
		<h3 class="mb-6 text-xl font-semibold">Lineup</h3>
		<EventTimeline segments={data.event.shows} />
	</div>
{/if}
