<script lang="ts">
	import { page } from '$app/state'
	import { buildCanonicalUrl } from '$lib/utils/seo'

	let { title, description, ogImage, type = 'website' }: {
		title: string
		description?: string
		ogImage?: string
		type?: string
	} = $props()

	const canonical = $derived(buildCanonicalUrl(page.url.pathname))
</script>

<svelte:head>
	<title>{title}</title>
	{#if description}
		<meta name="description" content={description} />
	{/if}

	<!-- Open Graph -->
	<meta property="og:title" content={title} />
	{#if description}
		<meta property="og:description" content={description} />
	{/if}
	<meta property="og:type" content={type} />
	{#if canonical}
		<meta property="og:url" content={canonical} />
		<link rel="canonical" href={canonical} />
	{/if}
	{#if ogImage}
		<meta property="og:image" content={ogImage} />
	{/if}

	<!-- Twitter -->
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content={title} />
	{#if description}
		<meta name="twitter:description" content={description} />
	{/if}
</svelte:head>
