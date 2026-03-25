<script lang="ts">
	import { page } from '$app/state'
	import type { StationSocialLink } from '@techcake/broadcake-sdk'
	import type { Component } from 'svelte'
	import ThemeToggle from './ThemeToggle.svelte'
	import Menu from '@lucide/svelte/icons/menu'
	import XIcon from '@lucide/svelte/icons/x'
	import ExternalLink from '@lucide/svelte/icons/external-link'
	import Globe from '@lucide/svelte/icons/globe'
	import Linkedin from '@lucide/svelte/icons/linkedin'
	import { SiInstagram, SiFacebook, SiX, SiMastodon, SiTiktok, SiYoutube, SiBluesky, SiThreads, SiDiscord } from '@icons-pack/svelte-simple-icons'

	let {
		siteName,
		logo,
		enabledPages,
		links = [],
		socialLinks = [],
	}: {
		siteName: string
		logo?: string
		enabledPages: Record<string, boolean>
		links: Array<{ label: string; href: string; external?: boolean }>
		socialLinks: StationSocialLink[]
	} = $props()

	let mobileOpen = $state(false)

	const navItems = $derived.by(() => {
		const items: { label: string; href: string }[] = []
		if (enabledPages.schedule) items.push({ label: 'Schedule', href: '/schedule' })
		if (enabledPages.shows) items.push({ label: 'Shows', href: '/shows' })
		if (enabledPages.presenters) items.push({ label: 'Presenters', href: '/presenters' })
		if (enabledPages.archives) items.push({ label: 'Archives', href: '/archives' })
		if (enabledPages.events) items.push({ label: 'Events', href: '/events' })
		return items
	})

	const PLATFORM_ICONS: Record<string, Component> = {
		instagram: SiInstagram,
		facebook: SiFacebook,
		x: SiX,
		mastodon: SiMastodon,
		tiktok: SiTiktok,
		youtube: SiYoutube,
		bluesky: SiBluesky,
		threads: SiThreads,
		discord: SiDiscord,
		linkedin: Linkedin,
	}

	function getPlatformIcon(platform: string): Component {
		return PLATFORM_ICONS[platform] ?? Globe
	}

	const PLATFORM_LABELS: Record<string, string> = {
		instagram: 'Instagram',
		facebook: 'Facebook',
		x: 'X',
		mastodon: 'Mastodon',
		tiktok: 'TikTok',
		youtube: 'YouTube',
		bluesky: 'Bluesky',
		threads: 'Threads',
		discord: 'Discord',
		linkedin: 'LinkedIn',
		website: 'Website',
	}

	function getPlatformLabel(platform: string): string {
		return PLATFORM_LABELS[platform] ?? platform
	}

	function isActive(href: string): boolean {
		return page.url.pathname === href || page.url.pathname.startsWith(href + '/')
	}

	function closeMobile() {
		mobileOpen = false
	}
</script>

<header class="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
							class="rounded-md px-3 py-2 text-sm font-medium transition-colors {isActive(item.href) ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'}"
							aria-current={isActive(item.href) ? 'page' : undefined}
						>
							{item.label}
						</a>
					</li>
				{/each}
			</ul>
		</nav>

		<!-- Social icons + External links + theme toggle -->
		<div class="ml-auto flex items-center gap-2">
			{#if socialLinks.length > 0}
				<div class="hidden items-center gap-1 sm:flex">
					{#each socialLinks as social (social.url)}
						{@const Icon = getPlatformIcon(social.platform)}
						<a
							href={social.url}
							target="_blank"
							rel="noopener noreferrer"
							aria-label="{getPlatformLabel(social.platform)} (opens in new tab)"
							class="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground hover:bg-accent/50"
						>
							<Icon class="h-4 w-4" aria-hidden="true" />
						</a>
					{/each}
				</div>
				{#if links.length > 0}
					<span class="hidden h-4 w-px bg-border sm:block" aria-hidden="true"></span>
				{/if}
			{/if}
			{#each links as link (link.href)}
				<a
					href={link.href}
					target={link.external ? '_blank' : undefined}
					rel={link.external ? 'noopener noreferrer' : undefined}
					class="hidden items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
					aria-label={link.external ? `${link.label} (opens in new tab)` : undefined}
				>
					{link.label}
					{#if link.external}
						<ExternalLink class="h-3.5 w-3.5" aria-hidden="true" />
					{/if}
				</a>
			{/each}
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
							class="block rounded-md px-3 py-2 text-sm font-medium transition-colors {isActive(item.href) ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'}"
							aria-current={isActive(item.href) ? 'page' : undefined}
							onclick={closeMobile}
						>
							{item.label}
						</a>
					</li>
				{/each}
				{#each links as link (link.href)}
					<li>
						<a
							href={link.href}
							target={link.external ? '_blank' : undefined}
							rel={link.external ? 'noopener noreferrer' : undefined}
							class="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50"
							onclick={closeMobile}
						>
							{link.label}
							{#if link.external}
								<ExternalLink class="h-3.5 w-3.5" aria-hidden="true" />
							{/if}
						</a>
					</li>
				{/each}
				{#if socialLinks.length > 0}
					<li>
						<div class="flex items-center gap-2 px-3 py-2">
							{#each socialLinks as social (social.url)}
								{@const Icon = getPlatformIcon(social.platform)}
								<a
									href={social.url}
									target="_blank"
									rel="noopener noreferrer"
									aria-label="{getPlatformLabel(social.platform)} (opens in new tab)"
									class="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground hover:bg-accent/50"
									onclick={closeMobile}
								>
									<Icon class="h-4 w-4" aria-hidden="true" />
								</a>
							{/each}
						</div>
					</li>
				{/if}
			</ul>
		</nav>
	{/if}
</header>
