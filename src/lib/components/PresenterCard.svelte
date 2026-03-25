<script lang="ts">
	import type { Presenter } from '@techcake/broadcake-sdk'
	import * as Card from '$lib/components/ui/card'

	let { presenter }: { presenter: Presenter } = $props()

	const initials = $derived(
		(presenter.display_name || '?')
			.split(' ')
			.map((w) => w[0])
			.join('')
			.slice(0, 2)
			.toUpperCase()
	)
</script>

<Card.Root>
	<Card.Header>
		<div class="flex items-center gap-3">
			{#if presenter.avatar_url}
				<img
					src={presenter.avatar_url}
					alt=""
					class="h-10 w-10 shrink-0 rounded-full object-cover"
				/>
			{:else}
				<div
					class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground"
					aria-hidden="true"
				>
					{initials}
				</div>
			{/if}
			<div>
				<Card.Title>
					<a href="/presenters/{presenter.slug}" class="hover:text-primary transition-colors">
						{presenter.display_name}
					</a>
				</Card.Title>
				{#if presenter.pronouns}
					<p class="text-sm text-muted-foreground">{presenter.pronouns}</p>
				{/if}
			</div>
		</div>
	</Card.Header>
	{#if presenter.bio || presenter.shows.length > 0}
		<Card.Content>
			{#if presenter.bio}
				<p class="text-sm text-muted-foreground line-clamp-2">{presenter.bio}</p>
			{/if}
			{#if presenter.shows.length > 0}
				<p class="mt-2 text-sm">
					<span class="text-muted-foreground">Shows:</span>
					{#each presenter.shows as show, i (show.slug)}
						{#if i > 0}, {/if}
						<a href="/shows/{show.slug}" class="hover:text-primary transition-colors">{show.name}</a>
					{/each}
				</p>
			{/if}
		</Card.Content>
	{/if}
</Card.Root>
