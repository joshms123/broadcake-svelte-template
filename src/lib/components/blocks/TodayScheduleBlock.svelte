<!--
  Today's Schedule Block — shows upcoming slots for the current broadcast day.
  Past shows are filtered out server-side. Limited to ~5 slots with a link to view more.

  Usage:
    <TodayScheduleBlock slots={data.todaySchedule.slots} hasMore={data.hasMoreSlots} date={data.scheduleDate} />
-->
<script lang="ts">
	import type { ScheduleSlot } from '@techcake/broadcake-sdk'
	import ScheduleSlotComponent from '../ScheduleSlot.svelte'

	let {
		slots,
		hasMore = false,
		date,
	}: {
		slots: ScheduleSlot[]
		hasMore?: boolean
		date?: string
	} = $props()
</script>

<section>
	<div class="mb-4 flex items-center justify-between">
		<h3 class="text-xl font-semibold">Today's Schedule</h3>
		<a href="/schedule" class="text-sm text-muted-foreground hover:text-foreground transition-colors">
			View full week &rarr;
		</a>
	</div>
	{#if slots.length === 0}
		<p class="text-muted-foreground italic">No more shows scheduled for today.</p>
	{:else}
		<div class="space-y-3">
			{#each slots as slot, i (i)}
				<ScheduleSlotComponent {slot} />
			{/each}
		</div>
		{#if hasMore && date}
			<div class="mt-4 text-center">
				<a href="/schedule/{date}" class="text-sm text-muted-foreground hover:text-foreground transition-colors">
					View full day &rarr;
				</a>
			</div>
		{/if}
	{/if}
</section>
