<script lang="ts">
	import PageMeta from '$lib/components/PageMeta.svelte'
	import ShowCard from '$lib/components/ShowCard.svelte'
	import { buildPageTitle } from '$lib/utils/seo'
	import { isPageEnabled } from '$lib/config'
	import { renderMarkdown } from '$lib/utils/markdown'

	let { data } = $props()
	const title = $derived(buildPageTitle(data.presenter.display_name, data.config.siteName))
</script>

<PageMeta {title} description={data.presenter.bio ?? `${data.presenter.display_name} on ${data.config.siteName}`} />

{#if isPageEnabled('presenters')}
	<a href="/presenters" class="mb-4 inline-block text-sm text-muted-foreground hover:text-foreground transition-colors">
		&larr; All Presenters
	</a>
{:else}
	<a href="/" class="mb-4 inline-block text-sm text-muted-foreground hover:text-foreground transition-colors">
		&larr; Home
	</a>
{/if}

<div class="flex items-center gap-4">
	{#if data.presenter.avatar_url}
		<img
			src={data.presenter.avatar_url}
			alt=""
			class="h-16 w-16 shrink-0 rounded-full object-cover"
		/>
	{:else}
		<div
			class="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary text-xl font-medium text-primary-foreground"
			aria-hidden="true"
		>
			{data.presenter.display_name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()}
		</div>
	{/if}
	<div>
		<h2 class="text-3xl font-bold">{data.presenter.display_name}</h2>
		{#if data.presenter.pronouns}
			<p class="text-muted-foreground">{data.presenter.pronouns}</p>
		{/if}
	</div>
</div>

{#if data.presenter.bio}
	<div class="mt-6 prose prose-sm dark:prose-invert max-w-none text-muted-foreground">{@html renderMarkdown(data.presenter.bio)}</div>
{/if}

{#if data.presenter.shows.length > 0}
	<div class="mt-8">
		<h3 class="mb-4 text-xl font-semibold">Their Shows</h3>
		<div class="grid gap-4 sm:grid-cols-2">
			{#each data.presenter.shows as show (show.slug)}
				<ShowCard show={{ ...show, description: show.description ?? null, is_active: true, presenters: [], genres: [] }} />
			{/each}
		</div>
	</div>
{/if}
