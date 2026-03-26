<!--
  Hero Block — full-width banner image with optional tagline overlay.
  Place at the top of the homepage for visual branding.

  Usage:
    <HeroBlock image="/hero.jpg" />
    <HeroBlock image="/hero.jpg" tagline="Your compass to music and good vibes." />
-->
<script lang="ts">
	let {
		image,
		tagline,
	}: {
		image: string
		tagline?: string
	} = $props()
</script>

<section class="relative mb-10 overflow-hidden rounded-lg">
	<img
		src={image}
		alt=""
		class="h-64 w-full object-cover sm:h-80 lg:h-96"
		aria-hidden="true"
	/>
	{#if tagline}
		<div class="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 dark:from-black/80 to-transparent p-6 sm:p-8">
			<p class="text-lg font-medium text-white italic sm:text-xl">{tagline}</p>
		</div>
	{/if}
</section>
