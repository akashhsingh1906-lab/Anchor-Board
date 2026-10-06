'use client';

import { useState, useCallback, useEffect } from 'react';
import type { User, LoginCredentials, SignupCredentials } from '@/types';
import { authClient } from '@/lib/axios';

interface AuthApiUser {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    displayName: string;
    role: 'USER' | 'PROJECT_MANAGER' | 'ADMIN' | 'SUPER_ADMIN';
    tenantId: number;
}

interface AuthApiResponse {
    accessToken: string;
    refreshToken: string;
    user: AuthApiUser;
}

function mapRole(role: AuthApiUser['role']): User['role'] {
    if (role === 'ADMIN' || role === 'SUPER_ADMIN') return 'admin';
    if (role === 'PROJECT_MANAGER') return 'owner';
    return 'member';
}

function toUser(apiUser: AuthApiUser): User {
    return {
        id: apiUser.id,
        name: apiUser.displayName || `${apiUser.firstName} ${apiUser.lastName}`,
        email: apiUser.email,
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(apiUser.email)}`,
        role: mapRole(apiUser.role),
        createdAt: new Date().toISOString(),
        plan: 'pro',
    };
}

function persistSession(data: AuthApiResponse) {
    localStorage.setItem('auth_token', data.accessToken);
    localStorage.setItem('refresh_token', data.refreshToken);
    localStorage.setItem('tenant_id', String(data.user.tenantId));
    localStorage.setItem('current_user', JSON.stringify(toUser(data.user)));
}

/**
 * useAuth — real authentication against auth-service (POST /api/auth/login,
 * POST /api/auth/register). Tokens are stored in localStorage and attached
 * to every request by the axios client interceptor.
 */
export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem('current_user');
        const token = localStorage.getItem('auth_token');
        if (stored && token) {
            setUser(JSON.parse(stored));
        }
        setIsLoading(false);
    }, []);

    const login = useCallback(async (credentials: LoginCredentials) => {
        setIsLoading(true);
        try {
            const { data } = await authClient.post<AuthApiResponse>('/auth/login', {
                email: credentials.email,
                password: credentials.password,
            });
            persistSession(data);
            setUser(toUser(data.user));
            return { success: true };
        } catch (error: any) {
            return {
                success: false,
                error: error?.response?.data?.error || 'Invalid email or password',
            };
        } finally {
            setIsLoading(false);
        }
    }, []);

    const signup = useCallback(async (credentials: SignupCredentials) => {
        setIsLoading(true);
        try {
            const [firstName, ...rest] = credentials.name.trim().split(' ');
            const { data } = await authClient.post<AuthApiResponse>('/auth/register', {
                email: credentials.email,
                password: credentials.password,
                firstName: firstName || credentials.name,
                lastName: rest.join(' ') || '-',
            });
            persistSession(data);
            setUser(toUser(data.user));
            return { success: true };
        } catch (error: any) {
            return {
                success: false,
                error: error?.response?.data?.error || 'Could not create account',
            };
        } finally {
            setIsLoading(false);
        }
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('tenant_id');
        localStorage.removeItem('current_user');
        setUser(null);
    }, []);

    return {
        user,
        isLoading,
        isAuthenticated: user !== null,
        login,
        signup,
        logout,
    };
}
