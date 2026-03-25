<script lang="ts">
	import type { ScheduleSlot as ScheduleSlotType } from '@techcake/broadcake-sdk'
	import SlotTime from './SlotTime.svelte'
	import PresenterList from './PresenterList.svelte'
	import GenreBadge from './GenreBadge.svelte'
	import { cn } from '$lib/utils'

	let {
		slot,
		isNow = false,
		compact = false,
	}: {
		slot: ScheduleSlotType
		isNow?: boolean
		compact?: boolean
	} = $props()

	const isAutomation = $derived(slot.source === 'automation')
	const isCancelled = $derived(slot.override_type === 'cancellation')
	const showLink = $derived(slot.show_slug && !isAutomation ? `/shows/${slot.show_slug}` : null)
</script>

<article
	class={cn(
		'rounded-lg border p-4 transition-colors',
		isNow && 'border-primary bg-primary/5 ring-2 ring-primary/20',
		isAutomation && 'border-dashed bg-muted/50',
		isCancelled && 'border-destructive/30 bg-destructive/5 opacity-60',
		!isNow && !isAutomation && !isCancelled && 'bg-card',
	)}
	aria-current={isNow ? 'true' : undefined}
>
	<div class="flex items-start justify-between gap-4">
		<div class="min-w-0 flex-1">
			<div class="flex items-center gap-2">
				{#if isNow}
					<span class="relative flex h-2.5 w-2.5" aria-hidden="true">
						<span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
						<span class="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary"></span>
					</span>
				{/if}
				<h4 class="font-semibold leading-tight">
					{#if showLink}
						<a href={showLink} class="hover:text-primary transition-colors">{slot.show_name}</a>
					{:else}
						<span class={isAutomation ? 'text-muted-foreground italic' : ''}>{slot.show_name}</span>
					{/if}
				</h4>
			</div>

			{#if slot.show_tagline && !compact}
				<p class="mt-0.5 text-sm text-muted-foreground">{slot.show_tagline}</p>
			{/if}

			{#if slot.presenters.length > 0}
				<div class="mt-1 text-sm">
					<PresenterList presenters={slot.presenters} linked={!compact} />
				</div>
			{/if}

			{#if !compact && slot.genres.length > 0}
				<div class="mt-2 flex flex-wrap gap-1">
					{#each slot.genres as genre (genre.slug)}
						<GenreBadge {genre} linked />
					{/each}
				</div>
			{/if}

			{#if slot.is_repeat && slot.repeat_label}
				<span class="mt-1 inline-block text-xs text-muted-foreground italic">{slot.repeat_label}</span>
			{/if}
		</div>

		<div class="shrink-0 text-right text-sm text-muted-foreground">
			<SlotTime start={slot.slot_start} end={slot.slot_end} />
		</div>
	</div>
</article>
