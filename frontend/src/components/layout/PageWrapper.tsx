'use client';

// PageWrapper — Framer Motion page transition container
// Wrap every page's root div with this for consistent fade+slide animations

import { motion } from 'framer-motion';
import { type ReactNode } from 'react';

const pageVariants = {
    initial: { opacity: 0, y: 12 },
    enter: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
};

interface PageWrapperProps {
    children: ReactNode;
    className?: string;
}

export function PageWrapper({ children, className }: PageWrapperProps) {
    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="enter"
            exit="exit"
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
