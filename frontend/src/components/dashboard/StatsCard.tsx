'use client';

import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import {
    FolderOpen, CheckCircle, Users, Clock,
    TrendingUp, TrendingDown, Minus,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import type { StatCardData } from '@/types';

const iconMap: Record<string, React.ElementType> = {
    FolderOpen, CheckCircle, Users, Clock,
};

const colorMap = {
    blue: {
        bg: 'bg-blue-500/10 dark:bg-blue-500/15',
        icon: 'text-blue-500',
        border: 'border-blue-500/20',
    },
    purple: {
        bg: 'bg-violet-500/10 dark:bg-violet-500/15',
        icon: 'text-violet-500',
        border: 'border-violet-500/20',
    },
    green: {
        bg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
        icon: 'text-emerald-500',
        border: 'border-emerald-500/20',
    },
    orange: {
        bg: 'bg-amber-500/10 dark:bg-amber-500/15',
        icon: 'text-amber-500',
        border: 'border-amber-500/20',
    },
    red: {
        bg: 'bg-red-500/10 dark:bg-red-500/15',
        icon: 'text-red-500',
        border: 'border-red-500/20',
    },
};

/**
 * Animated counter that counts up from 0 to the target number.
 */
function AnimatedCounter({ value }: { value: number }) {
    const ref = useRef<HTMLSpanElement>(null);
    const count = useMotionValue(0);
    const springCount = useSpring(count, { stiffness: 60, damping: 20 });

    useEffect(() => {
        count.set(value);
    }, [value, count]);

    useEffect(() => {
        return springCount.on('change', (latest) => {
            if (ref.current) {
                ref.current.textContent = Math.round(latest).toLocaleString();
            }
        });
    }, [springCount]);

    return <span ref={ref}>0</span>;
}

interface StatsCardProps {
    stat: StatCardData;
    index?: number;
    onClick?: () => void;
}

/**
 * StatsCard — animated widget with counter, trend, and icon.
 */
export function StatsCard({ stat, index = 0, onClick }: StatsCardProps) {
    const Icon = iconMap[stat.icon] ?? FolderOpen;
    const colors = colorMap[stat.color];
    const isNumeric = typeof stat.value === 'number';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.06 }}
            whileHover={{ y: -2 }}
            onClick={onClick}
            role={onClick ? 'button' : undefined}
            className={cn(
                'relative overflow-hidden rounded-[var(--radius-lg)] p-5',
                onClick && 'cursor-pointer',
                'bg-[rgb(var(--bg-surface))] border border-[rgb(var(--border-default))]',
                'shadow-[var(--shadow-md)] transition-shadow hover:shadow-[var(--shadow-lg)]',
            )}
        >
            {/* Background decorative blob */}
            <div className={cn(
                'absolute -right-4 -top-4 h-20 w-20 rounded-full opacity-60',
                colors.bg,
            )} />

            <div className="relative flex items-start justify-between">
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-[rgb(var(--text-secondary))] uppercase tracking-wider mb-2">
                        {stat.label}
                    </p>
                    <p className="text-3xl font-bold text-[rgb(var(--text-primary))] leading-none">
                        {isNumeric ? <AnimatedCounter value={stat.value as number} /> : stat.value}
                    </p>

                    {/* Trend */}
                    <div className="flex items-center gap-1 mt-3">
                        {stat.trend === 'up' && (
                            <TrendingUp size={13} className="text-emerald-500" />
                        )}
                        {stat.trend === 'down' && (
                            <TrendingDown size={13} className="text-red-500" />
                        )}
                        {stat.trend === 'neutral' && (
                            <Minus size={13} className="text-[rgb(var(--text-muted))]" />
                        )}
                        <span
                            className={cn(
                                'text-xs font-semibold',
                                stat.trend === 'up' ? 'text-emerald-500' :
                                    stat.trend === 'down' ? 'text-red-500' :
                                        'text-[rgb(var(--text-muted))]',
                            )}
                        >
                            {stat.change > 0 ? '+' : ''}{stat.change}%
                        </span>
                        <span className="text-xs text-[rgb(var(--text-muted))]">vs last month</span>
                    </div>
                </div>

                {/* Icon */}
                <div className={cn('p-2.5 rounded-[var(--radius-md)]', colors.bg, `border ${colors.border}`)}>
                    <Icon size={20} className={colors.icon} />
                </div>
            </div>
        </motion.div>
    );
}
