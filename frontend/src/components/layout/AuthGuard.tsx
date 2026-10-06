'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';

/**
 * AuthGuard — redirects to /login when there is no stored access token.
 * Dashboard routes are otherwise reachable directly by URL with no session.
 */
export function AuthGuard({ children }: { children: ReactNode }) {
    const router = useRouter();
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        if (!token) {
            router.replace('/login');
            return;
        }
        setChecked(true);
    }, [router]);

    if (!checked) {
        return null;
    }

    return <>{children}</>;
}
