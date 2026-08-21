import snarkdown from 'snarkdown'
import DOMPurify from 'isomorphic-dompurify'

/**
 * Tags snarkdown can emit, plus the inline formatting people reasonably write
 * by hand. Anything not listed here is stripped.
 */
const ALLOWED_TAGS = [
	'a',
	'blockquote',
	'br',
	'code',
	'del',
	'em',
	'h1',
	'h2',
	'h3',
	'h4',
	'h5',
	'h6',
	'hr',
	'img',
	'li',
	'ol',
	'p',
	'pre',
	'strong',
	'ul'
]

const ALLOWED_ATTR = ['href', 'title', 'alt', 'src']

// Force external links to open safely. DOMPurify runs this on every <a> it keeps.
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
	if (node.tagName === 'A' && node.getAttribute('href')?.startsWith('http')) {
		node.setAttribute('target', '_blank')
		node.setAttribute('rel', 'noopener noreferrer')
	}
})

/**
 * Render markdown to sanitized HTML.
 *
 * Uses snarkdown for basic markdown (bold, italic, links, lists, headings,
 * code), then sanitizes with DOMPurify against an explicit allowlist.
 *
 * The allowlist matters: snarkdown passes raw HTML straight through, and this
 * output is injected with {@html}. A previous version filtered a blocklist of
 * tag names with a regex, which let every event-handler attribute through
 * (`<img src=x onerror=...>`) and could even reassemble a <script> tag out of
 * its own output (`<scr<script>ipt>`). Never filter HTML with a blocklist.
 */
export function renderMarkdown(text: string): string {
	if (!text) return ''
	return DOMPurify.sanitize(snarkdown(text), { ALLOWED_TAGS, ALLOWED_ATTR })
}
