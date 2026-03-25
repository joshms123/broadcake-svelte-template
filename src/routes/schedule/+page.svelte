<script lang="ts">
	import PageMeta from '$lib/components/PageMeta.svelte'
	import ScheduleGrid from '$lib/components/ScheduleGrid.svelte'
	import { buildPageTitle } from '$lib/utils/seo'
	import { formatDateShort } from '$lib/utils/format'
	import { config } from '$lib/config'
	import ChevronLeft from '@lucide/svelte/icons/chevron-left'
	import ChevronRight from '@lucide/svelte/icons/chevron-right'

	let { data } = $props()
	const title = $derived(buildPageTitle('Schedule', data.config.siteName))
	const showAutomation = $derived(config.schedule?.showAutomation !== false)
</script>

<PageMeta {title} description="Weekly schedule for {data.config.siteName}" />

<div class="mb-6 flex items-center justify-between">
	<h2 class="text-2xl font-bold">Schedule</h2>
	<nav aria-label="Week navigation" class="flex items-center gap-2">
		<a
			href="/schedule?week={data.prevWeek}"
			class="inline-flex h-9 w-9 items-center justify-center rounded-md border hover:bg-accent transition-colors"
			aria-label="Previous week"
		>
			<ChevronLeft class="h-4 w-4" />
		</a>
		<span class="text-sm text-muted-foreground">
			{formatDateShort(data.week.from)} &ndash; {formatDateShort(data.week.to)}
		</span>
		<a
			href="/schedule?week={data.nextWeek}"
			class="inline-flex h-9 w-9 items-center justify-center rounded-md border hover:bg-accent transition-colors"
			aria-label="Next week"
		>
			<ChevronRight class="h-4 w-4" />
		</a>
	</nav>
</div>

<ScheduleGrid
	days={data.week.days}
	timezone={data.week.timezone}
	{showAutomation}
/>
