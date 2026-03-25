<script lang="ts">
	import { getContext } from 'svelte'
	import { formatTime, convertTime } from '$lib/utils/format'
	import { getVisitorTimezone, isTimezoneDifferent, getTimezoneAbbr } from '$lib/timezone.svelte'

	let {
		start,
		end,
		showDuration = false,
		referenceDate,
	}: {
		start: string
		end: string
		showDuration?: boolean
		/** Reference date (YYYY-MM-DD) for DST-correct conversion. */
		referenceDate?: string
	} = $props()

	const stationTimezone = getContext<string>('stationTimezone')

	const duration = $derived.by(() => {
		if (!showDuration) return ''
		const [sh, sm] = start.split(':').map(Number)
		const [eh, em] = end.split(':').map(Number)
		let mins = (eh * 60 + em) - (sh * 60 + sm)
		if (mins <= 0) mins += 1440
		const h = Math.floor(mins / 60)
		const m = mins % 60
		return h > 0 ? (m > 0 ? `${h}h ${m}m` : `${h}h`) : `${m}m`
	})

	const showLocal = $derived(stationTimezone ? isTimezoneDifferent(stationTimezone) : false)
	const visitorTz = $derived(getVisitorTimezone())

	const localStart = $derived(
		showLocal && visitorTz && stationTimezone
			? convertTime(start, stationTimezone, visitorTz, referenceDate)
			: null
	)
	const localEnd = $derived(
		showLocal && visitorTz && stationTimezone
			? convertTime(end, stationTimezone, visitorTz, referenceDate)
			: null
	)

	const stationAbbr = $derived(stationTimezone ? getTimezoneAbbr(stationTimezone) : null)
	const localAbbr = $derived(visitorTz ? getTimezoneAbbr(visitorTz) : null)
</script>

<span class="whitespace-nowrap">
	<time>{formatTime(start)}</time>
	<span aria-hidden="true"> &ndash; </span>
	<span class="sr-only"> to </span>
	<time>{formatTime(end)}</time>
	{#if stationAbbr && showLocal}
		<span class="text-xs text-muted-foreground"> {stationAbbr}</span>
	{/if}
	{#if showDuration && duration}
		<span class="text-muted-foreground text-sm"> ({duration})</span>
	{/if}
</span>
{#if showLocal && localStart && localEnd}
	<span class="whitespace-nowrap text-sm text-primary">
		<span class="sr-only">Your time: </span>
		<span aria-hidden="true"> / </span>
		<time>{formatTime(localStart)}</time>
		<span aria-hidden="true"> &ndash; </span>
		<span class="sr-only"> to </span>
		<time>{formatTime(localEnd)}</time>
		{#if localAbbr}
			<span class="text-xs"> {localAbbr}</span>
		{/if}
	</span>
{/if}
