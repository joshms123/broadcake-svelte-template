interface TurnstileInstance {
	render(container: string | HTMLElement, options: Record<string, unknown>): string
	reset(widgetId?: string): void
	getResponse(widgetId?: string): string | undefined
	remove(widgetId?: string): void
}

declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	interface Window {
		turnstile?: TurnstileInstance
	}
}

export {}
