<!--
  Now Playing Block — shows the currently airing show.
  Displays show name, description, presenters, genres, and time slot.
  Only renders when a show is currently on air.

  Usage:
    <NowPlayingBlock now={data.nowPlaying.now} />
-->
<script lang="ts">
	import type { ScheduleSlot } from '@techcake/broadcake-sdk'
	import ScheduleSlotComponent from '../ScheduleSlot.svelte'

	let { now }: { now: ScheduleSlot | null } = $props()
</script>

{#if now}
	<section class="mb-10">
		<h3 class="mb-4 text-xl font-semibold">On Air Now</h3>
		<ScheduleSlotComponent slot={now} isNow />
	</section>
{/if}
