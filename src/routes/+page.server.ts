import { getClient } from '$lib/sdk'
import { nowInTimezone } from '$lib/utils/format'
import type { PageServerLoad } from './$types'

const MAX_HOMEPAGE_SLOTS = 5

export const load: PageServerLoad = async ({ parent }) => {
	const bc = getClient()
	const [todaySchedule, parentData] = await Promise.all([bc.scheduleToday(), parent()])
	const broadcastDayStart = parentData.station.broadcast_day_start ?? '07:00:00'

	const now = nowInTimezone(todaySchedule.timezone)

	// Filter to upcoming slots, handling midnight-wrapping broadcast days.
	// Normalize times to a broadcast-day number line (minutes from broadcast day start)
	// so comparisons work correctly across midnight.
	function toMinutes(time: string): number {
		const [h, m] = time.split(':').map(Number)
		return h * 60 + (m || 0)
	}
	function normalizeToBroadcastDay(time: string, dayStart: string): number {
		const mins = toMinutes(time)
		const start = toMinutes(dayStart)
		return mins >= start ? mins - start : mins + 1440 - start
	}

	const nowNorm = normalizeToBroadcastDay(now, broadcastDayStart)
	const upcoming = todaySchedule.slots.filter((s) => {
		const endNorm = normalizeToBroadcastDay(s.slot_end, broadcastDayStart)
		// slot_end of 0 means end of broadcast day (1440 minutes)
		const effectiveEnd = endNorm === 0 ? 1440 : endNorm
		return effectiveEnd > nowNorm
	})
	const limited = upcoming.slice(0, MAX_HOMEPAGE_SLOTS)

	return {
		todaySchedule: {
			...todaySchedule,
			slots: limited,
		},
		hasMoreSlots: upcoming.length > MAX_HOMEPAGE_SLOTS,
		scheduleDate: todaySchedule.date,
	}
}
