'use client';

import { useQuery } from '@tanstack/react-query';
import { authClient } from '@/lib/axios';

export interface TeamMemberSummary {
    id: string;
    displayName: string;
    email: string;
    role: string;
}

async function fetchTeamMembers(): Promise<TeamMemberSummary[]> {
    const { data } = await authClient.get<TeamMemberSummary[]>('/users');
    return data;
}

/**
 * useTeamMembers — real tenant user directory (GET /api/users on
 * auth-service), used for assigning tasks to a real teammate instead of
 * only ever the current user.
 */
export function useTeamMembers() {
    const { data: members = [], isLoading } = useQuery({
        queryKey: ['team-members'],
        queryFn: fetchTeamMembers,
    });

    return { members, isLoading };
}
