<script lang="ts">
	let { status, message }: { status: number; message: string } = $props()
</script>

<div class="flex min-h-[50vh] flex-col items-center justify-center text-center">
	<h2 class="text-6xl font-bold text-muted-foreground">{status}</h2>
	<p class="mt-4 text-xl text-muted-foreground">{message}</p>
	<a
		href="/"
		class="mt-8 inline-flex items-center rounded-md bg-primary px-4 py-2 text-primary-foreground hover:opacity-90 transition-opacity"
	>
		Go home
	</a>
</div>
