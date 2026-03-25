<script lang="ts">
	let {
		siteName,
		footerText,
	}: {
		siteName: string
		footerText?: string
	} = $props()
</script>

<footer class="mt-auto border-t bg-card">
	<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
		<div class="flex flex-col items-center gap-2 text-sm text-muted-foreground sm:flex-row sm:justify-between">
			<p>{footerText ?? `\u00A9 ${new Date().getFullYear()} ${siteName}`}</p>
			<p>
				Powered by <a href="https://broadcake.com" class="hover:text-foreground transition-colors" target="_blank" rel="noopener noreferrer">Broadcake</a>
			</p>
		</div>
	</div>
</footer>
