import { getClient } from '$lib/sdk'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ url }) => {
	const bc = getClient()
	const shows = await bc.shows()
	const selectedGenre = url.searchParams.get('genre')

	// Extract unique genres across all shows
	const genreMap = new Map<string, { name: string; slug: string }>()
	for (const show of shows) {
		for (const genre of show.genres) {
			genreMap.set(genre.slug, { name: genre.name, slug: genre.slug })
		}
	}
	const genres = [...genreMap.values()].sort((a, b) => a.name.localeCompare(b.name))

	// Filter shows by genre if selected
	const filteredShows = selectedGenre
		? shows.filter((s) => s.genres.some((g) => g.slug === selectedGenre))
		: shows

	return {
		shows: filteredShows,
		genres,
		selectedGenre,
	}
}
