<script lang="ts">
	import type { Show } from '@techcake/broadcake-sdk'
	import * as Card from '$lib/components/ui/card'
	import GenreBadge from './GenreBadge.svelte'
	import PresenterList from './PresenterList.svelte'

	let { show }: { show: Show } = $props()
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>
			<a href="/shows/{show.slug}" class="hover:text-primary transition-colors">
				{show.name}
			</a>
		</Card.Title>
		{#if show.description}
			<Card.Description class="line-clamp-2">{show.description}</Card.Description>
		{/if}
	</Card.Header>
	<Card.Content>
		{#if show.presenters.length > 0}
			<div class="text-sm">
				<PresenterList presenters={show.presenters} linked />
			</div>
		{/if}
		{#if show.genres.length > 0}
			<div class="mt-2 flex flex-wrap gap-1">
				{#each show.genres as genre (genre.slug)}
					<GenreBadge {genre} linked />
				{/each}
			</div>
		{/if}
	</Card.Content>
</Card.Root>
