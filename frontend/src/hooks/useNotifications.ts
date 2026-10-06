'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { notificationClient } from '@/lib/axios';
import { useToast } from '@/providers/ToastProvider';

export interface ApiNotification {
    id: string;
    title: string;
    message: string;
    type: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    isRead: boolean;
    createdAt: string;
    actionUrl?: string;
}

function toastTypeFor(priority: ApiNotification['priority']): 'info' | 'success' | 'warning' | 'error' {
    if (priority === 'CRITICAL' || priority === 'HIGH') return 'warning';
    if (priority === 'LOW') return 'success';
    return 'info';
}

/**
 * useNotifications — polls notification-service for real notifications
 * created by the Kafka-driven event pipeline (project created, task
 * assigned, task status changed). Replaces the old fully-fake
 * useSimulatedEvents random toast generator.
 */
export function useNotifications() {
    const [notifications, setNotifications] = useState<ApiNotification[]>([]);
    const seenIds = useRef<Set<string>>(new Set());
    const isFirstLoad = useRef(true);
    const { showToast } = useToast();

    const refresh = useCallback(async () => {
        if (typeof window === 'undefined' || !localStorage.getItem('auth_token')) {
            return;
        }
        try {
            const { data } = await notificationClient.get<ApiNotification[]>('/notifications');

            if (!isFirstLoad.current) {
                for (const n of data) {
                    if (!seenIds.current.has(n.id)) {
                        showToast(n.message, toastTypeFor(n.priority));
                    }
                }
            }

            data.forEach((n) => seenIds.current.add(n.id));
            isFirstLoad.current = false;
            setNotifications(data);
        } catch {
            // notification-service being down shouldn't break the rest of the app
        }
    }, [showToast]);

    useEffect(() => {
        refresh();
        const interval = setInterval(refresh, 8000);
        return () => clearInterval(interval);
    }, [refresh]);

    const markAllAsRead = useCallback(async () => {
        try {
            await notificationClient.patch('/notifications/read-all');
            setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        } catch {
            // best-effort
        }
    }, []);

    const markAsRead = useCallback(async (id: string) => {
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
        try {
            await notificationClient.patch(`/notifications/${id}/read`);
        } catch {
            // best-effort — already optimistically marked read in the UI
        }
    }, []);

    return {
        notifications,
        unreadCount: notifications.filter((n) => !n.isRead).length,
        markAllAsRead,
        markAsRead,
        refresh,
    };
}
