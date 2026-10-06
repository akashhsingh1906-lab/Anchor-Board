'use client';

import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';

// ── Variant & Size Maps ───────────────────────────────────────
const variantClasses = {
    primary:
        'bg-indigo-600 text-white hover:bg-indigo-500 active:bg-indigo-700 shadow-lg shadow-indigo-500/20',
    secondary:
        'bg-[rgb(var(--bg-muted))] text-[rgb(var(--text-primary))] hover:bg-[rgb(var(--bg-subtle))] border border-[rgb(var(--border-default))]',
    ghost:
        'text-[rgb(var(--text-secondary))] hover:bg-[rgb(var(--bg-muted))] hover:text-[rgb(var(--text-primary))]',
    danger:
        'bg-red-600 text-white hover:bg-red-500 active:bg-red-700 shadow-lg shadow-red-500/20',
    outline:
        'border border-indigo-500 text-indigo-500 hover:bg-indigo-500/10',
};

const sizeClasses = {
    sm: 'h-8 px-3 text-xs gap-1.5',
    md: 'h-10 px-4 text-sm gap-2',
    lg: 'h-11 px-6 text-base gap-2',
    xl: 'h-12 px-8 text-base gap-2.5',
    icon: 'h-9 w-9 p-0',
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: keyof typeof variantClasses;
    size?: keyof typeof sizeClasses;
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    fullWidth?: boolean;
}

/**
 * Button — animated, multi-variant button component.
 * Uses Framer Motion for hover and tap micro-animations.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            variant = 'primary',
            size = 'md',
            isLoading = false,
            leftIcon,
            rightIcon,
            fullWidth = false,
            className,
            children,
            disabled,
            ...props
        },
        ref,
    ) => {
        const isDisabled = disabled || isLoading;

        return (
            <motion.button
                ref={ref}
                whileHover={{ scale: isDisabled ? 1 : 1.02 }}
                whileTap={{ scale: isDisabled ? 1 : 0.97 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                disabled={isDisabled}
                className={cn(
                    'inline-flex items-center justify-center rounded-[var(--radius-md)] font-medium',
                    'transition-colors duration-[var(--transition-fast)]',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2',
                    'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
                    'select-none cursor-pointer',
                    variantClasses[variant],
                    sizeClasses[size],
                    fullWidth ? 'w-full' : '',
                    className,
                )}
                {...(props as HTMLMotionProps<'button'>)}
            >
                {isLoading ? (
                    <Loader2 className="animate-spin" size={16} />
                ) : leftIcon ? (
                    leftIcon
                ) : null}
                {children}
                {!isLoading && rightIcon}
            </motion.button>
        );
    },
);

Button.displayName = 'Button';
