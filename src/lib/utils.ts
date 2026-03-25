import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { HTMLAttributes } from 'svelte/elements'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export type WithElementRef<T extends HTMLAttributes<HTMLElement> = HTMLAttributes<HTMLElement>> = T & {
	ref?: HTMLElement | null
}

export type WithoutChild<T> = Omit<T, 'child' | 'children'>
export type WithoutChildren<T> = WithoutChild<T>
export type WithoutChildrenOrChild<T> = WithoutChild<T>
