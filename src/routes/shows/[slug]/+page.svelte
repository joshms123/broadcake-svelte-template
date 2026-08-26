<script lang="ts">
	import PageMeta from '$lib/components/PageMeta.svelte'
	import GenreBadge from '$lib/components/GenreBadge.svelte'
	import PresenterCard from '$lib/components/PresenterCard.svelte'
	import ArchiveList from '$lib/components/ArchiveList.svelte'
	import SlotTime from '$lib/components/SlotTime.svelte'
	import { buildPageTitle } from '$lib/utils/seo'
	import { isPageEnabled } from '$lib/config'
	import { page } from '$app/state'
	import Clock from '@lucide/svelte/icons/clock'
	import { renderMarkdown } from '$lib/utils/markdown'

	let { data } = $props()
	const title = $derived(buildPageTitle(data.show.name, data.config.siteName))

	// Group schedule slots: regular slots, then repeats
	const regularSlots = $derived(data.schedule.slots.filter(s => !s.is_repeat))
	const repeatSlots = $derived(data.schedule.slots.filter(s => s.is_repeat))
</script>

<PageMeta {title} description={data.show.description ?? `${data.show.name} on ${data.config.siteName}`} />

{#if isPageEnabled('shows')}
	<a href="/shows" class="mb-4 inline-block text-sm text-muted-foreground hover:text-foreground transition-colors">
		&larr; All Shows
	</a>
{:else}
	<a href="/" class="mb-4 inline-block text-sm text-muted-foreground hover:text-foreground transition-colors">
		&larr; Home
	</a>
{/if}

<h2 class="text-3xl font-bold">{data.show.name}</h2>

{#if data.show.genres.length > 0}
	<div class="mt-3 flex flex-wrap gap-1">
		{#each data.show.genres as genre (genre.slug)}
			<GenreBadge {genre} linked />
		{/each}
	</div>
{/if}

{#if data.show.description}
	<div class="mt-4 prose prose-sm dark:prose-invert max-w-none text-muted-foreground">{@html renderMarkdown(data.show.description)}</div>
{/if}

{#if regularSlots.length > 0}
	<div class="mt-6">
		<h3 class="mb-3 flex items-center gap-1.5 text-lg font-semibold">
			<Clock class="h-4 w-4" aria-hidden="true" />
			When to Listen
		</h3>
		<ul class="space-y-1 text-muted-foreground">
			{#each regularSlots as slot, i (i)}
				<li>
					<span class="font-medium text-foreground">{slot.day_name}s</span>
					<SlotTime start={slot.start_time} end={slot.end_time} />
					{#if slot.recurrence_weeks > 1}
						<span class="text-sm italic">(every {slot.recurrence_weeks} weeks)</span>
					{/if}
				</li>
			{/each}
		</ul>
		{#if repeatSlots.length > 0}
			<p class="mt-2 text-sm text-muted-foreground">
				Also airs as a {repeatSlots[0].repeat_label ?? 'repeat'}:
				{#each repeatSlots as slot, i (i)}
					{#if i > 0}, {/if}
					{slot.day_name}s <SlotTime start={slot.start_time} end={slot.end_time} />
				{/each}
			</p>
		{/if}
	</div>
{/if}

{#if data.show.presenters.length > 0}
	<div class="mt-8">
		<h3 class="mb-4 text-xl font-semibold">Presenters</h3>
		<div class="grid gap-4 sm:grid-cols-2">
			{#each data.show.presenters as presenter (presenter.slug)}
				<PresenterCard presenter={{ ...presenter, pronouns: presenter.pronouns ?? null, bio: presenter.bio ?? null, avatar_url: presenter.avatar_url ?? null, is_active: true, shows: [] }} />
			{/each}
		</div>
	</div>
{/if}

{#if data.archives.data.length > 0}
	<div class="mt-10">
		<h3 class="mb-4 text-xl font-semibold">Past Episodes</h3>
		<ArchiveList
			archives={data.archives.data}
			nextCursor={data.archives.next_cursor}
			baseUrl={page.url.pathname}
		/>
	</div>
{/if}
