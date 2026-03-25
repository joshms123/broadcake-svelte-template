<!--
  Today's Schedule Block — shows all slots for the current broadcast day.
  Includes a link to the full weekly schedule.

  Usage:
    <TodayScheduleBlock slots={data.todaySchedule.slots} />
-->
<script lang="ts">
	import type { ScheduleSlot } from '@techcake/broadcake-sdk'
	import ScheduleSlotComponent from '../ScheduleSlot.svelte'

	let { slots }: { slots: ScheduleSlot[] } = $props()
</script>

<section>
	<div class="mb-4 flex items-center justify-between">
		<h3 class="text-xl font-semibold">Today's Schedule</h3>
		<a href="/schedule" class="text-sm text-muted-foreground hover:text-foreground transition-colors">
			View full week &rarr;
		</a>
	</div>
	{#if slots.length === 0}
		<p class="text-muted-foreground italic">No shows scheduled for today.</p>
	{:else}
		<div class="space-y-3">
			{#each slots as slot, i (slot.show_slug ?? `auto-${i}`)}
				<ScheduleSlotComponent {slot} />
			{/each}
		</div>
	{/if}
</section>
