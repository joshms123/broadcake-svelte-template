<script lang="ts">
	type PresenterItem = { name?: string; display_name?: string; slug?: string }

	let { presenters, linked = false }: { presenters: PresenterItem[]; linked?: boolean } = $props()

	function getName(p: PresenterItem): string {
		return p.name || p.display_name || ''
	}
</script>

{#if presenters.length > 0}
	<span class="text-muted-foreground">
		{#each presenters as presenter, i}
			{#if i > 0}, {/if}
			{#if linked && presenter.slug}
				<a href="/presenters/{presenter.slug}" class="hover:text-foreground transition-colors">
					{getName(presenter)}
				</a>
			{:else}
				{getName(presenter)}
			{/if}
		{/each}
	</span>
{/if}
