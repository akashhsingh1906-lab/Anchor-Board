'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { projectClient } from '@/lib/axios';
import type { Project, ProjectStatus } from '@/types';

interface ApiProject {
    id: string;
    name: string;
    description: string;
    status: string;
    priority: string;
    startDate?: string;
    endDate?: string;
    createdAt: string;
}

const STATUS_MAP: Record<string, ProjectStatus> = {
    PLANNING: 'active',
    ACTIVE: 'active',
    IN_PROGRESS: 'active',
    ON_HOLD: 'paused',
    COMPLETED: 'completed',
    CANCELLED: 'archived',
    ARCHIVED: 'archived',
};

const PROJECT_COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];

function toProject(apiProject: ApiProject, index: number): Project {
    return {
        id: apiProject.id,
        name: apiProject.name,
        description: apiProject.description || '',
        status: STATUS_MAP[apiProject.status] || 'active',
        progress: 0,
        ownerId: '',
        teamIds: [],
        dueDate: apiProject.endDate || apiProject.createdAt,
        createdAt: apiProject.createdAt,
        tags: [],
        color: PROJECT_COLORS[index % PROJECT_COLORS.length],
    };
}

async function fetchProjects(): Promise<Project[]> {
    const { data } = await projectClient.get<{ content: ApiProject[] }>('/projects', {
        params: { size: 100, sort: 'createdAt', direction: 'desc' },
    });
    return data.content.map(toProject);
}

interface CreateProjectInput {
    name: string;
    description?: string;
    code: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

/**
 * useProjects — React Query hook backed by project-service (GET/POST /api/projects).
 */
export function useProjects() {
    const qc = useQueryClient();

    const { data: projects = [], isLoading, error } = useQuery({
        queryKey: ['projects'],
        queryFn: fetchProjects,
    });

    const createProject = useMutation({
        mutationFn: async (input: CreateProjectInput) => {
            const { data } = await projectClient.post<ApiProject>('/projects', input);
            return data;
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] }),
    });

    const activeProjects = projects.filter((p) => p.status === 'active');
    const completedProjects = projects.filter((p) => p.status === 'completed');

    return {
        projects,
        activeProjects,
        completedProjects,
        isLoading,
        error,
        createProject: createProject.mutate,
        isCreating: createProject.isPending,
    };
}
