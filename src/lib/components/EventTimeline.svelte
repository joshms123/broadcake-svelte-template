<script lang="ts">
	import type { EventSegment } from '@techcake/broadcake-sdk'
	import SlotTime from './SlotTime.svelte'
	import PresenterList from './PresenterList.svelte'
	import { formatDate } from '$lib/utils/format'

	let { segments }: { segments: EventSegment[] } = $props()

	const sorted = $derived([...segments].sort((a, b) => a.display_order - b.display_order))

	// Group segments by date
	const byDate = $derived.by(() => {
		const map = new Map<string, EventSegment[]>()
		for (const seg of sorted) {
			const key = seg.show_date
			if (!map.has(key)) map.set(key, [])
			map.get(key)!.push(seg)
		}
		return [...map.entries()]
	})
</script>

{#if sorted.length === 0}
	<p class="text-muted-foreground italic">No schedule announced yet.</p>
{:else}
	{#each byDate as [date, segs]}
		<div class="mb-8">
			<h3 class="mb-4 text-lg font-semibold">{formatDate(date)}</h3>
			<div class="relative ml-4 border-l-2 border-border pl-6 space-y-6">
				{#each segs as seg}
					<div class="relative">
						<div
							class="absolute -left-[calc(1.5rem+1px)] top-1 h-3 w-3 rounded-full border-2 border-primary bg-background"
							aria-hidden="true"
						></div>
						<div>
							<h4 class="font-medium">
								{seg.show?.name ?? seg.custom_name ?? 'TBA'}
								{#if seg.show}
									<a href="/shows/{seg.show.slug}" class="text-sm text-muted-foreground hover:text-primary transition-colors ml-1">
										View show
									</a>
								{/if}
							</h4>
							<div class="text-sm text-muted-foreground">
								<SlotTime start={seg.start_time} end={seg.end_time} />
							</div>
							{#if seg.presenters.length > 0}
								<div class="mt-1 text-sm">
									<PresenterList presenters={seg.presenters} linked />
								</div>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/each}
{/if}
