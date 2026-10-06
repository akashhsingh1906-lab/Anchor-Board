import type { ReactNode } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { AuthGuard } from '@/components/layout/AuthGuard';

/**
 * Dashboard layout — sidebar + topbar shell.
 * All dashboard sub-pages render inside the main content area.
 */
export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <AuthGuard>
        <div className="min-h-screen bg-[rgb(var(--bg-base))]">
            <Sidebar />
            <TopBar />
            {/* Main content — offset for sidebar (256px) and topbar (64px) */}
            <main className="pl-64 pt-16 transition-all duration-300">
                <div className="p-6 min-h-[calc(100vh-64px)]">
                    {children}
                </div>
                <footer className="border-t border-[rgb(var(--border-default))] py-4 px-6 text-center">
                    <p className="text-xs text-[rgb(var(--text-muted))]">
                        Rayen Lassoued |{' '}
                        <a href="https://github.com/Hamilas" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400 transition-colors">github.com/Hamilas</a>
                        {' '}|{' '}
                        <a href="https://www.linkedin.com/in/lassoued-rayen/" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400 transition-colors">https://www.linkedin.com/in/lassoued-rayen/</a>
                    </p>
                </footer>
            </main>
        </div>
        </AuthGuard>
    );
}
