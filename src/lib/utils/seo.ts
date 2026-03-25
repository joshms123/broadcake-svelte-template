import { config } from '$lib/config'

export interface MetaProps {
	title: string
	description?: string
	ogImage?: string
	type?: string
}

export function buildPageTitle(pageTitle: string, siteName: string): string {
	return `${pageTitle} | ${siteName}`
}

export function buildCanonicalUrl(path: string): string | undefined {
	if (!config.siteUrl) return undefined
	const base = config.siteUrl.replace(/\/+$/, '')
	return `${base}${path}`
}
