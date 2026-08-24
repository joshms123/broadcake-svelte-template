<script lang="ts">
	import type { ScheduleSlot as ScheduleSlotType } from '@techcake/broadcake-sdk'
	import { formatDateShort } from '$lib/utils/format'
	import ScheduleSlot from './ScheduleSlot.svelte'
	import { cn } from '$lib/utils'

	let {
		date,
		slots,
		showAutomation = true,
		isToday = false,
	}: {
		date: string
		slots: ScheduleSlotType[]
		showAutomation?: boolean
		isToday?: boolean
	} = $props()

	const filteredSlots = $derived(
		showAutomation ? slots : slots.filter((s) => s.source !== 'automation')
	)
</script>

<section aria-labelledby="day-{date}">
	<h3
		id="day-{date}"
		class={cn(
			'mb-3 text-sm font-semibold',
			isToday && 'text-primary',
		)}
	>
		<a href="/schedule/{date}" class="hover:underline">
			{formatDateShort(date)}
			{#if isToday}
				<span class="ml-1 text-xs font-normal text-primary">(Today)</span>
			{/if}
		</a>
	</h3>

	{#if filteredSlots.length === 0}
		<p class="text-sm text-muted-foreground italic">No shows scheduled</p>
	{:else}
		<div class="space-y-2">
			{#each filteredSlots as slot (slot.slot_start)}
				<ScheduleSlot {slot} compact />
			{/each}
		</div>
	{/if}
</section>
