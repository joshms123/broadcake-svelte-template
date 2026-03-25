<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte'

	let { nextCursor, baseUrl }: { nextCursor: string | null; baseUrl: string } = $props()

	const nextUrl = $derived.by(() => {
		if (!nextCursor) return null
		const url = new URL(baseUrl, 'http://localhost')
		url.searchParams.set('cursor', nextCursor)
		return `${url.pathname}${url.search}`
	})
</script>

{#if nextUrl}
	<nav aria-label="Pagination" class="mt-6 flex justify-center">
		<Button variant="outline" href={nextUrl}>
			Load more
		</Button>
	</nav>
{/if}
