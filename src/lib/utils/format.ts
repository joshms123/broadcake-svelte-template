import { format, parseISO } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'

/** Convert "HH:MM:SS" or "HH:MM" to 12-hour format like "7:00 AM". */
export function formatTime(time: string): string {
	const parts = time.split(':')
	let hours = parseInt(parts[0], 10)
	const minutes = parts[1] ?? '00'
	const period = hours >= 12 ? 'PM' : 'AM'
	if (hours === 0) hours = 12
	else if (hours > 12) hours -= 12
	return `${hours}:${minutes} ${period}`
}

/** Format "HH:MM:SS - HH:MM:SS" time range. */
export function formatTimeRange(start: string, end: string): string {
	return `${formatTime(start)} \u2013 ${formatTime(end)}`
}

/** Format "YYYY-MM-DD" to a human-readable date like "Monday, March 24". */
export function formatDate(dateStr: string): string {
	return format(parseISO(dateStr), 'EEEE, MMMM d')
}

/** Format "YYYY-MM-DD" to a short date like "Mon 24 Mar". */
export function formatDateShort(dateStr: string): string {
	return format(parseISO(dateStr), 'EEE d MMM')
}

/** Format ISO datetime range like "Jun 21 – Jun 22, 2026". */
export function formatDateRange(startIso: string, endIso: string): string {
	const start = parseISO(startIso)
	const end = parseISO(endIso)
	if (format(start, 'yyyy-MM-dd') === format(end, 'yyyy-MM-dd')) {
		return format(start, 'MMMM d, yyyy')
	}
	if (start.getFullYear() === end.getFullYear()) {
		return `${format(start, 'MMM d')} \u2013 ${format(end, 'MMM d, yyyy')}`
	}
	return `${format(start, 'MMM d, yyyy')} \u2013 ${format(end, 'MMM d, yyyy')}`
}

/** Get today's date string in a timezone. */
export function todayInTimezone(timezone: string): string {
	return format(toZonedTime(new Date(), timezone), 'yyyy-MM-dd')
}

/** Get current time string (HH:mm:ss) in a timezone. */
export function nowInTimezone(timezone: string): string {
	return format(toZonedTime(new Date(), timezone), 'HH:mm:ss')
}

/** Get the day name from a date string. */
export function getDayName(dateStr: string): string {
	return format(parseISO(dateStr), 'EEEE')
}

/**
 * Convert a time string from one timezone to another.
 * Uses a reference date for correct DST handling.
 * Returns the converted time as "HH:MM:SS".
 */
export function convertTime(
	time: string,
	fromTimezone: string,
	toTimezone: string,
	referenceDate?: string,
): string {
	// Build a full datetime in the source timezone
	const dateStr = referenceDate ?? todayInTimezone(fromTimezone)
	const [h, m, s] = time.split(':').map(Number)

	// Create a date object representing this time in the source timezone
	// by finding the UTC equivalent via Intl
	const sourceDate = new Date(`${dateStr}T${time.length <= 5 ? time + ':00' : time}`)

	// Get the offset difference
	const fromOffset = getTimezoneOffsetMinutes(fromTimezone, sourceDate)
	const toOffset = getTimezoneOffsetMinutes(toTimezone, sourceDate)
	const diffMinutes = fromOffset - toOffset

	let totalMinutes = h * 60 + (m || 0) + diffMinutes
	// Normalize to 0-1440
	totalMinutes = ((totalMinutes % 1440) + 1440) % 1440

	const newH = Math.floor(totalMinutes / 60)
	const newM = totalMinutes % 60
	return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}:00`
}

/** Get timezone offset in minutes from UTC (positive = ahead of UTC). */
function getTimezoneOffsetMinutes(timezone: string, date: Date): number {
	// Format the date in the target timezone and in UTC, then compute the difference
	const utcStr = date.toLocaleString('en-US', { timeZone: 'UTC' })
	const tzStr = date.toLocaleString('en-US', { timeZone: timezone })
	const utcDate = new Date(utcStr)
	const tzDate = new Date(tzStr)
	return (tzDate.getTime() - utcDate.getTime()) / 60000
}
