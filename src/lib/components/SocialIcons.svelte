<script lang="ts">
	import type { StationSocialLink } from '@techcake/broadcake-sdk'
	import type { Component } from 'svelte'
	import Globe from '@lucide/svelte/icons/globe'
	import Linkedin from '@lucide/svelte/icons/linkedin'
	import { SiInstagram, SiFacebook, SiX, SiMastodon, SiTiktok, SiYoutube, SiBluesky, SiThreads, SiDiscord } from '@icons-pack/svelte-simple-icons'

	let {
		socialLinks,
		size = 'default',
		branded = false,
		onclick,
	}: {
		socialLinks: StationSocialLink[]
		size?: 'default' | 'small'
		branded?: boolean
		onclick?: () => void
	} = $props()

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

	function getPlatformIcon(platform: string): Component {
		return PLATFORM_ICONS[platform] ?? Globe
	}

	function getPlatformLabel(platform: string): string {
		return PLATFORM_LABELS[platform] ?? platform
	}

	const iconSize = $derived(size === 'small' ? 'h-3.5 w-3.5' : 'h-4 w-4')
	const buttonSize = $derived(size === 'small' ? 'h-7 w-7' : 'h-8 w-8')
</script>

{#if socialLinks.length > 0}
	<div class="flex items-center gap-1">
		{#each socialLinks as social (social.url)}
			{@const Icon = getPlatformIcon(social.platform)}
			<a
				href={social.url}
				target="_blank"
				rel="noopener noreferrer"
				aria-label="{getPlatformLabel(social.platform)} (opens in new tab)"
				class="inline-flex {buttonSize} items-center justify-center rounded-md opacity-70 transition-colors hover:opacity-100 {branded ? 'hover:bg-white/10' : 'hover:bg-accent/50'}"
				{onclick}
			>
				<Icon class={iconSize} aria-hidden="true" />
			</a>
		{/each}
	</div>
{/if}
