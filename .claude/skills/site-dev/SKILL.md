---
name: site-dev
description: >
  Full development assistant for building and customizing Broadcake station websites
  using the SvelteKit site template. Use this skill whenever the user asks about:
  customizing their station website, editing the homepage layout, adding pages,
  changing colors/theme, configuring navigation, embedding forms, working with the
  audio player, using SDK methods, deploying the site, or any template component usage.
  Also trigger when working with broadcake.config.ts, the site template's components,
  or any file under packages/site-template/. Even if the user just says "website",
  "site", "template", or "public page" in the context of this project, use this skill.
---

# Broadcake Site Template Development

You are helping build a radio station website using the Broadcake SvelteKit site template. This template connects to the Broadcake API via the `@techcake/broadcake-sdk` and renders a public-facing website for listeners.

**Always use the Svelte MCP tools** (`svelte-autofixer`, `list-sections`, `get-documentation`) when writing Svelte code to ensure best practices.

## Tech Stack

- **SvelteKit 2.x** with **Svelte 5 runes** (`$state`, `$props`, `$derived`, `$effect`)
- **Tailwind CSS v4** with oklch color tokens in `src/app.css`
- **shadcn-svelte** subset (badge, button, card, select, separator, skeleton, toggle, tooltip)
- **@techcake/broadcake-sdk** for all API data
- **snarkdown** for lightweight markdown rendering
- **mode-watcher** for dark mode
- **@sveltejs/adapter-auto** for deployment

**Never use Svelte 4 patterns** — no `export let`, `$:`, `on:click`, or writable stores.

## Configuration

All site config lives in `broadcake.config.ts` at the project root. The only required field is `stationSlug`.

### Key Options

```ts
const config: BroadcakeSiteConfig = {
  stationSlug: 'my-station',              // Required — matches Broadcake dashboard
  baseUrl: 'https://app.broadcake.com',   // API URL (default)
  siteName: 'My Radio',                   // Falls back to API station name
  logo: '/logo.svg',                      // Path in static/

  // Theme — oklch colors
  theme: {
    light: { primary: 'oklch(0.55 0.25 145)' },  // Brand color
    dark: { primary: 'oklch(0.65 0.2 145)' },
  },

  // Page toggles — detail pages (/shows/[slug]) always work even when listing is disabled
  pages: { schedule: true, shows: true, presenters: true, archives: true, events: true },

  // Navigation — full control over nav items, order, and labels
  navigation: [
    { label: 'Schedule', href: '/schedule' },
    { label: 'About', href: '/about' },
    { label: 'Listen Live', href: 'https://...', external: true },
  ],

  // CAPTCHA — optional Turnstile protection for forms
  captcha: { provider: 'turnstile', siteKey: 'your-site-key' },
  // Secret key goes in TURNSTILE_SECRET_KEY env var

  // Schedule display
  schedule: { showAutomation: true, weekStartDay: 1 },

  nowPlayingInterval: 15000,   // Polling ms (0 to disable)
  archivesPerPage: 20,
  footerText: '© 2026 My Radio',
}
```

### Navigation

If `navigation` is set, it replaces the auto-generated nav entirely. Mix internal routes, custom pages, and external links freely. If omitted, nav auto-generates from enabled pages (backwards compatible).

### Page Toggles

Disabling a page (e.g., `shows: false`) hides the listing page (`/shows`) but keeps detail pages (`/shows/[slug]`) accessible. Links from the schedule and other pages still work. Back links on detail pages show "Home" instead of "All Shows" when the listing is disabled.

## Homepage Customization

The homepage (`src/routes/+page.svelte`) is composable — import block components and arrange them:

```svelte
<script lang="ts">
  import HeroBlock from '$lib/components/blocks/HeroBlock.svelte'
  import TodayScheduleBlock from '$lib/components/blocks/TodayScheduleBlock.svelte'
  import ContentBlock from '$lib/components/blocks/ContentBlock.svelte'
  let { data } = $props()
</script>

<HeroBlock image="/hero.jpg" tagline="Your community station" />

<ContentBlock title="Welcome!">
  <p>Custom HTML content here. Add images, links, whatever you need.</p>
</ContentBlock>

<TodayScheduleBlock slots={data.todaySchedule} config={data.config} enabledPages={data.enabledPages} />
```

### Available Blocks

| Block | Props | Purpose |
|-------|-------|---------|
| `HeroBlock` | `image`, `tagline?` | Full-width banner with gradient overlay |
| `TodayScheduleBlock` | `slots`, `config`, `enabledPages` | Today's schedule list with "View full week" link |
| `NowPlayingBlock` | `now`, `next`, `config`, `enabledPages` | Current show card (hidden when nothing is on) |
| `ContentBlock` | `title`, `children` (slot) | Titled section for arbitrary content |

## Layout Customization

The layout (`src/routes/+layout.svelte`) controls the site-wide structure:

```
Nav → NowPlayingBar → TimezoneIndicator → Main Content → Footer
```

Rearrange by editing the layout file. Move `NowPlayingBar` below `<main>` for a bottom player, remove it entirely, or add a banner above the nav. The data loading stays in `+layout.server.ts`.

## Creating Custom Pages

1. Create a route: `src/routes/about/+page.svelte`
2. Use `PageLayout` for consistent heading hierarchy:

```svelte
<script lang="ts">
  import PageLayout from '$lib/components/PageLayout.svelte'
  import PageMeta from '$lib/components/PageMeta.svelte'
  import { buildPageTitle } from '$lib/utils/seo'
  let { data } = $props()
</script>

<PageMeta title={buildPageTitle('About Us', data.config.siteName)} description="Meet our team" />

<PageLayout title="About Us" description="Meet the people behind the station">
  <p>Your custom content here.</p>
</PageLayout>
```

3. Add to navigation in `broadcake.config.ts`:
```ts
navigation: [
  { label: 'Schedule', href: '/schedule' },
  { label: 'About', href: '/about' },
]
```

### Pages with API Data

If your custom page needs data from the Broadcake API:

```ts
// src/routes/about/+page.server.ts
import { getClient } from '$lib/sdk'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
  const bc = getClient()
  const presenters = await bc.presenters()
  return { presenters }
}
```

## Available Components

### Display Components

| Component | Key Props | Usage |
|-----------|-----------|-------|
| `ShowCard` | `show: Show` | Show preview with name, description, presenters, genres |
| `PresenterCard` | `presenter: Presenter` | Profile card with avatar/initials, pronouns, bio, shows |
| `ArchiveEntry` | `archive: Archive \| StationArchive` | Archive record with title, date, links |
| `EventCard` | `event: Event` | Event summary with date range |
| `ScheduleSlot` | `slot`, `enabledPages`, `isNow?` | Schedule entry with show info and time |
| `GenreBadge` | `genre: { name, slug }`, `linked?` | Genre tag, links to filtered shows when enabled |
| `PresenterList` | `presenters`, `linked?` | Comma-separated presenter names |
| `SlotTime` | `start`, `end`, `duration?` | Formatted time range with timezone awareness |
| `FormRenderer` | `form`, `stationSlug`, `baseUrl`, `captchaSiteKey?` | Dynamic form with validation and submission |

### Layout/Utility Components

| Component | Purpose |
|-----------|---------|
| `Nav` | Responsive nav bar with navigation items, social icons, theme toggle, mobile menu |
| `Footer` | Copyright text + "Powered by Broadcake" |
| `NowPlayingBar` | Sticky audio player with stream selector, volume, now-playing info |
| `PageMeta` | `<head>` metadata (title, description, OG tags) |
| `PageLayout` | Consistent page header with title + description |
| `ScheduleGrid` | Week view grid of day columns |
| `DayColumn` | Single day schedule column |
| `ArchiveList` | Archive entries with cursor pagination |
| `EventTimeline` | Segments grouped by date |
| `GenreFilter` | Genre navigation bar for show filtering |
| `Pagination` | "Load more" button |
| `SkipLink` | Accessibility skip-to-content |
| `ThemeToggle` | Dark/light mode toggle |
| `TimezoneIndicator` | Shows when visitor timezone differs from station |
| `ErrorPage` | Error display with status code |

## SDK Integration

All data comes from the `@techcake/broadcake-sdk`. The client is a singleton via `getClient()` from `$lib/sdk.ts`.

### Available Methods

```ts
const bc = getClient()

// Schedule
bc.scheduleToday()                          // Today's slots (auto timezone)
bc.schedule({ from: '2026-03-24' })         // Week schedule
bc.schedule({ from, to })                   // Date range (max 14 days)

// Shows & Presenters
bc.shows()                                  // All active shows
bc.show('jazz-lounge')                      // Show detail
bc.showSchedule('jazz-lounge')              // Recurring time slots
bc.showArchives('jazz-lounge', { limit })   // Show's archives
bc.presenters()                             // All active presenters
bc.presenter('dj-marley')                   // Presenter detail

// Archives & Events
bc.archives({ show?, cursor?, limit? })     // Paginated archives
bc.events()                                 // All events
bc.event('summer-fest')                     // Event detail with segments

// Now Playing (with polling)
bc.nowPlaying()                             // Current { now, next }
bc.nowPlaying.subscribe(callback, { interval: 10000 })  // Returns unsubscribe fn

// Station
bc.station()                                // Station detail (streams, social links)

// Forms
bc.forms()                                  // Published forms
bc.form('contact')                          // Form detail with fields
bc.submitForm('contact', { name: 'Jo' })    // Submit form data
```

### Error Handling Pattern

```ts
import { BroadcakeError } from '@techcake/broadcake-sdk'
import { error } from '@sveltejs/kit'

try {
  const show = await bc.show(params.slug)
  return { show }
} catch (err) {
  if (err instanceof BroadcakeError) {
    error(err.status || 500, err.status === 404 ? 'Not found' : 'Failed to load')
  }
  throw err
}
```

## Embedding Forms

Forms are rendered with `FormRenderer` on any page. The component handles all field types, validation, and submission.

```svelte
<script lang="ts">
  import FormRenderer from '$lib/components/FormRenderer.svelte'
  let { data } = $props()
</script>

<FormRenderer
  form={data.form}
  stationSlug={data.station.slug}
  baseUrl={data.config.baseUrl}
  captchaSiteKey={data.config.captcha?.siteKey}
/>
```

When `captchaSiteKey` is provided, submissions route through a server-side proxy (`/api/forms/[slug]/submit`) that validates the Turnstile token before forwarding to the v1 API. Set the secret key via the `TURNSTILE_SECRET_KEY` environment variable.

## Styling

### Theme Colors

Edit `src/app.css` to change theme tokens. Colors use oklch for perceptual uniformity:

```css
:root {
  --primary: oklch(0.55 0.25 260);        /* Blue */
  --primary-foreground: oklch(0.985 0 0); /* White text on primary */
}
.dark {
  --primary: oklch(0.75 0.15 260);
}
```

Or override just the primary via `broadcake.config.ts` `theme` without touching CSS.

### Tailwind Classes

Use standard Tailwind v4 classes mapped to theme tokens: `bg-primary`, `text-foreground`, `border`, `rounded-md`, etc. For class merging: `cn('base-class', conditional && 'extra')` from `$lib/utils`.

### Dark Mode

Handled by `mode-watcher`. The `ThemeToggle` component is in the nav. Use `dark:` variant for dark-mode styles. CSS custom variant: `@custom-variant dark (&:is(.dark *))`.

## Audio Player

The `NowPlayingBar` component provides a persistent audio player. It reads stream URLs from the Broadcake API (`station.streams`) — configured by the station owner in the dashboard, not in the template.

The player features:
- Play/pause with loading state
- Volume control with mute toggle (remembers previous volume)
- Stream quality selector (when multiple streams exist)
- Now-playing info with show name and time
- Mobile settings popover for volume/stream controls
- localStorage persistence for volume and stream preference

## Static Assets

Put images, logos, and other static files in the `static/` directory. Reference them with absolute paths: `/logo.svg`, `/hero.jpg`.

These are site design assets (not user-managed content). User-uploaded images (avatars, cover art) come from Supabase Storage via the API.

## Deployment

The template uses `@sveltejs/adapter-auto` — deploy to Vercel, Netlify, Cloudflare Pages, or any supported platform.

### Environment Variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `TURNSTILE_SECRET_KEY` | Only if captcha enabled | Cloudflare Turnstile server secret |

### Steps

1. Push to a git repo
2. Connect to your hosting platform
3. Build command: `npm run build`
4. Output directory: `build/` (auto-detected)
5. Set environment variables

## Keeping Up to Date

If you cloned from the public template repo, pull upstream updates:

```bash
git remote add upstream https://github.com/joshms123/broadcake-svelte-template.git
git fetch upstream
git merge upstream/main
```

Conflicts should be rare — upstream updates touch components and utilities, while your customizations are in `broadcake.config.ts`, `+page.svelte`, `+layout.svelte`, and custom routes.

## Markdown in Descriptions

Show, presenter, and event descriptions support Markdown. The `renderMarkdown()` utility from `$lib/utils/markdown` converts Markdown to sanitized HTML. Use it with `{@html}`:

```svelte
{#if show.description}
  <div class="prose prose-sm dark:prose-invert max-w-none">
    {@html renderMarkdown(show.description)}
  </div>
{/if}
```

The renderer strips dangerous tags (`<script>`, `<iframe>`, etc.) automatically.

## Utilities Reference

| Function | Import | Purpose |
|----------|--------|---------|
| `formatTime(time)` | `$lib/utils/format` | `"18:00:00"` → `"6:00 PM"` |
| `formatDate(date)` | `$lib/utils/format` | `"2026-03-24"` → `"Monday, March 24"` |
| `formatDateRange(start, end)` | `$lib/utils/format` | `"Jun 21 – Jun 22, 2026"` |
| `todayInTimezone(tz)` | `$lib/utils/format` | Today's date string in timezone |
| `buildPageTitle(page, site)` | `$lib/utils/seo` | `"Shows \| My Radio"` |
| `renderMarkdown(text)` | `$lib/utils/markdown` | Markdown → sanitized HTML |
| `isPageEnabled(page)` | `$lib/config` | Check if a page toggle is on |
| `cn(...classes)` | `$lib/utils` | Tailwind class merging |
| `getClient()` | `$lib/sdk` | Singleton SDK instance |
