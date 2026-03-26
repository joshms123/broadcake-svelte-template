import { getClient } from '$lib/sdk'
import { nowInTimezone } from '$lib/utils/format'
import type { PageServerLoad } from './$types'

const MAX_HOMEPAGE_SLOTS = 5

export const load: PageServerLoad = async () => {
	const bc = getClient()
	const todaySchedule = await bc.scheduleToday()

	const now = nowInTimezone(todaySchedule.timezone)
	// Keep slots that haven't ended yet (currently playing + upcoming)
	const upcoming = todaySchedule.slots.filter((s) => s.slot_end > now)
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
