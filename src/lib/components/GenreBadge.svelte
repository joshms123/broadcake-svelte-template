<script lang="ts">
	import Badge from '$lib/components/ui/badge/badge.svelte'
	import { isPageEnabled } from '$lib/config'

	let { genre, linked = false }: { genre: { name: string; slug: string }; linked?: boolean } = $props()

	const canLink = $derived(linked && isPageEnabled('shows'))
</script>

{#if canLink}
	<a href="/shows?genre={genre.slug}" class="no-underline">
		<Badge variant="secondary">{genre.name}</Badge>
	</a>
{:else}
	<Badge variant="secondary">{genre.name}</Badge>
{/if}
