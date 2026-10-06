'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authClient } from '@/lib/axios';
import { useToast } from '@/providers/ToastProvider';

export interface Profile {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    jobTitle: string | null;
    avatarUrl: string | null;
    role: string;
}

async function fetchProfile(): Promise<Profile> {
    const { data } = await authClient.get<Profile>('/users/me');
    return data;
}

/**
 * useProfile — real profile read/update + password change against
 * auth-service (GET/PUT /api/users/me, PUT /api/users/me/password).
 */
export function useProfile() {
    const qc = useQueryClient();
    const { showToast } = useToast();

    const { data: profile, isLoading } = useQuery({
        queryKey: ['profile'],
        queryFn: fetchProfile,
    });

    const updateProfile = useMutation({
        mutationFn: async (input: Partial<Pick<Profile, 'firstName' | 'lastName' | 'jobTitle' | 'avatarUrl'>>) => {
            const { data } = await authClient.put<Profile>('/users/me', input);
            return data;
        },
        onSuccess: (data) => {
            qc.setQueryData(['profile'], data);
            showToast('Profile updated', 'success');
        },
        onError: () => showToast('Could not update profile', 'error'),
    });

    const changePassword = useMutation({
        mutationFn: async (input: { currentPassword: string; newPassword: string }) => {
            await authClient.put('/users/me/password', input);
        },
        onSuccess: () => showToast('Password updated', 'success'),
        onError: (err: any) => showToast(err?.response?.data?.error || 'Could not update password', 'error'),
    });

    return {
        profile,
        isLoading,
        updateProfile: updateProfile.mutate,
        isUpdatingProfile: updateProfile.isPending,
        changePassword: changePassword.mutate,
        isChangingPassword: changePassword.isPending,
    };
}
