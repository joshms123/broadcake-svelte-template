<script lang="ts">
	import Badge from '$lib/components/ui/badge/badge.svelte'

	let { genre, linked = false }: { genre: { name: string; slug: string }; linked?: boolean } = $props()
</script>

{#if linked}
	<a href="/shows?genre={genre.slug}" class="no-underline">
		<Badge variant="secondary">{genre.name}</Badge>
	</a>
{:else}
	<Badge variant="secondary">{genre.name}</Badge>
{/if}
