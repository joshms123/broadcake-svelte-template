<script lang="ts">
	import PageMeta from '$lib/components/PageMeta.svelte'
	import ScheduleSlot from '$lib/components/ScheduleSlot.svelte'
	import { buildPageTitle } from '$lib/utils/seo'
	import { formatDate } from '$lib/utils/format'
	import { config } from '$lib/config'
	import ChevronLeft from '@lucide/svelte/icons/chevron-left'
	import ChevronRight from '@lucide/svelte/icons/chevron-right'
	import { addDays, format, parseISO } from 'date-fns'

	let { data } = $props()

	const formattedDate = $derived(formatDate(data.date))
	const title = $derived(buildPageTitle(formattedDate, data.config.siteName))
	const showAutomation = $derived(config.schedule?.showAutomation !== false)
	const filteredSlots = $derived(showAutomation ? data.slots : data.slots.filter(s => s.source !== 'automation'))

	const prevDate = $derived(format(addDays(parseISO(data.date), -1), 'yyyy-MM-dd'))
	const nextDate = $derived(format(addDays(parseISO(data.date), 1), 'yyyy-MM-dd'))
</script>

<PageMeta {title} description="Schedule for {formattedDate}" />

<div class="mb-6 flex items-center justify-between">
	<h2 class="text-2xl font-bold">{formattedDate}</h2>
	<nav aria-label="Day navigation" class="flex items-center gap-2">
		<a
			href="/schedule/{prevDate}"
			class="inline-flex h-9 w-9 items-center justify-center rounded-md border hover:bg-accent transition-colors"
			aria-label="Previous day"
		>
			<ChevronLeft class="h-4 w-4" />
		</a>
		<a
			href="/schedule/{nextDate}"
			class="inline-flex h-9 w-9 items-center justify-center rounded-md border hover:bg-accent transition-colors"
			aria-label="Next day"
		>
			<ChevronRight class="h-4 w-4" />
		</a>
	</nav>
</div>

<a href="/schedule" class="mb-6 inline-block text-sm text-muted-foreground hover:text-foreground transition-colors">
	&larr; Back to weekly view
</a>

{#if filteredSlots.length === 0}
	<p class="text-muted-foreground italic">No shows scheduled for this day.</p>
{:else}
	<div class="space-y-3">
		{#each filteredSlots as slot, i (i)}
			<ScheduleSlot {slot} />
		{/each}
	</div>
{/if}
