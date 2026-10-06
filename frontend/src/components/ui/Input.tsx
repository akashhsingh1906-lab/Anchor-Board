'use client';

import { forwardRef, useState, type InputHTMLAttributes, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    hint?: string;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    fullWidth?: boolean;
}

/**
 * Input — floating label, icon support, error state, animated.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            label,
            error,
            hint,
            leftIcon,
            rightIcon,
            type = 'text',
            fullWidth = true,
            className,
            id,
            ...props
        },
        ref,
    ) => {
        const [showPassword, setShowPassword] = useState(false);
        const inputId = id ?? label?.toLowerCase().replace(/\s/g, '-');
        const isPassword = type === 'password';
        const resolvedType = isPassword ? (showPassword ? 'text' : 'password') : type;

        return (
            <div className={cn('flex flex-col gap-1.5', fullWidth ? 'w-full' : '')}>
                {label && (
                    <label
                        htmlFor={inputId}
                        className="text-sm font-medium text-[rgb(var(--text-secondary))]"
                    >
                        {label}
                    </label>
                )}
                <motion.div
                    whileFocus={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                    className="relative flex items-center"
                >
                    {leftIcon && (
                        <span className="absolute left-3 text-[rgb(var(--text-muted))] pointer-events-none">
                            {leftIcon}
                        </span>
                    )}
                    <input
                        ref={ref}
                        id={inputId}
                        type={resolvedType}
                        className={cn(
                            'w-full rounded-[var(--radius-md)] border px-3 py-2.5 text-sm',
                            'bg-[rgb(var(--bg-muted))] text-[rgb(var(--text-primary))]',
                            'border-[rgb(var(--border-default))] placeholder:text-[rgb(var(--text-muted))]',
                            'transition-all duration-[var(--transition-fast)]',
                            'focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20',
                            error
                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                                : '',
                            leftIcon ? 'pl-10' : '',
                            rightIcon || isPassword ? 'pr-10' : '',
                            className,
                        )}
                        {...props}
                    />
                    {isPassword && (
                        <button
                            type="button"
                            onClick={() => setShowPassword((v) => !v)}
                            className="absolute right-3 text-[rgb(var(--text-muted))] hover:text-[rgb(var(--text-secondary))] transition-colors"
                            tabIndex={-1}
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    )}
                    {rightIcon && !isPassword && (
                        <span className="absolute right-3 text-[rgb(var(--text-muted))] pointer-events-none">
                            {rightIcon}
                        </span>
                    )}
                </motion.div>
                <AnimatePresence mode="wait">
                    {error && (
                        <motion.p
                            key="error"
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            className="text-xs text-red-500"
                        >
                            {error}
                        </motion.p>
                    )}
                    {hint && !error && (
                        <motion.p
                            key="hint"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-xs text-[rgb(var(--text-muted))]"
                        >
                            {hint}
                        </motion.p>
                    )}
                </AnimatePresence>
            </div>
        );
    },
);

Input.displayName = 'Input';
