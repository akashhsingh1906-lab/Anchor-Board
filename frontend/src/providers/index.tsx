'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from 'next-themes';
import { type ReactNode } from 'react';
import { ToastProvider } from './ToastProvider';
import { NotificationsProvider } from './NotificationsProvider';
import { queryClient } from '@/lib/queryClient';

interface ProvidersProps {
    children: ReactNode;
}

/**
 * Root providers wrapper.
 * Includes React Query and next-themes ThemeProvider.
 */
export function Providers({ children }: ProvidersProps) {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider
                attribute="class"
                defaultTheme="dark"
                enableSystem
                disableTransitionOnChange={false}
            >
                <ToastProvider>
                    <NotificationsProvider>
                        {children}
                    </NotificationsProvider>
                </ToastProvider>
            </ThemeProvider>
            {/* React Query devtools — only in development */}
            {process.env.NODE_ENV === 'development' && (
                <ReactQueryDevtools initialIsOpen={false} />
            )}
        </QueryClientProvider>
    );
}
