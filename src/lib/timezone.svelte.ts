import { browser } from '$app/environment'

/** The visitor's IANA timezone, detected from the browser. */
let visitorTimezone = $state<string | null>(null)

if (browser) {
	try {
		visitorTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
	} catch {
		// Fallback: timezone detection not supported
	}
}

export function getVisitorTimezone(): string | null {
	return visitorTimezone
}

/**
 * Check if the visitor's timezone differs from the station's.
 * Returns false if timezone can't be detected (SSR or unsupported browser).
 */
export function isTimezoneDifferent(stationTimezone: string): boolean {
	if (!visitorTimezone) return false
	return visitorTimezone !== stationTimezone
}

/**
 * Get a short timezone abbreviation for display (e.g. "GMT", "EST", "PST").
 * Uses a reference date to get the correct offset (DST-aware).
 */
export function getTimezoneAbbr(timezone: string, referenceDate?: Date): string {
	const date = referenceDate ?? new Date()
	try {
		// Extract timezone abbreviation from formatted date
		const parts = new Intl.DateTimeFormat('en-US', {
			timeZone: timezone,
			timeZoneName: 'short',
		}).formatToParts(date)
		return parts.find((p) => p.type === 'timeZoneName')?.value ?? timezone
	} catch {
		return timezone
	}
}
