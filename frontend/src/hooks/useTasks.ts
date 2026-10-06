'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { projectClient } from '@/lib/axios';
import type { Task, TaskStatus } from '@/types';
import { useToast } from '@/providers/ToastProvider';

const TASKS_KEY = ['tasks'];

interface ApiTask {
    id: string;
    title: string;
    description?: string;
    status: string;
    priority: string;
    projectId: string;
    assignedToId?: string;
    dueDate?: string;
    createdAt: string;
    estimatedHours?: number;
}

const STATUS_TO_UI: Record<string, TaskStatus> = {
    TODO: 'todo',
    IN_PROGRESS: 'in_progress',
    IN_REVIEW: 'review',
    TESTING: 'review',
    DONE: 'done',
    ARCHIVED: 'done',
    CANCELLED: 'todo',
    BLOCKED: 'in_progress',
};

const STATUS_TO_API: Record<TaskStatus, string> = {
    todo: 'TODO',
    in_progress: 'IN_PROGRESS',
    review: 'IN_REVIEW',
    done: 'DONE',
};

const PRIORITY_TO_UI: Record<string, Task['priority']> = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    URGENT: 'urgent',
};

function toTask(apiTask: ApiTask): Task {
    return {
        id: apiTask.id,
        title: apiTask.title,
        description: apiTask.description,
        status: STATUS_TO_UI[apiTask.status] || 'todo',
        priority: PRIORITY_TO_UI[apiTask.priority] || 'medium',
        projectId: apiTask.projectId,
        assigneeId: apiTask.assignedToId,
        dueDate: apiTask.dueDate,
        createdAt: apiTask.createdAt,
        tags: [],
        estimatedHours: apiTask.estimatedHours,
    };
}

async function fetchTasks(): Promise<Task[]> {
    const { data } = await projectClient.get<{ content: ApiTask[] }>('/tasks', {
        params: { size: 200, sort: 'createdAt', direction: 'desc' },
    });
    return data.content.map(toTask);
}

/**
 * useTasks — React Query hook backed by project-service
 * (GET /api/tasks, PATCH /api/tasks/{id}/status).
 */
export function useTasks() {
    const qc = useQueryClient();
    const { showToast } = useToast();

    const { data: tasks = [], isLoading, error } = useQuery({
        queryKey: TASKS_KEY,
        queryFn: fetchTasks,
    });

    const updateStatusMutation = useMutation({
        mutationFn: async ({ id, status }: { id: string; status: TaskStatus }) => {
            await projectClient.patch(`/tasks/${id}/status`, STATUS_TO_API[status]);
            return { id, status };
        },
        onMutate: async ({ id, status }) => {
            await qc.cancelQueries({ queryKey: TASKS_KEY });
            const previous = qc.getQueryData<Task[]>(TASKS_KEY);
            qc.setQueryData<Task[]>(TASKS_KEY, (old) =>
                (old ?? []).map((t) => (t.id === id ? { ...t, status } : t)),
            );
            return { previous };
        },
        onError: (_err, _vars, context) => {
            if (context?.previous) {
                qc.setQueryData(TASKS_KEY, context.previous);
            }
            showToast('That status change is not allowed for this task', 'error');
        },
    });

    const createTaskMutation = useMutation({
        mutationFn: async (input: { title: string; description?: string; priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'; projectId: string; assignedToId?: string }) => {
            const { data } = await projectClient.post<ApiTask>('/tasks', input);
            return data;
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: TASKS_KEY }),
        onError: () => showToast('Could not create task', 'error'),
    });

    const assignTaskMutation = useMutation({
        mutationFn: async ({ id, assigneeId }: { id: string; assigneeId: string }) => {
            await projectClient.patch(`/tasks/${id}/assign`, assigneeId);
            return { id, assigneeId };
        },
        onSuccess: ({ id, assigneeId }) => {
            qc.setQueryData<Task[]>(TASKS_KEY, (old) =>
                (old ?? []).map((t) => (t.id === id ? { ...t, assigneeId } : t)),
            );
        },
        onError: () => showToast('Could not assign task — only project managers and admins can assign tasks', 'error'),
    });

    const tasksByStatus = {
        todo: tasks.filter((t) => t.status === 'todo'),
        in_progress: tasks.filter((t) => t.status === 'in_progress'),
        review: tasks.filter((t) => t.status === 'review'),
        done: tasks.filter((t) => t.status === 'done'),
    };

    return {
        tasks,
        tasksByStatus,
        isLoading,
        error,
        updateStatus: updateStatusMutation.mutate,
        createTask: createTaskMutation.mutate,
        isCreatingTask: createTaskMutation.isPending,
        assignTask: assignTaskMutation.mutate,
    };
}
