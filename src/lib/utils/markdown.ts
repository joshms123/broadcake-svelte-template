import snarkdown from 'snarkdown'

const DANGEROUS_TAGS = /<\/?(?:script|iframe|object|embed|form|input|textarea|button|select|style|link|meta|base)[^>]*>/gi

/**
 * Render markdown to sanitized HTML.
 * Uses snarkdown (1KB) for basic markdown: bold, italic, links, lists, headings, code.
 * Strips dangerous HTML tags to prevent XSS from user-authored content.
 */
export function renderMarkdown(text: string): string {
	const html = snarkdown(text)
	return html.replace(DANGEROUS_TAGS, '')
}
