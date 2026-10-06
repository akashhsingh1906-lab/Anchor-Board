import { QueryClient } from '@tanstack/react-query';

// ============================================================
// React Query Client — singleton with sensible defaults
// ============================================================
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Consider data fresh for 1 minute
            staleTime: 60 * 1000,
            // Keep data in cache for 5 minutes after unmount
            gcTime: 5 * 60 * 1000,
            // Retry once on failure
            retry: 1,
            // Don't refetch on window focus in dev
            refetchOnWindowFocus: process.env.NODE_ENV === 'production',
        },
        mutations: {
            retry: 0,
        },
    },
});
