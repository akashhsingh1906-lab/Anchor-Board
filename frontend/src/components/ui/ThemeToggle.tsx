'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon, Monitor } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';

/**
 * ThemeToggle — animated sun/moon icon button.
 * Cycles through light → dark → system.
 */
export function ThemeToggle({ className }: { className?: string }) {
    const { theme, setTheme, resolvedTheme } = useTheme();

    const isDark = resolvedTheme === 'dark';

    const toggle = () => {
        if (theme === 'dark') setTheme('light');
        else if (theme === 'light') setTheme('system');
        else setTheme('dark');
    };

    return (
        <motion.button
            onClick={toggle}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            className={cn(
                'relative h-9 w-9 rounded-[var(--radius-md)] inline-flex items-center justify-center',
                'bg-[rgb(var(--bg-muted))] text-[rgb(var(--text-secondary))]',
                'hover:text-[rgb(var(--text-primary))] hover:bg-[rgb(var(--bg-subtle))]',
                'transition-colors duration-[var(--transition-fast)]',
                className,
            )}
            aria-label="Toggle color theme"
            title={`Current theme: ${theme}`}
        >
            <AnimatePresence mode="wait" initial={false}>
                {theme === 'system' ? (
                    <motion.div
                        key="system"
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Monitor size={16} />
                    </motion.div>
                ) : isDark ? (
                    <motion.div
                        key="dark"
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Moon size={16} />
                    </motion.div>
                ) : (
                    <motion.div
                        key="light"
                        initial={{ rotate: 90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: -90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Sun size={16} />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.button>
    );
}
