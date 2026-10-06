'use client';

import { useState, useRef, useEffect, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';

interface DropdownItem {
    label?: string;
    icon?: ReactNode;
    onClick?: () => void;
    href?: string;
    divider?: boolean;
    danger?: boolean;
    disabled?: boolean;
}

interface DropdownProps {
    trigger: ReactNode;
    items: DropdownItem[];
    align?: 'left' | 'right';
    className?: string;
}

/**
 * Dropdown — animated menu with click-outside close.
 */
export function Dropdown({ trigger, items, align = 'right', className }: DropdownProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={ref} className={cn('relative inline-block', className)}>
            <div onClick={() => setOpen((v) => !v)} className="cursor-pointer">
                {trigger}
            </div>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -4 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -4 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        className={cn(
                            'absolute z-50 mt-2 min-w-[180px] rounded-[var(--radius-lg)]',
                            'bg-[rgb(var(--bg-surface))] border border-[rgb(var(--border-default))]',
                            'shadow-[var(--shadow-xl)] p-1.5',
                            align === 'right' ? 'right-0' : 'left-0',
                        )}
                        role="menu"
                    >
                        {items.map((item, i) => (
                            item.divider ? (
                                <div key={`div-${i}`} className="my-1 border-t border-[rgb(var(--border-default))]" />
                            ) : (
                                <button
                                    key={i}
                                    onClick={() => { item.onClick?.(); setOpen(false); }}
                                    disabled={item.disabled}
                                    role="menuitem"
                                    className={cn(
                                        'flex w-full items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium',
                                        'transition-colors duration-[var(--transition-fast)]',
                                        item.danger
                                            ? 'text-red-500 hover:bg-red-500/10'
                                            : 'text-[rgb(var(--text-secondary))] hover:bg-[rgb(var(--bg-muted))] hover:text-[rgb(var(--text-primary))]',
                                        item.disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer',
                                    )}
                                >
                                    {item.icon && <span className="shrink-0">{item.icon}</span>}
                                    {item.label}
                                </button>
                            )
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
