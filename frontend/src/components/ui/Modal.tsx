'use client';

import { useEffect, useCallback, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    children: ReactNode;
    footer?: ReactNode;
}

const sizeMap = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
};

/**
 * Modal — accessible, animated dialog with backdrop blur.
 * Renders into a portal, traps focus, supports Escape key.
 */
export function Modal({ isOpen, onClose, title, description, size = 'md', children, footer }: ModalProps) {
    // Close on Escape key
    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        },
        [onClose],
    );

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isOpen, handleKeyDown]);

    if (typeof document === 'undefined') return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                        onClick={onClose}
                        aria-hidden="true"
                    />

                    {/* Dialog */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            key="modal"
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby={title ? 'modal-title' : undefined}
                            initial={{ opacity: 0, scale: 0.95, y: 16 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 16 }}
                            transition={{ type: 'spring', duration: 0.3, bounce: 0.2 }}
                            className={cn(
                                'w-full rounded-[var(--radius-xl)] shadow-[var(--shadow-xl)]',
                                'bg-[rgb(var(--bg-surface))] border border-[rgb(var(--border-default))]',
                                'flex flex-col max-h-[90vh]',
                                sizeMap[size],
                            )}
                        >
                            {/* Header */}
                            {title && (
                                <div className="flex items-start justify-between p-6 border-b border-[rgb(var(--border-default))]">
                                    <div>
                                        <h2 id="modal-title" className="text-lg font-semibold text-[rgb(var(--text-primary))]">
                                            {title}
                                        </h2>
                                        {description && (
                                            <p className="mt-1 text-sm text-[rgb(var(--text-secondary))]">{description}</p>
                                        )}
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="p-1.5 rounded-lg text-[rgb(var(--text-muted))] hover:text-[rgb(var(--text-primary))] hover:bg-[rgb(var(--bg-muted))] transition-colors"
                                        aria-label="Close modal"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            )}

                            {/* Body */}
                            <div className="flex-1 overflow-y-auto p-6">{children}</div>

                            {/* Footer */}
                            {footer && (
                                <div className="p-6 pt-0 flex items-center justify-end gap-3 border-t border-[rgb(var(--border-default))] mt-auto">
                                    {footer}
                                </div>
                            )}
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>,
        document.body,
    );
}
