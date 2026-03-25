<script lang="ts">
	import type { Snippet } from 'svelte'

	let {
		title,
		description,
		children,
	}: {
		title: string
		description?: string
		children: Snippet
	} = $props()
</script>

<h2 class="text-3xl font-bold">{title}</h2>
{#if description}
	<p class="mt-2 text-lg text-muted-foreground">{description}</p>
{/if}
<div class="mt-6">
	{@render children()}
</div>
