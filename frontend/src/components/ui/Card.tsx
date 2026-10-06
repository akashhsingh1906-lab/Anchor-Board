'use client';

import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/utils/cn';

export interface CardProps extends HTMLMotionProps<'div'> {
    /** Add a glowing border on hover */
    hoverable?: boolean;
    /** Glass morphism effect */
    glass?: boolean;
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingMap = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
};

/**
 * Card — animated surface container.
 * Supports glass morphism and hover lift effect.
 */
export function Card({
    hoverable = false,
    glass = false,
    padding = 'md',
    className,
    children,
    ...props
}: CardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            whileHover={
                hoverable
                    ? { y: -2, boxShadow: '0 12px 24px -4px rgb(0 0 0 / 0.12)' }
                    : undefined
            }
            className={cn(
                'rounded-[var(--radius-lg)] border border-[rgb(var(--border-default))]',
                glass
                    ? 'glass'
                    : 'bg-[rgb(var(--bg-surface))] shadow-[var(--shadow-md)]',
                paddingMap[padding],
                className,
            )}
            {...props}
        >
            {children}
        </motion.div>
    );
}

/**
 * CardHeader — title + optional description + optional actions row.
 */
export function CardHeader({
    title,
    description,
    children,
    className,
}: {
    title: string;
    description?: string;
    children?: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={cn('flex items-start justify-between gap-4 mb-5', className)}>
            <div>
                <h3 className="text-base font-semibold text-[rgb(var(--text-primary))]">{title}</h3>
                {description && (
                    <p className="text-sm text-[rgb(var(--text-secondary))] mt-0.5">{description}</p>
                )}
            </div>
            {children && <div className="flex items-center gap-2">{children}</div>}
        </div>
    );
}
