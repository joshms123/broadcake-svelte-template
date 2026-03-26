<script lang="ts">
	import type { WeekScheduleDay } from '@techcake/broadcake-sdk'
	import DayColumn from './DayColumn.svelte'
	import { todayInTimezone } from '$lib/utils/format'
	import { parseISO, format } from 'date-fns'
	import { cn } from '$lib/utils'

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

	// Mobile: selected day tab (defaults to today, or first day)
	const defaultIndex = $derived.by(() => {
		const idx = days.findIndex((d) => d.date === today)
		return idx >= 0 ? idx : 0
	})
	let userSelectedIndex = $state<number | null>(null)
	const selectedIndex = $derived(userSelectedIndex ?? defaultIndex)
	const selectedDay = $derived(days[selectedIndex])

	function formatTabDay(dateStr: string): string {
		return format(parseISO(dateStr), 'EEE')
	}

	function formatTabDate(dateStr: string): string {
		return format(parseISO(dateStr), 'd')
	}
</script>

<!-- Mobile: Day tabs + single day view -->
<div class="sm:hidden">
	<div
		class="mb-4 flex gap-1 overflow-x-auto scrollbar-hide"
		role="tablist"
		aria-label="Day selector"
	>
		{#each days as day, i (day.date)}
			<button
				role="tab"
				aria-selected={i === selectedIndex}
				aria-controls="mobile-day-panel"
				class={cn(
					'flex min-w-[3.5rem] flex-col items-center rounded-lg px-3 py-2 text-sm transition-colors',
					i === selectedIndex
						? 'bg-primary text-primary-foreground font-semibold'
						: 'bg-muted/50 hover:bg-muted',
					day.date === today && i !== selectedIndex && 'ring-2 ring-primary/30',
				)}
				onclick={() => (userSelectedIndex = i)}
			>
				<span class="text-xs">{formatTabDay(day.date)}</span>
				<span class="text-lg font-bold leading-tight">{formatTabDate(day.date)}</span>
			</button>
		{/each}
	</div>

	{#if selectedDay}
		<div id="mobile-day-panel" role="tabpanel">
			<DayColumn
				date={selectedDay.date}
				slots={selectedDay.slots}
				{showAutomation}
				isToday={selectedDay.date === today}
			/>
		</div>
	{/if}
</div>

<!-- Desktop: Grid view -->
<div class="hidden gap-6 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
	{#each days as day (day.date)}
		<DayColumn
			date={day.date}
			slots={day.slots}
			{showAutomation}
			isToday={day.date === today}
		/>
	{/each}
</div>
