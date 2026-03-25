<script lang="ts">
	import type { WeekScheduleDay } from '@techcake/broadcake-sdk'
	import DayColumn from './DayColumn.svelte'
	import { todayInTimezone } from '$lib/utils/format'

	let {
		days,
		timezone,
		showAutomation = true,
	}: {
		days: WeekScheduleDay[]
		timezone: string
		showAutomation?: boolean
	} = $props()

	const today = $derived(todayInTimezone(timezone))
</script>

<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
	{#each days as day (day.date)}
		<DayColumn
			date={day.date}
			slots={day.slots}
			{showAutomation}
			isToday={day.date === today}
		/>
	{/each}
</div>
