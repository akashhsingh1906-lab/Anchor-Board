'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    FolderOpen,
    KanbanSquare,
    Users,
    Settings,
    ChevronLeft,
    ChevronRight,
    LogOut,
    HelpCircle,
    Anchor,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/hooks/useAuth';
import { useProjects } from '@/hooks/useProjects';
import { useRouter } from 'next/navigation';

/**
 * Sidebar — collapsible navigation with active route highlight.
 * Framer Motion animated expand/collapse.
 */
export function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const { projects } = useProjects();
    const router = useRouter();

    const navItems = [
        { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/projects', label: 'Projects', icon: FolderOpen, badge: projects.length || undefined },
        { href: '/tasks', label: 'Task Board', icon: KanbanSquare },
        { href: '/team', label: 'Team', icon: Users },
        { href: '/settings', label: 'Settings', icon: Settings },
    ];

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    return (
        <motion.aside
            initial={false}
            animate={{ width: collapsed ? 72 : 256 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={cn(
                'fixed left-0 top-0 z-30 h-screen flex flex-col',
                'bg-[rgb(var(--bg-surface))] border-r border-[rgb(var(--border-default))]',
                'shadow-[var(--shadow-sm)] overflow-hidden',
            )}
        >
            {/* Logo */}
            <div className="flex items-center h-16 px-4 border-b border-[rgb(var(--border-default))] shrink-0">
                <div className="flex items-center gap-2.5 min-w-0">
                    <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/30">
                        <Anchor size={16} className="text-white" strokeWidth={2.25} />
                    </div>
                    <AnimatePresence>
                        {!collapsed && (
                            <motion.span
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -8 }}
                                transition={{ duration: 0.15 }}
                                className="font-bold text-base text-[rgb(var(--text-primary))] whitespace-nowrap"
                            >
                                AnchorBoard
                            </motion.span>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Nav Items */}
            <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
                {navItems.map(({ href, label, icon: Icon, badge }) => {
                    const active = pathname === href || pathname.startsWith(href + '/');
                    return (
                        <Link key={href} href={href} className="block">
                            <motion.div
                                whileHover={{ x: 2 }}
                                whileTap={{ scale: 0.98 }}
                                className={cn(
                                    'flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] cursor-pointer',
                                    'transition-colors duration-[var(--transition-fast)]',
                                    active
                                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                                        : 'text-[rgb(var(--text-secondary))] hover:bg-[rgb(var(--bg-muted))] hover:text-[rgb(var(--text-primary))]',
                                )}
                            >
                                <Icon size={18} className="shrink-0" />
                                <AnimatePresence>
                                    {!collapsed && (
                                        <motion.span
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.1 }}
                                            className="text-sm font-medium whitespace-nowrap flex-1"
                                        >
                                            {label}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                                {!collapsed && badge && (
                                    <Badge variant="primary" size="sm">{badge}</Badge>
                                )}
                            </motion.div>
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom section */}
            <div className="border-t border-[rgb(var(--border-default))] p-2 space-y-1 shrink-0">
                {/* Help */}
                <button
                    className={cn(
                        'flex items-center gap-3 w-full px-3 py-2.5 rounded-[var(--radius-md)]',
                        'text-[rgb(var(--text-muted))] hover:text-[rgb(var(--text-secondary))] hover:bg-[rgb(var(--bg-muted))]',
                        'transition-colors duration-[var(--transition-fast)] text-sm font-medium',
                    )}
                >
                    <HelpCircle size={18} className="shrink-0" />
                    <AnimatePresence>{!collapsed && (
                        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            Help & Support
                        </motion.span>
                    )}</AnimatePresence>
                </button>

                {/* User */}
                <div
                    onClick={handleLogout}
                    title="Sign out"
                    className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)]',
                    'hover:bg-[rgb(var(--bg-muted))] cursor-pointer transition-colors',
                )}>
                    <Avatar
                        src={user?.avatarUrl}
                        name={user?.name || '?'}
                        size="sm"
                        status="online"
                    />
                    <AnimatePresence>
                        {!collapsed && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex-1 min-w-0"
                            >
                                <p className="text-xs font-semibold text-[rgb(var(--text-primary))] truncate">
                                    {user?.name}
                                </p>
                                <p className="text-xs text-[rgb(var(--text-muted))] truncate">{user?.email}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    {!collapsed && (
                        <LogOut size={15} className="text-[rgb(var(--text-muted))] shrink-0" />
                    )}
                </div>
            </div>

            {/* Toggle collapse button */}
            <button
                onClick={() => setCollapsed((v) => !v)}
                className={cn(
                    'absolute -right-3 top-20 h-6 w-6 rounded-full',
                    'bg-[rgb(var(--bg-surface))] border border-[rgb(var(--border-default))]',
                    'flex items-center justify-center',
                    'text-[rgb(var(--text-muted))] hover:text-[rgb(var(--text-primary))]',
                    'shadow-sm transition-colors z-10',
                )}
                aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
                {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
            </button>
        </motion.aside>
    );
}
