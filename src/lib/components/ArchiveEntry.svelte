<script lang="ts">
	import type { Archive, StationArchive } from '@techcake/broadcake-sdk'
	import { formatDate } from '$lib/utils/format'
	import * as Card from '$lib/components/ui/card'
	import ExternalLink from '@lucide/svelte/icons/external-link'

	let { archive, showShowName = false }: { archive: Archive | StationArchive; showShowName?: boolean } = $props()

	const stationArchive = $derived('show' in archive ? archive as StationArchive : null)
</script>

<Card.Root>
	<Card.Header>
		<Card.Title class="text-base">{archive.title}</Card.Title>
		<Card.Description>
			<time datetime={archive.aired_date}>{formatDate(archive.aired_date)}</time>
			{#if showShowName && stationArchive?.show}
				<span aria-hidden="true"> &middot; </span>
				<a href="/shows/{stationArchive.show.slug}" class="hover:text-foreground transition-colors">
					{stationArchive.show.name}
				</a>
			{/if}
		</Card.Description>
	</Card.Header>
	{#if archive.description || archive.archive_links.length > 0}
		<Card.Content>
			{#if archive.description}
				<p class="text-sm text-muted-foreground line-clamp-2">{archive.description}</p>
			{/if}
			{#if archive.archive_links.length > 0}
				<div class="mt-3 flex flex-wrap gap-2">
					{#each archive.archive_links as link (link.id)}
						<a
							href={link.url}
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm hover:bg-accent transition-colors"
							aria-label="{link.label} (opens in new tab)"
						>
							{link.label}
							<ExternalLink class="h-3.5 w-3.5" aria-hidden="true" />
						</a>
					{/each}
				</div>
			{/if}
		</Card.Content>
	{/if}
</Card.Root>
