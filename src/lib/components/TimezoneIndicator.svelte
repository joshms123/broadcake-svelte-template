<script lang="ts">
	import { isTimezoneDifferent, getTimezoneAbbr, getVisitorTimezone } from '$lib/timezone.svelte'
	import { browser } from '$app/environment'
	import Globe from '@lucide/svelte/icons/globe'

	let { stationTimezone }: { stationTimezone: string } = $props()

	const showIndicator = $derived(browser && isTimezoneDifferent(stationTimezone))
	const visitorTz = $derived(getVisitorTimezone())
	const stationAbbr = $derived(getTimezoneAbbr(stationTimezone))
	const localAbbr = $derived(visitorTz ? getTimezoneAbbr(visitorTz) : null)
</script>

{#if showIndicator && localAbbr}
	<div class="border-t bg-muted/50 text-center text-xs text-muted-foreground py-1.5">
		<Globe class="inline h-3 w-3 mr-1" aria-hidden="true" />
		Times shown in {stationAbbr}
		<span class="text-primary font-medium">/ your time: {localAbbr}</span>
	</div>
{/if}
