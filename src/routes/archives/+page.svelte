<script lang="ts">
	import PageMeta from '$lib/components/PageMeta.svelte'
	import ArchiveList from '$lib/components/ArchiveList.svelte'
	import { buildPageTitle } from '$lib/utils/seo'
	import { page } from '$app/state'

	let { data } = $props()
	const title = $derived(buildPageTitle('Archives', data.config.siteName))

	function showFilterUrl(slug: string | null): string {
		const url = new URL(page.url)
		if (slug) {
			url.searchParams.set('show', slug)
		} else {
			url.searchParams.delete('show')
		}
		url.searchParams.delete('cursor')
		return `${url.pathname}${url.search}`
	}
</script>

<PageMeta {title} description="Past shows and recordings from {data.config.siteName}" />

<h2 class="mb-6 text-2xl font-bold">Archives</h2>

{#if data.shows.length > 1}
	<div class="mb-6">
		<label for="show-filter" class="sr-only">Filter by show</label>
		<nav aria-label="Filter by show" class="flex flex-wrap gap-2">
			<a
				href={showFilterUrl(null)}
				class="rounded-full border px-3 py-1 text-sm transition-colors {!data.selectedShow ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}"
				aria-current={!data.selectedShow ? 'true' : undefined}
			>
				All Shows
			</a>
			{#each data.shows as show}
				<a
					href={showFilterUrl(show.slug)}
					class="rounded-full border px-3 py-1 text-sm transition-colors {data.selectedShow === show.slug ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}"
					aria-current={data.selectedShow === show.slug ? 'true' : undefined}
				>
					{show.name}
				</a>
			{/each}
		</nav>
	</div>
{/if}

<ArchiveList
	archives={data.archives.data}
	nextCursor={data.archives.next_cursor}
	showShowName={!data.selectedShow}
	baseUrl={page.url.href}
/>

{#if data.archives.count > 0}
	<p class="mt-4 text-sm text-muted-foreground">
		{data.archives.count} {data.archives.count === 1 ? 'archive' : 'archives'} total
	</p>
{/if}
