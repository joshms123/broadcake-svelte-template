<script lang="ts">
	import { getClient } from '$lib/sdk'
	import { Button } from '$lib/components/ui/button'
	import type { FormDetail, FormField } from '@techcake/broadcake-sdk'

	let {
		form,
		onSuccess,
		captchaSiteKey,
	}: {
		form: FormDetail
		onSuccess?: () => void
		captchaSiteKey?: string
	} = $props()

	let submitting = $state(false)
	let submitted = $state(false)
	let fieldErrors = $state<Record<string, string>>({})
	let generalError = $state<string | null>(null)
	let formValues = $state<Record<string, unknown>>({})
	let loadTimestamp = $state(Date.now())
	let captchaError = $state<string | null>(null)

	$effect(() => {
		if (!captchaSiteKey) return
		if (document.querySelector('script[src*="turnstile"]')) return
		const script = document.createElement('script')
		script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
		script.async = true
		script.defer = true
		document.head.appendChild(script)
	})

	const fields = $derived(form.fields.filter((f: FormField) => f.type !== 'hidden'))
	const hiddenFields = $derived(form.fields.filter((f: FormField) => f.type === 'hidden'))

	function getInputId(field: FormField): string {
		return `field-${field.id}`
	}

	function getDescId(field: FormField): string {
		return `desc-${field.id}`
	}

	function getErrorId(field: FormField): string {
		return `error-${field.id}`
	}

	function ariaDescribedBy(field: FormField): string | undefined {
		const ids: string[] = []
		if (field.description) ids.push(getDescId(field))
		if (fieldErrors[field.id]) ids.push(getErrorId(field))
		return ids.length > 0 ? ids.join(' ') : undefined
	}

	function getOptions(field: FormField): { value: string; label: string }[] {
		switch (field.type) {
			case 'genre':
				return (form.connected.genres ?? []).map((g) => ({ value: g.name, label: g.name }))
			case 'show':
				return (form.connected.shows ?? []).map((s) => ({ value: s.name, label: s.name }))
			case 'presenter':
				return (form.connected.presenters ?? []).map((p) => ({ value: p.display_name, label: p.display_name }))
			default:
				return (field.options ?? []).map((o) => ({ value: o, label: o }))
		}
	}

	function resetCaptcha() {
		if (captchaSiteKey) window.turnstile?.reset()
	}

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault()
		fieldErrors = {}
		generalError = null
		captchaError = null
		submitting = true

		// Build submission data
		const data: Record<string, unknown> = { ...formValues }

		// Add hidden field defaults
		for (const field of hiddenFields) {
			if (field.default_value) data[field.id] = field.default_value
		}

		// Add spam protection fields
		data._t = loadTimestamp
		data._hp = (document.getElementById('hp-field') as HTMLInputElement)?.value ?? ''

		// If captcha is enabled, validate and submit through proxy
		if (captchaSiteKey) {
			const token = window.turnstile?.getResponse()
			if (!token) {
				captchaError = 'Please complete the CAPTCHA verification.'
				submitting = false
				return
			}
			data._turnstile = token
		}

		try {
			let result: { success: boolean; error?: string; field_errors?: Record<string, string> }

			if (captchaSiteKey) {
				// Submit through local proxy (validates Turnstile server-side)
				const res = await fetch(`/api/forms/${form.slug}/submit`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(data),
				})
				result = await res.json()
			} else {
				// Submit directly to v1 API
				const bc = getClient()
				result = await bc.submitForm(form.slug, data)
			}

			if (result.success) {
				submitted = true
				if (onSuccess) onSuccess()
				if (form.success_redirect_url) {
					// Only allow http/https redirects (prevent javascript: etc.)
					try {
						const url = new URL(form.success_redirect_url)
						if (url.protocol === 'http:' || url.protocol === 'https:') {
							window.location.href = form.success_redirect_url
						}
					} catch {
						// Invalid URL — ignore redirect, show success message
					}
				}
			} else if (result.field_errors) {
				fieldErrors = result.field_errors
				// Focus first error
				const firstErrorId = Object.keys(result.field_errors)[0]
				if (firstErrorId) {
					const el = document.getElementById(`field-${firstErrorId}`)
					el?.focus()
				}
				resetCaptcha()
			} else {
				generalError = result.error ?? 'Something went wrong. Please try again.'
				resetCaptcha()
			}
		} catch (err: unknown) {
			// Handle validation errors returned as 400
			if (err && typeof err === 'object' && 'body' in err) {
				const body = (err as { body: unknown }).body
				if (body && typeof body === 'object' && 'field_errors' in body) {
					fieldErrors = (body as { field_errors: Record<string, string> }).field_errors
					const firstErrorId = Object.keys(fieldErrors)[0]
					if (firstErrorId) {
						const el = document.getElementById(`field-${firstErrorId}`)
						el?.focus()
					}
					resetCaptcha()
					submitting = false
					return
				}
			}
			generalError = 'Something went wrong. Please try again.'
			resetCaptcha()
		} finally {
			submitting = false
		}
	}
</script>

{#if submitted}
	<div class="rounded-lg border bg-green-50 dark:bg-green-950 p-6 text-center" role="status">
		<p class="text-green-800 dark:text-green-200 font-medium">
			{form.success_message ?? 'Thanks for your submission!'}
		</p>
	</div>
{:else}
	<form onsubmit={handleSubmit} class="space-y-6" novalidate>
		<!-- Honeypot (hidden from users, visible to bots) -->
		<div class="absolute -left-[9999px]" aria-hidden="true">
			<label for="hp-field">Leave this empty</label>
			<input type="text" id="hp-field" name="_hp" tabindex="-1" autocomplete="off" />
		</div>

		{#if generalError}
			<div class="rounded-md border border-red-300 bg-red-50 dark:bg-red-950 p-3 text-sm text-red-800 dark:text-red-200" role="alert">
				{generalError}
			</div>
		{/if}

		{#each fields as field (field.id)}
			{@const inputId = getInputId(field)}
			{@const hasError = !!fieldErrors[field.id]}
			<div class="space-y-2">
				<!-- Label -->
				{#if field.type === 'checkbox'}
					<div class="flex items-start gap-3">
						<input
							type="checkbox"
							id={inputId}
							checked={!!formValues[field.id]}
							onchange={(e) => formValues[field.id] = (e.target as HTMLInputElement).checked}
							aria-required={field.required || undefined}
							aria-describedby={ariaDescribedBy(field)}
							aria-invalid={hasError || undefined}
							class="mt-0.5 h-4 w-4 rounded border-input"
						/>
						<label for={inputId} class="text-sm font-medium leading-tight">
							{field.label}
							{#if field.required}<span class="text-muted-foreground"> (required)</span>{/if}
						</label>
					</div>
				{:else}
					<label for={inputId} class="block text-sm font-medium">
						{field.label}
						{#if field.required}<span class="text-muted-foreground"> (required)</span>{/if}
					</label>
				{/if}

				<!-- Description -->
				{#if field.description}
					<p id={getDescId(field)} class="text-sm text-muted-foreground">{field.description}</p>
				{/if}

				<!-- Input -->
				{#if field.type === 'text' || field.type === 'email' || field.type === 'url' || field.type === 'phone'}
					<input
						type={field.type === 'phone' ? 'tel' : field.type}
						id={inputId}
						value={String(formValues[field.id] ?? '')}
						oninput={(e) => formValues[field.id] = (e.target as HTMLInputElement).value}
						placeholder={field.placeholder}
						aria-required={field.required || undefined}
						aria-describedby={ariaDescribedBy(field)}
						aria-invalid={hasError || undefined}
						class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
					/>
				{:else if field.type === 'number'}
					<input
						type="number"
						id={inputId}
						value={String(formValues[field.id] ?? '')}
						oninput={(e) => {
							const v = (e.target as HTMLInputElement).value
							formValues[field.id] = v === '' ? '' : Number(v)
						}}
						placeholder={field.placeholder}
						min={field.min}
						max={field.max}
						aria-required={field.required || undefined}
						aria-describedby={ariaDescribedBy(field)}
						aria-invalid={hasError || undefined}
						class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
					/>
				{:else if field.type === 'textarea'}
					<textarea
						id={inputId}
						value={String(formValues[field.id] ?? '')}
						oninput={(e) => formValues[field.id] = (e.target as HTMLTextAreaElement).value}
						placeholder={field.placeholder}
						aria-required={field.required || undefined}
						aria-describedby={ariaDescribedBy(field)}
						aria-invalid={hasError || undefined}
						rows="4"
						class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
					></textarea>
				{:else if field.type === 'select' || field.type === 'genre' || field.type === 'show' || field.type === 'presenter'}
					<select
						id={inputId}
						value={String(formValues[field.id] ?? '')}
						onchange={(e) => formValues[field.id] = (e.target as HTMLSelectElement).value}
						aria-required={field.required || undefined}
						aria-describedby={ariaDescribedBy(field)}
						aria-invalid={hasError || undefined}
						class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
					>
						<option value="">{field.placeholder ?? 'Select an option'}</option>
						{#each getOptions(field) as option (option.value)}
							<option value={option.value}>{option.label}</option>
						{/each}
					</select>
				{:else if field.type === 'radio'}
					<fieldset aria-describedby={ariaDescribedBy(field)} aria-invalid={hasError || undefined} aria-required={field.required || undefined}>
						<legend class="sr-only">{field.label}</legend>
						<div class="space-y-2">
							{#each getOptions(field) as option, i (option.value)}
								<div class="flex items-center gap-2">
									<input
										type="radio"
										id="{inputId}-{i}"
										name={field.id}
										value={option.value}
										checked={formValues[field.id] === option.value}
										onchange={() => formValues[field.id] = option.value}
										class="h-4 w-4 border-input"
									/>
									<label for="{inputId}-{i}" class="text-sm">{option.label}</label>
								</div>
							{/each}
						</div>
					</fieldset>
				{:else if field.type === 'date'}
					<input
						type="date"
						id={inputId}
						value={String(formValues[field.id] ?? '')}
						oninput={(e) => formValues[field.id] = (e.target as HTMLInputElement).value}
						aria-required={field.required || undefined}
						aria-describedby={ariaDescribedBy(field)}
						aria-invalid={hasError || undefined}
						class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
					/>
				{:else if field.type === 'date_range'}
					{@const range = (formValues[field.id] as { start?: string; end?: string }) ?? {}}
					<div class="grid grid-cols-2 gap-4">
						<div>
							<label for="{inputId}-start" class="text-xs text-muted-foreground">Start</label>
							<input
								type="date"
								id="{inputId}-start"
								value={range.start ?? ''}
								oninput={(e) => formValues[field.id] = { ...range, start: (e.target as HTMLInputElement).value }}
								aria-required={field.required || undefined}
								aria-describedby={ariaDescribedBy(field)}
								aria-invalid={hasError || undefined}
								class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
							/>
						</div>
						<div>
							<label for="{inputId}-end" class="text-xs text-muted-foreground">End</label>
							<input
								type="date"
								id="{inputId}-end"
								value={range.end ?? ''}
								oninput={(e) => formValues[field.id] = { ...range, end: (e.target as HTMLInputElement).value }}
								aria-required={field.required || undefined}
								aria-describedby={ariaDescribedBy(field)}
								aria-invalid={hasError || undefined}
								class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
							/>
						</div>
					</div>
				{:else if field.type === 'time'}
					<input
						type="time"
						id={inputId}
						value={String(formValues[field.id] ?? '')}
						oninput={(e) => formValues[field.id] = (e.target as HTMLInputElement).value}
						aria-required={field.required || undefined}
						aria-describedby={ariaDescribedBy(field)}
						aria-invalid={hasError || undefined}
						class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
					/>
				{/if}

				<!-- Error message -->
				{#if hasError}
					<p id={getErrorId(field)} class="text-sm text-red-500" role="alert">
						{fieldErrors[field.id]}
					</p>
				{/if}
			</div>
		{/each}

		{#if captchaSiteKey}
			<div>
				<div class="cf-turnstile" data-sitekey={captchaSiteKey}></div>
				{#if captchaError}
					<p class="mt-2 text-sm text-red-500" role="alert">{captchaError}</p>
				{/if}
			</div>
		{/if}

		<Button type="submit" disabled={submitting} aria-busy={submitting || undefined} class="w-full sm:w-auto">
			{submitting ? 'Submitting…' : 'Submit'}
		</Button>
	</form>
{/if}
