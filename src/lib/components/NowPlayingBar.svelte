<script lang="ts">
	import type { ScheduleSlot, NowPlaying, StationStream } from '@techcake/broadcake-sdk'
	import { Broadcake } from '@techcake/broadcake-sdk'
	import { browser } from '$app/environment'
	import SlotTime from './SlotTime.svelte'
	import Radio from '@lucide/svelte/icons/radio'
	import Play from '@lucide/svelte/icons/play'
	import Pause from '@lucide/svelte/icons/pause'
	import Volume2 from '@lucide/svelte/icons/volume-2'
	import VolumeX from '@lucide/svelte/icons/volume-x'
	import Settings from '@lucide/svelte/icons/settings'

	let {
		initialNow,
		initialNext,
		stationSlug,
		baseUrl,
		interval,
		listenUrl,
		streams = [],
	}: {
		initialNow: ScheduleSlot | null
		initialNext: ScheduleSlot | null
		stationSlug: string
		baseUrl?: string
		interval: number
		listenUrl: string | null
		streams: StationStream[]
	} = $props()

	let now = $state<ScheduleSlot | null>(initialNow)
	let next = $state<ScheduleSlot | null>(initialNext)
	let announcement = $state('')

	// Audio player state
	let audioEl = $state<HTMLAudioElement | null>(null)
	let isPlaying = $state(false)
	let volume = $state(1)
	let previousVolume = $state(1)
	let selectedStreamIndex = $state(0)
	let mobileMenuOpen = $state(false)

	const hasStreams = $derived(streams.length > 0)
	const safeStreamIndex = $derived(selectedStreamIndex < streams.length ? selectedStreamIndex : 0)
	const currentStream = $derived(hasStreams ? streams[safeStreamIndex] : null)

	// Initialize player state from localStorage (once only)
	let playerInitialized = false
	$effect(() => {
		if (!browser || !hasStreams || playerInitialized) return
		playerInitialized = true

		const savedVolume = localStorage.getItem('broadcake-volume')
		if (savedVolume !== null) {
			const parsed = parseFloat(savedVolume)
			if (!isNaN(parsed) && parsed >= 0 && parsed <= 1) volume = parsed
		}

		const savedStream = localStorage.getItem('broadcake-stream')
		if (savedStream !== null) {
			const idx = parseInt(savedStream, 10)
			if (!isNaN(idx) && idx >= 0 && idx < streams.length) selectedStreamIndex = idx
		} else {
			const defaultIdx = streams.findIndex(s => s.is_default)
			if (defaultIdx >= 0) selectedStreamIndex = defaultIdx
		}

		previousVolume = volume > 0 ? volume : 1
	})

	// Start polling on client
	$effect(() => {
		if (!browser || interval <= 0) return

		const bc = new Broadcake(stationSlug, baseUrl ? { baseUrl } : undefined)
		const unsub = bc.nowPlaying.subscribe((data: NowPlaying) => {
			const changed = data.now?.show_name !== now?.show_name
			now = data.now
			next = data.next
			if (changed && data.now) {
				announcement = `Now playing: ${data.now.show_name}`
			}
		}, { interval })

		return unsub
	})

	// Close mobile menu on outside click
	let mobileMenuEl = $state<HTMLDivElement | null>(null)
	$effect(() => {
		if (!browser || !mobileMenuOpen) return
		function handleClickOutside(e: MouseEvent) {
			if (mobileMenuEl && !mobileMenuEl.contains(e.target as Node)) {
				mobileMenuOpen = false
			}
		}
		document.addEventListener('click', handleClickOutside, true)
		return () => document.removeEventListener('click', handleClickOutside, true)
	})

	function togglePlay() {
		if (!audioEl || !currentStream) return

		if (isPlaying) {
			audioEl.pause()
			audioEl.src = ''
			isPlaying = false
			announcement = 'Playback stopped'
		} else {
			audioEl.src = currentStream.url
			audioEl.volume = volume
			audioEl.play().then(() => {
				isPlaying = true
				announcement = 'Playing live stream'
			}).catch(() => {
				isPlaying = false
				announcement = 'Unable to play stream'
			})
		}
	}

	function toggleMute() {
		if (volume > 0) {
			previousVolume = volume
			volume = 0
		} else {
			volume = previousVolume
		}
		if (audioEl) audioEl.volume = volume
		if (browser) localStorage.setItem('broadcake-volume', String(volume))
	}

	function handleVolumeChange(e: Event) {
		const val = parseFloat((e.target as HTMLInputElement).value)
		if (isNaN(val)) return
		volume = val
		if (val > 0) previousVolume = val
		if (audioEl) audioEl.volume = val
		if (browser) localStorage.setItem('broadcake-volume', String(val))
	}

	function handleStreamChange(e: Event) {
		const idx = parseInt((e.target as HTMLSelectElement).value, 10)
		if (isNaN(idx) || idx < 0 || idx >= streams.length) return
		selectedStreamIndex = idx
		if (browser) localStorage.setItem('broadcake-stream', String(idx))
		announcement = `Switched to ${streams[idx].name}`

		mobileMenuOpen = false

		if (isPlaying && audioEl) {
			audioEl.src = streams[idx].url
			audioEl.volume = volume
			audioEl.play().catch(() => {
				isPlaying = false
				announcement = 'Unable to play stream'
			})
		}
	}

	function streamLabel(s: StationStream): string {
		if (s.bitrate) return `${s.name} (${s.bitrate}kbps)`
		return s.name
	}
</script>

{#if now}
	<aside aria-label="Now playing" class="border-b bg-card">
		<div class="mx-auto flex max-w-7xl items-center gap-4 px-4 py-2 sm:px-6 lg:px-8">
			<Radio class="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
			<div class="min-w-0 flex-1 text-sm">
				<div class="flex flex-col sm:flex-row sm:items-baseline">
					<span class="truncate font-medium">
						{#if now.show_slug}
							<a href="/shows/{now.show_slug}" class="hover:text-primary transition-colors">{now.show_name}</a>
						{:else}
							{now.show_name}
						{/if}
					</span>
					<span class="text-xs text-muted-foreground sm:text-sm">
						<span class="hidden sm:inline"> &middot; </span>
						<SlotTime start={now.slot_start} end={now.slot_end} />
					</span>
				</div>
				{#if next}
					<span class="hidden text-muted-foreground md:inline">
						Up next: {next.show_name}
					</span>
				{/if}
			</div>

			{#if hasStreams}
				<div class="flex shrink-0 items-center gap-2">
					<button
						onclick={togglePlay}
						aria-label={isPlaying ? 'Pause live stream' : 'Play live stream'}
						class="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
					>
						{#if isPlaying}
							<Pause class="h-4 w-4" />
						{:else}
							<Play class="h-4 w-4 ml-0.5" />
						{/if}
					</button>

					<!-- Desktop volume + stream selector -->
					<div class="hidden items-center gap-1.5 sm:flex">
						<button
							onclick={toggleMute}
							aria-label={volume === 0 ? 'Unmute' : 'Mute'}
							class="text-muted-foreground hover:text-foreground transition-colors"
						>
							{#if volume === 0}
								<VolumeX class="h-4 w-4" />
							{:else}
								<Volume2 class="h-4 w-4" />
							{/if}
						</button>
						<input
							type="range"
							min="0"
							max="1"
							step="0.01"
							value={volume}
							oninput={handleVolumeChange}
							aria-label="Volume"
							aria-valuetext="{Math.round(volume * 100)}%"
							class="w-20 accent-primary"
						/>
					</div>

					{#if streams.length > 1}
						<select
							value={String(safeStreamIndex)}
							onchange={handleStreamChange}
							aria-label="Select stream quality"
							class="hidden h-7 rounded border border-input bg-transparent px-2 text-xs md:block"
						>
							{#each streams as s, i (i)}
								<option value={String(i)}>{streamLabel(s)}</option>
							{/each}
						</select>
					{/if}

					<!-- Mobile settings button (volume + stream) -->
					<div class="relative sm:hidden" bind:this={mobileMenuEl}>
						<button
							onclick={() => mobileMenuOpen = !mobileMenuOpen}
							aria-label="Audio settings"
							aria-expanded={mobileMenuOpen}
							class="text-muted-foreground hover:text-foreground transition-colors"
						>
							<Settings class="h-4 w-4" />
						</button>
						{#if mobileMenuOpen}
							<div class="absolute right-0 top-8 z-50 w-48 rounded-md border bg-card p-3 shadow-lg space-y-3">
								<div class="flex items-center gap-2">
									<button
										onclick={toggleMute}
										aria-label={volume === 0 ? 'Unmute' : 'Mute'}
										class="text-muted-foreground"
									>
										{#if volume === 0}
											<VolumeX class="h-4 w-4" />
										{:else}
											<Volume2 class="h-4 w-4" />
										{/if}
									</button>
									<input
										type="range"
										min="0"
										max="1"
										step="0.01"
										value={volume}
										oninput={handleVolumeChange}
										aria-label="Volume"
										aria-valuetext="{Math.round(volume * 100)}%"
										class="flex-1 accent-primary"
									/>
								</div>
								{#if streams.length > 1}
									<select
										value={String(safeStreamIndex)}
										onchange={handleStreamChange}
										aria-label="Select stream quality"
										class="w-full h-7 rounded border border-input bg-transparent px-2 text-xs"
									>
										{#each streams as s, i (i)}
											<option value={String(i)}>{streamLabel(s)}</option>
										{/each}
									</select>
								{/if}
							</div>
						{/if}
					</div>
				</div>

				<audio bind:this={audioEl} preload="none"></audio>
			{:else if listenUrl}
				<a
					href={listenUrl}
					target="_blank"
					rel="noopener noreferrer"
					class="shrink-0 rounded-md bg-primary px-3 py-1 text-xs font-medium text-primary-foreground hover:opacity-90 transition-opacity"
					aria-label="Listen live (opens in new tab)"
				>
					Listen Live
				</a>
			{/if}
		</div>
	</aside>
{/if}

<!-- Screen reader announcement for show changes and player state -->
<div role="status" aria-live="polite" class="sr-only">{announcement}</div>
