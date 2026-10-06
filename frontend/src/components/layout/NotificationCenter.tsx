'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useNotificationsContext } from '@/providers/NotificationsProvider';
import { useTasks } from '@/hooks/useTasks';
import { formatDate } from '@/utils/formatters';

function iconTypeFor(priority: string): 'success' | 'warning' | 'info' {
    if (priority === 'CRITICAL' || priority === 'HIGH') return 'warning';
    if (priority === 'LOW') return 'success';
    return 'info';
}

/**
 * NotificationCenter — Dropdown menu for recent alerts, backed by real
 * notifications generated from the Kafka event pipeline (project created,
 * task assigned, task status changed).
 */
export function NotificationCenter() {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const { notifications, unreadCount, markAllAsRead, markAsRead } = useNotificationsContext();
    const { tasks } = useTasks();

    const handleNotificationClick = (n: { id: string; isRead: boolean; actionUrl?: string }) => {
        if (!n.isRead) markAsRead(n.id);
        setOpen(false);

        if (!n.actionUrl) return;
        const taskMatch = n.actionUrl.match(/\/tasks\/([\w-]+)/);
        if (taskMatch) {
            const task = tasks.find((t) => t.id === taskMatch[1]);
            if (task) router.push(`/projects/${task.projectId}`);
            return;
        }
        const projectMatch = n.actionUrl.match(/\/projects\/([\w-]+)/);
        if (projectMatch) router.push(`/projects/${projectMatch[1]}`);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setOpen(!open)}
                className={cn(
                    'relative p-2 rounded-[var(--radius-md)] transition-colors',
                    'text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))] hover:bg-[rgb(var(--bg-muted))]',
                    open && 'bg-[rgb(var(--bg-muted))] text-[rgb(var(--text-primary))]'
                )}
                aria-label="Notifications"
            >
                <Bell size={18} />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 h-4 min-w-[16px] px-1 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center border-2 border-[rgb(var(--bg-surface))]">
                        {unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {open && (
                    <>
                        {/* Backdrop for closing */}
                        <div
                            className="fixed inset-0 z-40 bg-transparent"
                            onClick={() => setOpen(false)}
                        />

                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                            className={cn(
                                'absolute right-0 mt-2 z-50 w-80 max-h-[480px] flex flex-col',
                                'bg-[rgb(var(--bg-surface))] border border-[rgb(var(--border-default))] rounded-[var(--radius-lg)] shadow-[var(--shadow-xl)]',
                            )}
                        >
                            <div className="flex items-center justify-between p-4 border-b border-[rgb(var(--border-default))]">
                                <h3 className="text-sm font-bold text-[rgb(var(--text-primary))]">Notifications</h3>
                                <button
                                    onClick={() => markAllAsRead()}
                                    className="text-[11px] font-semibold text-indigo-500 hover:text-indigo-600 transition-colors"
                                >
                                    Mark all as read
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto customize-scrollbar">
                                {notifications.length === 0 ? (
                                    <div className="py-12 text-center text-[rgb(var(--text-muted))]">
                                        <Bell size={24} className="mx-auto mb-2 opacity-20" />
                                        <p className="text-xs">No new notifications</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-[rgb(var(--border-default))]">
                                        {notifications.map((n) => {
                                            const type = iconTypeFor(n.priority);
                                            return (
                                                <div
                                                    key={n.id}
                                                    onClick={() => handleNotificationClick(n)}
                                                    className={cn(
                                                        'p-4 flex gap-3 transition-colors cursor-pointer hover:bg-[rgb(var(--bg-muted))/40]',
                                                        !n.isRead && 'bg-indigo-500/[0.03]'
                                                    )}
                                                >
                                                    <div className={cn(
                                                        'h-8 w-8 rounded-full flex items-center justify-center shrink-0',
                                                        type === 'success' && 'bg-emerald-500/10 text-emerald-500',
                                                        type === 'warning' && 'bg-amber-500/10 text-amber-500',
                                                        type === 'info' && 'bg-blue-500/10 text-blue-500',
                                                    )}>
                                                        {type === 'success' && <Check size={14} />}
                                                        {type === 'warning' && <AlertTriangle size={14} />}
                                                        {type === 'info' && <Info size={14} />}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs font-bold text-[rgb(var(--text-primary))] mb-0.5">{n.title}</p>
                                                        <p className="text-[11px] text-[rgb(var(--text-secondary))] leading-normal mb-1">{n.message}</p>
                                                        <p className="text-[10px] text-[rgb(var(--text-muted))]">{formatDate(n.createdAt)}</p>
                                                    </div>
                                                    {!n.isRead && (
                                                        <div className="h-2 w-2 rounded-full bg-indigo-500 mt-1" />
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
