<script lang="ts">
	import { toggleMode } from 'mode-watcher'
	import Sun from '@lucide/svelte/icons/sun'
	import Moon from '@lucide/svelte/icons/moon'
</script>

<button
	onclick={toggleMode}
	class="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
	aria-label="Toggle color theme"
>
	<Sun class="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
	<Moon class="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
</button>
