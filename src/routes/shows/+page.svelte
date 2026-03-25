<script lang="ts">
	import PageMeta from '$lib/components/PageMeta.svelte'
	import ShowCard from '$lib/components/ShowCard.svelte'
	import GenreFilter from '$lib/components/GenreFilter.svelte'
	import { buildPageTitle } from '$lib/utils/seo'

	let { data } = $props()
	const title = $derived(buildPageTitle('Shows', data.config.siteName))
</script>

<PageMeta {title} description="Shows on {data.config.siteName}" />

<h2 class="mb-6 text-2xl font-bold">Shows</h2>

<div class="mb-6">
	<GenreFilter genres={data.genres} selected={data.selectedGenre} baseUrl="/shows" />
</div>

{#if data.shows.length === 0}
	<p class="text-muted-foreground italic">No shows found.</p>
{:else}
	<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
		{#each data.shows as show (show.slug)}
			<ShowCard {show} />
		{/each}
	</div>
{/if}
