import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

// These must stay in sync with shadcn-svelte's own utils.ts. A previous version
// defined WithoutChild as Omit<T, 'child' | 'children'> and aliased the other
// two to it, which stripped `children` from every component that only meant to
// strip `child` — producing type errors across the ui/ components.
export type WithoutChild<T> = T extends { child?: unknown } ? Omit<T, 'child'> : T
export type WithoutChildren<T> = T extends { children?: unknown } ? Omit<T, 'children'> : T
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>

// Unconstrained, with the element type as a second parameter — the constrained
// form rejected HTMLAttributes<HTMLDivElement>, which is not assignable to
// HTMLAttributes<HTMLElement>.
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & {
	ref?: U | null
}
