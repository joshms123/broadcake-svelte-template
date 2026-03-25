<script lang="ts">
	import type { Archive, StationArchive } from '@techcake/broadcake-sdk'
	import ArchiveEntry from './ArchiveEntry.svelte'
	import Pagination from './Pagination.svelte'

	let {
		archives,
		nextCursor,
		showShowName = false,
		baseUrl,
	}: {
		archives: (Archive | StationArchive)[]
		nextCursor: string | null
		showShowName?: boolean
		baseUrl: string
	} = $props()
</script>

{#if archives.length === 0}
	<p class="text-muted-foreground italic">No archives available.</p>
{:else}
	<div class="space-y-4">
		{#each archives as archive (archive.id)}
			<ArchiveEntry {archive} {showShowName} />
		{/each}
	</div>
	<Pagination {nextCursor} {baseUrl} />
{/if}
