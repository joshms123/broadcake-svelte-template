<script lang="ts">
	import PageMeta from '$lib/components/PageMeta.svelte'
	import EventCard from '$lib/components/EventCard.svelte'
	import { buildPageTitle } from '$lib/utils/seo'

	let { data } = $props()
	const title = $derived(buildPageTitle('Events', data.config.siteName))
</script>

<PageMeta {title} description="Upcoming events at {data.config.siteName}" />

<h2 class="mb-6 text-2xl font-bold">Events</h2>

{#if data.events.length === 0}
	<p class="text-muted-foreground italic">No upcoming events.</p>
{:else}
	<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
		{#each data.events as event (event.slug)}
			<EventCard {event} />
		{/each}
	</div>
{/if}
