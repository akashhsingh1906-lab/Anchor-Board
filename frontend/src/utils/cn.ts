import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines clsx and tailwind-merge for conflict-safe class merging.
 * Use everywhere instead of raw template literals for Tailwind classes.
 */
export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs));
}
