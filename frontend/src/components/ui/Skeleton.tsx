'use client';

import { cn } from '@/utils/cn';

interface SkeletonProps {
    className?: string;
    width?: string;
    height?: string;
}

/** Single skeleton shimmer line/block. */
export function Skeleton({ className, width, height }: SkeletonProps) {
    return (
        <div
            className={cn('skeleton rounded-md', className)}
            style={{ width, height }}
            aria-hidden="true"
        />
    );
}

/** Pre-built skeleton for a card with title + body lines. */
export function CardSkeleton() {
    return (
        <div className="rounded-[var(--radius-lg)] border border-[rgb(var(--border-default))] bg-[rgb(var(--bg-surface))] p-6 space-y-4">
            <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-1/4" />
                </div>
            </div>
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
            <Skeleton className="h-3 w-4/6" />
        </div>
    );
}

/** Stats card skeleton */
export function StatCardSkeleton() {
    return (
        <div className="rounded-[var(--radius-lg)] border border-[rgb(var(--border-default))] bg-[rgb(var(--bg-surface))] p-5 space-y-3">
            <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-9 w-9 rounded-lg" />
            </div>
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-3 w-16" />
        </div>
    );
}

/** Table row skeleton */
export function TableRowSkeleton({ cols = 4 }: { cols?: number }) {
    return (
        <tr>
            {Array.from({ length: cols }).map((_, i) => (
                <td key={i} className="px-4 py-3">
                    <Skeleton className="h-4 w-full" />
                </td>
            ))}
        </tr>
    );
}
