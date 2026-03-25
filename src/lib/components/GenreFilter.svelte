<script lang="ts">
	let {
		genres,
		selected,
		baseUrl,
	}: {
		genres: { name: string; slug: string }[]
		selected: string | null
		baseUrl: string
	} = $props()

	function buildUrl(genreSlug: string | null): string {
		const url = new URL(baseUrl, 'http://localhost')
		if (genreSlug) {
			url.searchParams.set('genre', genreSlug)
		} else {
			url.searchParams.delete('genre')
		}
		return `${url.pathname}${url.search}`
	}
</script>

{#if genres.length > 0}
	<nav aria-label="Filter by genre" class="flex flex-wrap gap-2">
		<a
			href={buildUrl(null)}
			class="rounded-full border px-3 py-1 text-sm transition-colors {!selected ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}"
			aria-current={!selected ? 'true' : undefined}
		>
			All
		</a>
		{#each genres as genre (genre.slug)}
			<a
				href={buildUrl(genre.slug)}
				class="rounded-full border px-3 py-1 text-sm transition-colors {selected === genre.slug ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}"
				aria-current={selected === genre.slug ? 'true' : undefined}
			>
				{genre.name}
			</a>
		{/each}
	</nav>
{/if}
