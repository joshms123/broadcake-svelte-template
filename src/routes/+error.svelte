<script lang="ts">
	import { page } from '$app/state'
	import ErrorPage from '$lib/components/ErrorPage.svelte'
	import PageMeta from '$lib/components/PageMeta.svelte'
</script>

<PageMeta title="Error {page.status}" />
<ErrorPage status={page.status} message={page.error?.message ?? 'Something went wrong'} />
