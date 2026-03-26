<script lang="ts">
	import type { Show } from '@techcake/broadcake-sdk'
	import * as Card from '$lib/components/ui/card'
	import GenreBadge from './GenreBadge.svelte'
	import PresenterList from './PresenterList.svelte'

	let { show }: { show: Show } = $props()

	const MAX_DESC = 120
	const truncatedDesc = $derived(
		show.description && show.description.length > MAX_DESC
			? show.description.slice(0, MAX_DESC).trimEnd() + '…'
			: show.description
	)
</script>

<Card.Root class="flex h-full flex-col">
	<Card.Header>
		<Card.Title>
			<a href="/shows/{show.slug}" class="hover:text-primary transition-colors">
				{show.name}
			</a>
		</Card.Title>
		{#if truncatedDesc}
			<Card.Description>{truncatedDesc}</Card.Description>
		{/if}
	</Card.Header>
	<Card.Content class="flex flex-1 flex-col">
		{#if show.presenters.length > 0}
			<div class="text-sm">
				<PresenterList presenters={show.presenters} linked />
			</div>
		{/if}
		{#if show.genres.length > 0}
			<div class="mt-auto flex flex-wrap gap-1 pt-2">
				{#each show.genres as genre (genre.slug)}
					<GenreBadge {genre} linked />
				{/each}
			</div>
		{/if}
	</Card.Content>
</Card.Root>
