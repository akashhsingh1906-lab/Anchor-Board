'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { useNotifications, type ApiNotification } from '@/hooks/useNotifications';

interface NotificationsContextValue {
    notifications: ApiNotification[];
    unreadCount: number;
    markAllAsRead: () => Promise<void>;
    markAsRead: (id: string) => Promise<void>;
    refresh: () => Promise<void>;
}

const NotificationsContext = createContext<NotificationsContextValue | null>(null);

/**
 * Mounts the real notification polling exactly once for the whole app, so
 * every consumer (topbar bell, notification dropdown) shares one source of
 * truth instead of each triggering its own duplicate toasts.
 */
export function NotificationsProvider({ children }: { children: ReactNode }) {
    const value = useNotifications();
    return (
        <NotificationsContext.Provider value={value}>
            {children}
        </NotificationsContext.Provider>
    );
}

export function useNotificationsContext() {
    const ctx = useContext(NotificationsContext);
    if (!ctx) {
        throw new Error('useNotificationsContext must be used within NotificationsProvider');
    }
    return ctx;
}
