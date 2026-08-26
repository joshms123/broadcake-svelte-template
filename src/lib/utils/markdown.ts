import snarkdown from 'snarkdown'
import { FilterXSS } from 'xss'

/**
 * Sanitising without a DOM, because this runtime has not got one.
 *
 * This used `isomorphic-dompurify`, which supplies jsdom on the server. jsdom
 * needs Node built-ins the Workers runtime does not have, and the import runs
 * when the module loads — so every route importing this file returned a 500 on
 * a direct request, whether or not anything called renderMarkdown, while the
 * same page reached by clicking a link rendered fine because it ran in the
 * browser. That asymmetry is the tell for a render-time dependency the server
 * cannot satisfy.
 *
 * Handing DOMPurify a JavaScript DOM instead (linkedom) looks like the smaller
 * change and is worse than the bug: DOMPurify does not recognise it, sets
 * `isSupported` to undefined, and `sanitize()` then returns its input
 * unchanged. A sanitiser that quietly stops sanitising is not a fix. Measured,
 * not assumed — `<script>alert(1)</script>` came back whole.
 *
 * js-xss parses the HTML itself and needs no DOM at all, so it behaves the same
 * on the Workers runtime as it does under Node.
 */

/**
 * Tags snarkdown can emit, plus the inline formatting people reasonably write
 * by hand, each with the attributes it may keep. Anything not listed here is
 * stripped.
 *
 * `target` and `rel` are deliberately absent: they are added below, after
 * sanitising, so a bio cannot set them itself.
 */
const ALLOWED: Record<string, string[]> = {
	a: ['href', 'title'],
	blockquote: [],
	br: [],
	code: [],
	del: [],
	em: [],
	h1: [],
	h2: [],
	h3: [],
	h4: [],
	h5: [],
	h6: [],
	hr: [],
	img: ['src', 'alt', 'title'],
	li: [],
	ol: [],
	p: [],
	pre: [],
	strong: [],
	ul: []
}

const filter = new FilterXSS({
	whiteList: ALLOWED,
	// A tag that is not on the list loses its markup but keeps its text, which
	// is what DOMPurify did. script and style lose their contents too, since
	// their text is the payload rather than something someone wrote to read.
	stripIgnoreTag: true,
	stripIgnoreTagBody: ['script', 'style']
})

/**
 * Anchors pointing off-site, matched against output that has already been
 * sanitised — the href cannot contain a bare quote by this point, so there is
 * nothing here to break out of. This is not filtering, which must never be
 * done with a pattern; it adds attributes to markup already known to be safe.
 */
const EXTERNAL_ANCHOR = /<a href="(https?:\/\/[^"]*)"/g

/**
 * Render markdown to sanitized HTML.
 *
 * Uses snarkdown for basic markdown (bold, italic, links, lists, headings,
 * code), then sanitizes against an explicit allowlist.
 *
 * The allowlist matters: snarkdown passes raw HTML straight through, and this
 * output is injected with {@html}. A previous version filtered a blocklist of
 * tag names with a regex, which let every event-handler attribute through
 * (`<img src=x onerror=...>`) and could even reassemble a <script> tag out of
 * its own output (`<scr<script>ipt>`). Never filter HTML with a blocklist.
 */
export function renderMarkdown(text: string): string {
	if (!text) return ''
	const clean = filter.process(snarkdown(text))
	return clean.replace(EXTERNAL_ANCHOR, '<a href="$1" target="_blank" rel="noopener noreferrer"')
}
