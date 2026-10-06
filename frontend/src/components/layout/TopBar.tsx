'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Search, ChevronDown, Settings, LogOut, User, CreditCard } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Dropdown } from '@/components/ui/Dropdown';
import { useAuth } from '@/hooks/useAuth';
import { NotificationCenter } from './NotificationCenter';

/**
 * TopBar — fixed top navigation with search, notifications, user menu.
 */
export function TopBar() {
    const [searchOpen, setSearchOpen] = useState(false);
    const { user, logout } = useAuth();
    const router = useRouter();

    const userMenuItems = [
        { label: 'Your Profile', icon: <User size={14} />, onClick: () => router.push('/settings') },
        { label: 'Billing', icon: <CreditCard size={14} />, onClick: () => router.push('/settings') },
        { label: 'Settings', icon: <Settings size={14} />, onClick: () => router.push('/settings') },
        { divider: true },
        {
            label: 'Sign out', icon: <LogOut size={14} />, onClick: () => {
                logout();
                router.push('/login');
            }, danger: true
        },
    ];

    return (
        <header className="fixed top-0 right-0 left-0 z-20 h-16 flex items-center justify-between px-6 gap-4 bg-[rgb(var(--bg-surface))]/80 backdrop-blur-md border-b border-[rgb(var(--border-default))]">
            {/* Left — Search */}
            <div className="flex items-center gap-3 flex-1 max-w-sm ml-64">
                <motion.div
                    animate={{ width: searchOpen ? 280 : 200 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="relative"
                >
                    <Search
                        size={15}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(var(--text-muted))]"
                    />
                    <input
                        type="search"
                        placeholder="Search..."
                        onFocus={() => setSearchOpen(true)}
                        onBlur={() => setSearchOpen(false)}
                        className="w-full h-9 pl-9 pr-3 rounded-[var(--radius-md)] text-sm bg-[rgb(var(--bg-muted))] border border-[rgb(var(--border-default))] text-[rgb(var(--text-primary))] placeholder:text-[rgb(var(--text-muted))] focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    />
                </motion.div>
            </div>

            {/* Right — Actions */}
            <div className="flex items-center gap-2 shrink-0">
                {/* Theme toggle */}
                <ThemeToggle />

                {/* Notifications */}
                <NotificationCenter />

                {/* User menu */}
                <Dropdown
                    trigger={
                        <div className="flex items-center gap-2.5 h-9 pl-1 pr-2 rounded-[var(--radius-md)] hover:bg-[rgb(var(--bg-muted))] transition-colors cursor-pointer">
                            <Avatar
                                src={user?.avatarUrl}
                                name={user?.name || '?'}
                                size="sm"
                                status="online"
                            />
                            <div className="hidden md:block text-left">
                                <p className="text-xs font-semibold text-[rgb(var(--text-primary))] leading-none">{user?.name}</p>
                                <p className="text-[10px] text-[rgb(var(--text-muted))] leading-none mt-0.5">
                                    {user?.plan} plan
                                </p>
                            </div>
                            <ChevronDown size={13} className="text-[rgb(var(--text-muted))]" />
                        </div>
                    }
                    items={userMenuItems}
                    align="right"
                />
            </div>
        </header>
    );
}
