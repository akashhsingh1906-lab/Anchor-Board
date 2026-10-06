import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
    title: {
        template: '%s | AnchorBoard Auth',
        default: 'Sign in',
    },
};

/**
 * Auth layout — centered, full-screen with gradient background.
 * No sidebar or topbar — clean focus on the auth form.
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="auth-bg min-h-screen flex items-center justify-center p-4">
            {children}
        </div>
    );
}
