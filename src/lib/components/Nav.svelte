<script lang="ts">
	import { page } from '$app/state'
	import type { StationSocialLink } from '@techcake/broadcake-sdk'
	import ThemeToggle from './ThemeToggle.svelte'
	import SocialIcons from './SocialIcons.svelte'
	import Menu from '@lucide/svelte/icons/menu'
	import XIcon from '@lucide/svelte/icons/x'
	import ExternalLink from '@lucide/svelte/icons/external-link'

	type NavItem = { label: string; href: string; external?: boolean }

	let {
		siteName,
		logo,
		navigation = null,
		enabledPages = {},
		links = [],
		socialLinks = [],
		headerClass = '',
	}: {
		siteName: string
		logo?: string
		navigation?: NavItem[] | null
		enabledPages?: Record<string, boolean>
		links?: NavItem[]
		socialLinks?: StationSocialLink[]
		headerClass?: string
	} = $props()

	let mobileOpen = $state(false)

	// If `navigation` is provided, use it directly. Otherwise auto-generate from enabled pages + links.
	const navItems: NavItem[] = $derived.by(() => {
		if (navigation) return navigation

		const items: NavItem[] = []
		if (enabledPages.schedule !== false) items.push({ label: 'Schedule', href: '/schedule' })
		if (enabledPages.shows !== false) items.push({ label: 'Shows', href: '/shows' })
		if (enabledPages.presenters !== false) items.push({ label: 'Presenters', href: '/presenters' })
		if (enabledPages.archives !== false) items.push({ label: 'Archives', href: '/archives' })
		if (enabledPages.events !== false) items.push({ label: 'Events', href: '/events' })
		// Append legacy links
		for (const link of links) {
			items.push(link)
		}
		return items
	})

	function isActive(href: string): boolean {
		if (href === '/') return page.url.pathname === '/'
		return page.url.pathname === href || page.url.pathname.startsWith(href + '/')
	}

	function closeMobile() {
		mobileOpen = false
	}
</script>

<header class="sticky top-0 z-40 border-b {headerClass || 'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'}">
	<div class="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
		<!-- Logo / Site name -->
		<a href="/" class="flex shrink-0 items-center gap-2 font-bold" aria-label="{siteName} - Home">
			{#if logo}
				<img src={logo} alt="" class="h-8 w-auto" aria-hidden="true" />
			{/if}
			<h1 class="text-lg">{siteName}</h1>
		</a>

		<!-- Desktop nav -->
		<nav aria-label="Main navigation" class="hidden flex-1 md:flex">
			<ul class="flex items-center gap-1">
				{#each navItems as item (item.href)}
					<li>
						<a
							href={item.href}
							target={item.external ? '_blank' : undefined}
							rel={item.external ? 'noopener noreferrer' : undefined}
							class="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors {!item.external && isActive(item.href) ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'}"
							aria-current={!item.external && isActive(item.href) ? 'page' : undefined}
							aria-label={item.external ? `${item.label} (opens in new tab)` : undefined}
						>
							{item.label}
							{#if item.external}
								<ExternalLink class="h-3.5 w-3.5" aria-hidden="true" />
							{/if}
						</a>
					</li>
				{/each}
			</ul>
		</nav>

		<!-- Social icons + theme toggle -->
		<div class="ml-auto flex items-center gap-2">
			<div class="hidden md:block">
				<SocialIcons {socialLinks} />
			</div>
			<ThemeToggle />

			<!-- Mobile menu button -->
			<button
				class="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-accent md:hidden"
				onclick={() => (mobileOpen = !mobileOpen)}
				aria-expanded={mobileOpen}
				aria-controls="mobile-nav"
				aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
			>
				{#if mobileOpen}
					<XIcon class="h-5 w-5" />
				{:else}
					<Menu class="h-5 w-5" />
				{/if}
			</button>
		</div>
	</div>

	<!-- Mobile nav -->
	{#if mobileOpen}
		<nav id="mobile-nav" aria-label="Main navigation" class="border-t md:hidden">
			<ul class="space-y-1 px-4 py-3">
				{#each navItems as item (item.href)}
					<li>
						<a
							href={item.href}
							target={item.external ? '_blank' : undefined}
							rel={item.external ? 'noopener noreferrer' : undefined}
							class="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors {!item.external && isActive(item.href) ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'}"
							aria-current={!item.external && isActive(item.href) ? 'page' : undefined}
							aria-label={item.external ? `${item.label} (opens in new tab)` : undefined}
							onclick={closeMobile}
						>
							{item.label}
							{#if item.external}
								<ExternalLink class="h-3.5 w-3.5" aria-hidden="true" />
							{/if}
						</a>
					</li>
				{/each}
				{#if socialLinks.length > 0}
					<li class="px-3 py-2">
						<SocialIcons {socialLinks} onclick={closeMobile} />
					</li>
				{/if}
			</ul>
		</nav>
	{/if}
</header>
