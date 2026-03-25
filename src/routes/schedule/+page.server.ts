import { getClient } from '$lib/sdk'
import { config } from '$lib/config'
import { todayInTimezone } from '$lib/utils/format'
import { addDays, format, startOfWeek, parseISO } from 'date-fns'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ url, parent }) => {
	const { station } = await parent()
	const bc = getClient()

	const weekParam = url.searchParams.get('week')
	const today = todayInTimezone(station.timezone)
	const weekStartDay = config.schedule?.weekStartDay ?? 1

	const baseDate = weekParam ? parseISO(weekParam) : parseISO(today)
	const weekStart = startOfWeek(baseDate, { weekStartsOn: weekStartDay as 0 | 1 })
	const from = format(weekStart, 'yyyy-MM-dd')
	const to = format(addDays(weekStart, 6), 'yyyy-MM-dd')

	const week = await bc.schedule({ from, to })
	const prevWeek = format(addDays(weekStart, -7), 'yyyy-MM-dd')
	const nextWeek = format(addDays(weekStart, 7), 'yyyy-MM-dd')

	return {
		week,
		today,
		prevWeek,
		nextWeek,
	}
}
