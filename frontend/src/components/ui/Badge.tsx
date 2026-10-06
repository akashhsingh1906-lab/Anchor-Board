'use client';

import { cn } from '@/utils/cn';

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
type BadgeSize = 'sm' | 'md';

const variantMap: Record<BadgeVariant, string> = {
    default: 'bg-[rgb(var(--bg-subtle))] text-[rgb(var(--text-secondary))]',
    primary: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
    success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    danger: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
    info: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
};

const sizeMap: Record<BadgeSize, string> = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
};

interface BadgeProps {
    children: React.ReactNode;
    variant?: BadgeVariant;
    size?: BadgeSize;
    dot?: boolean;
    pulse?: boolean;
    className?: string;
}

/** Badge — status indicator chip with optional animated pulse dot. */
export function Badge({
    children,
    variant = 'default',
    size = 'sm',
    dot = false,
    pulse = false,
    className,
}: BadgeProps) {
    return (
        <span
            className={cn(
                'inline-flex items-center gap-1.5 rounded-full font-medium',
                variantMap[variant],
                sizeMap[size],
                className,
            )}
        >
            {dot && (
                <span className="relative flex h-1.5 w-1.5">
                    {pulse && (
                        <span
                            className={cn(
                                'absolute inline-flex h-full w-full rounded-full opacity-75',
                                'animate-ping',
                                variant === 'success' ? 'bg-emerald-400' : 'bg-current',
                            )}
                        />
                    )}
                    <span
                        className={cn(
                            'relative inline-flex rounded-full h-1.5 w-1.5',
                            variant === 'success' ? 'bg-emerald-500' : 'bg-current',
                        )}
                    />
                </span>
            )}
            {children}
        </span>
    );
}

/** Helper to get badge variant from priority string */
export function priorityVariant(priority: string): BadgeVariant {
    const map: Record<string, BadgeVariant> = {
        low: 'default',
        medium: 'info',
        high: 'warning',
        urgent: 'danger',
    };
    return map[priority] ?? 'default';
}

/** Helper to get badge variant from status string */
export function statusVariant(status: string): BadgeVariant {
    const map: Record<string, BadgeVariant> = {
        active: 'success',
        paused: 'warning',
        completed: 'primary',
        archived: 'default',
        todo: 'default',
        in_progress: 'info',
        review: 'warning',
        done: 'success',
    };
    return map[status] ?? 'default';
}
