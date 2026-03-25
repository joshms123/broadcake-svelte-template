<!--
  Content Block — a titled section with a slot for arbitrary content.
  Use for welcome messages, about text, sponsor logos, or any custom HTML.

  Usage:
    <ContentBlock title="Welcome aboard!">
      <p>Your custom content here...</p>
      <img src="/on-air.jpg" alt="Studio microphone" />
    </ContentBlock>

    <ContentBlock>
      <p>No title? That works too.</p>
    </ContentBlock>
-->
<script lang="ts">
	import type { Snippet } from 'svelte'

	let {
		title,
		children,
	}: {
		title?: string
		children: Snippet
	} = $props()
</script>

<section class="mb-10">
	{#if title}
		<h3 class="mb-4 text-xl font-semibold">{title}</h3>
	{/if}
	<div class="prose prose-sm dark:prose-invert max-w-none">
		{@render children()}
	</div>
</section>
