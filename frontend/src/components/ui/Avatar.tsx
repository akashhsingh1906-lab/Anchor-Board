'use client';

import { cn } from '@/utils/cn';
import { getInitials } from '@/utils/formatters';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type StatusType = 'online' | 'away' | 'busy' | 'offline';

const sizeMap: Record<AvatarSize, string> = {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-xs',
    md: 'h-9 w-9 text-sm',
    lg: 'h-11 w-11 text-base',
    xl: 'h-14 w-14 text-lg',
};

const statusColorMap: Record<StatusType, string> = {
    online: 'bg-emerald-500',
    away: 'bg-amber-500',
    busy: 'bg-red-500',
    offline: 'bg-zinc-400',
};

interface AvatarProps {
    src?: string;
    name: string;
    size?: AvatarSize;
    status?: StatusType;
    className?: string;
}

/**
 * Avatar — image with name-based fallback initials.
 * Optional status indicator dot.
 */
export function Avatar({ src, name, size = 'md', status, className }: AvatarProps) {
    return (
        <div className={cn('relative inline-flex shrink-0', className)}>
            {src ? (
                <img
                    src={src}
                    alt={name}
                    className={cn(
                        'rounded-full object-cover ring-2 ring-[rgb(var(--border-default))]',
                        sizeMap[size],
                    )}
                    onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                    }}
                />
            ) : (
                <span
                    className={cn(
                        'inline-flex items-center justify-center rounded-full font-semibold',
                        'bg-indigo-500 text-white',
                        'ring-2 ring-[rgb(var(--border-default))]',
                        sizeMap[size],
                    )}
                    aria-label={name}
                >
                    {getInitials(name)}
                </span>
            )}
            {status && (
                <span
                    className={cn(
                        'absolute bottom-0 right-0 block rounded-full ring-2 ring-[rgb(var(--bg-surface))]',
                        statusColorMap[status],
                        size === 'xs' || size === 'sm' ? 'h-2 w-2' : 'h-2.5 w-2.5',
                    )}
                    aria-label={`Status: ${status}`}
                />
            )}
        </div>
    );
}

/**
 * AvatarGroup — stacked list of Avatars.
 */
export function AvatarGroup({ names, srcs, max = 4, size = 'sm' }: {
    names: string[];
    srcs?: string[];
    max?: number;
    size?: AvatarSize;
}) {
    const visible = names.slice(0, max);
    const extra = names.length - max;

    return (
        <div className="flex -space-x-2">
            {visible.map((name, i) => (
                <Avatar key={name} name={name} src={srcs?.[i]} size={size} />
            ))}
            {extra > 0 && (
                <span
                    className={cn(
                        'inline-flex items-center justify-center rounded-full font-semibold text-xs',
                        'bg-[rgb(var(--bg-muted))] text-[rgb(var(--text-secondary))]',
                        'ring-2 ring-[rgb(var(--bg-surface))]',
                        sizeMap[size],
                    )}
                >
                    +{extra}
                </span>
            )}
        </div>
    );
}
