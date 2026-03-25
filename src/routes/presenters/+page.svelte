<script lang="ts">
	import PageMeta from '$lib/components/PageMeta.svelte'
	import PresenterCard from '$lib/components/PresenterCard.svelte'
	import { buildPageTitle } from '$lib/utils/seo'

	let { data } = $props()
	const title = $derived(buildPageTitle('Presenters', data.config.siteName))
</script>

<PageMeta {title} description="Meet the presenters of {data.config.siteName}" />

<h2 class="mb-6 text-2xl font-bold">Presenters</h2>

{#if data.presenters.length === 0}
	<p class="text-muted-foreground italic">No presenters found.</p>
{:else}
	<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
		{#each data.presenters as presenter (presenter.slug)}
			<PresenterCard {presenter} />
		{/each}
	</div>
{/if}
