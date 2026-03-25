<script lang="ts">
	import type { Event } from '@techcake/broadcake-sdk'
	import { formatDateRange } from '$lib/utils/format'
	import * as Card from '$lib/components/ui/card'
	import Calendar from '@lucide/svelte/icons/calendar'

	let { event }: { event: Event } = $props()
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>
			<a href="/events/{event.slug}" class="hover:text-primary transition-colors">
				{event.name}
			</a>
		</Card.Title>
		<Card.Description class="flex items-center gap-1.5">
			<Calendar class="h-3.5 w-3.5" aria-hidden="true" />
			{formatDateRange(event.start_at, event.end_at)}
		</Card.Description>
	</Card.Header>
	{#if event.description}
		<Card.Content>
			<p class="text-sm text-muted-foreground line-clamp-3">{event.description}</p>
		</Card.Content>
	{/if}
</Card.Root>
