# Broadcake Site Template

Cloneable SvelteKit station website. Synced to a public repo on push to main, so
anything committed here ships to station owners.

> **Scope**: this package only. Cross-cutting conventions (Svelte 5 runes,
> accessibility) are in the root `CLAUDE.md`.

## Site Template (`packages/site-template/`)

Cloneable SvelteKit website for station owners. Connects to the v1 API via `@techcake/broadcake-sdk`. Lives in the private monorepo during development, will be pushed to a public repo for distribution.

**Stack:** SvelteKit 2.x + Svelte 5 runes, Tailwind CSS v4, shadcn-svelte (subset: badge, button, card, select, separator, skeleton, toggle, tooltip), date-fns + date-fns-tz, mode-watcher, @lucide/svelte, @icons-pack/svelte-simple-icons, snarkdown, @sveltejs/adapter-auto.

**Configuration:** Station owners edit `broadcake.config.ts` at the project root:
- `stationSlug` (required) — station slug from Broadcake
- `baseUrl` — API URL (defaults to `https://app.broadcake.com`)
- `siteName`, `tagline`, `siteUrl`, `logo` — branding
- `theme.light.primary` / `theme.dark.primary` — oklch color overrides
- `pages` — toggle routes on/off (schedule, shows, presenters, archives, events, forms)
- `links` — external nav/footer links (e.g. "Listen Live")
- `navigation` — optional array of `{ label, href, external? }` objects that replaces auto-generated nav + `links`. When set, gives full control over nav items and order. Without it, falls back to auto-generated page nav + `links`
- `captcha` — optional `{ provider: 'turnstile', siteKey: string }` for Cloudflare Turnstile CAPTCHA on forms. Secret key via `TURNSTILE_SECRET_KEY` env var
- `nowPlayingInterval` — polling interval in ms (0 to disable)
- `archivesPerPage`, `schedule.showAutomation`, `schedule.weekStartDay`

**Routes:**
```
/                    Home (now playing + today's schedule)
/schedule            Weekly grid (week nav via ?week=YYYY-MM-DD)
/schedule/[date]     Single day detail
/shows               Show listing with genre filter (?genre=slug)
/shows/[slug]        Show detail + per-show archives
/presenters          Presenter grid
/presenters/[slug]   Presenter detail with their shows
/archives            Browse archives (paginated, show filter)
/events              Event listing
/events/[slug]       Event detail with segment timeline
/forms               Form listing (open forms)
/forms/[slug]        Form detail + FormRenderer
```

**Page toggle system:** `hooks.server.ts` checks disabled pages and throws 404. `Nav.svelte` hides disabled pages from navigation. No per-route guards needed. Listing pages (`/shows`, `/presenters`, etc.) are toggled on/off, but detail pages (`/shows/[slug]`, `/presenters/[slug]`) always remain accessible regardless of listing toggle. Back-links on detail pages conditionally show based on whether the listing is enabled, with fallback to Home.

**Component architecture (no duplication):**
- Atomic: SlotTime, GenreBadge, PresenterList, PageMeta, SkipLink, ThemeToggle, Pagination, ErrorPage, PageLayout, SocialIcons
- Composite: ScheduleSlot, ShowCard, PresenterCard, ArchiveEntry, EventCard, FormRenderer
- Composite (blocks/): HeroBlock, ContentBlock, NowPlayingBlock, TodayScheduleBlock
- Container: ScheduleGrid, DayColumn, ArchiveList, EventTimeline, GenreFilter, NowPlayingBar
- Layout: Nav (responsive with mobile menu), Footer

Components are reused across pages — e.g. `ShowCard` appears on /shows and /presenters/[slug], `PresenterCard` on /presenters and /shows/[slug], `ArchiveList` on /archives and /shows/[slug].

**Accessibility:**
- Skip link, ARIA landmarks (banner, nav, main, contentinfo, status)
- Headings provide screen reader navigation (h1 site name, h2 page title, h3 sections)
- `aria-current="page"` on active nav links, `aria-live="polite"` for now-playing announcements
- Focus management via `afterNavigate` → `<main>`, keyboard-navigable mobile menu
- All `{#each}` loops have keys for proper reconciliation

**Data loading:** All fetching in `+page.server.ts` via SDK singleton from `$lib/sdk.ts`. Root layout loads station detail + now-playing (shared across all pages). Detail routes catch `BroadcakeError` and throw SvelteKit `error()` for proper error pages.

**NowPlayingBar:** SSR renders initial data, then polls via `bc.nowPlaying.subscribe()` on the client. `aria-live="polite"` sr-only region announces show changes. Built-in HTML5 audio player when station has streams configured: play/pause, volume control (slider + mute), stream quality selector. Mobile: volume and stream controls in a settings popover. localStorage persistence for volume and selected stream. Loading state during stream buffering.

**Composable homepage blocks:** The homepage (`+page.svelte`) uses composable block components that station owners rearrange by editing the file directly. Available blocks: `HeroBlock` (full-width hero image with optional tagline), `ContentBlock` (titled section with slot), `NowPlayingBlock` (current/next show display), `TodayScheduleBlock` (upcoming schedule slots, max 5, filters past shows). Upstream template updates only touch block components, not the page composition.

**ScheduleGrid responsive:** Mobile (< 640px) shows horizontal day tabs with single day view (today pre-selected). Desktop (>= 640px) uses the full grid layout.

**Markdown rendering:** `$lib/utils/markdown.ts` exports `renderMarkdown()` — snarkdown for markdown, then DOMPurify (`isomorphic-dompurify`) against an explicit tag/attribute **allowlist**. Used for show descriptions, presenter bios, event descriptions. Never swap this for a blocklist: snarkdown passes raw HTML through and the output is injected with `{@html}`.

**FormRenderer CAPTCHA:** `FormRenderer` accepts an optional `captchaSiteKey` prop. When provided, it loads the Cloudflare Turnstile script, renders the widget in the form, and submits through a proxy route (`/api/forms/[slug]/submit`) that validates the token server-side before forwarding to the v1 API.

## Sanitising user content

`renderMarkdown()` runs snarkdown, then DOMPurify against an explicit tag and
attribute **allowlist**. Never swap that for a blocklist: snarkdown passes raw
HTML straight through and the output is injected with `{@html}`. The previous
regex blocklist let every event-handler attribute through (`<img src=x
onerror=…>`) and could reassemble a `<script>` tag out of its own output.

Show descriptions, presenter bios and event descriptions are written by station
staff — including presenters, the lowest-privileged role — and rendered on the
public site.

## Keying slot lists

Key a day's slots on `slot.slot_start`, never on the show or event slug. Slots
within a day cannot overlap, so the start time is unique by construction; a slug
is not. A show and its second-chance repeat share one, and so did the two halves
of a multi-day event before they were merged upstream.

The cost is not a cosmetic glitch. Svelte throws `each_key_duplicate` on a
duplicate key, and it throws during hydration, so the server-rendered page
arrives complete and the client wipes it — a live station's schedule page was a
blank shell with a footer while `curl` showed the full listing. That asymmetry is
the tell.

## Linking a slot to its detail page

An event slot's `show_slug` is the *event's* slug — the query builds it as
`COALESCE(sh.slug, ae.slug)`, so a whole-event row and a custom-named segment
both look like a show. Linking on `show_slug` alone therefore pointed at
`/shows/<event>`, which does not exist, and every event on the schedule was a
404 for as long as events have rendered.

Compare the two slugs instead: they differ only when the segment really is a
show. Same slug, or none, means the event itself, so link to `/events/<slug>`.
Detail pages keep working when their listing page is switched off in
`broadcake.config.ts` precisely so these links hold.
