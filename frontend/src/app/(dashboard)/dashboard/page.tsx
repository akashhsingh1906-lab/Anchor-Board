'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Plus, RefreshCw } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { AnalyticsChart } from '@/components/dashboard/AnalyticsChart';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { StatCardSkeleton } from '@/components/ui/Skeleton';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { useTasks } from '@/hooks/useTasks';
import { useProjects } from '@/hooks/useProjects';
import { useAuth } from '@/hooks/useAuth';
import { mockActivity, mockChartData } from '@/lib/mockData';
import type { StatCardData } from '@/types';
import { cn } from '@/utils/cn';

export default function DashboardPage() {
    const { tasks, tasksByStatus, createTask, isCreatingTask } = useTasks();
    const { activeProjects, projects } = useProjects();
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const router = useRouter();

    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [taskForm, setTaskForm] = useState<{ title: string; priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'; projectId: string }>(
        { title: '', priority: 'MEDIUM', projectId: '' },
    );

    const handleRefresh = () => {
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
        queryClient.invalidateQueries({ queryKey: ['projects'] });
    };

    const handleCreateTask = () => {
        const projectId = taskForm.projectId || projects[0]?.id;
        if (!taskForm.title.trim() || !projectId) return;
        createTask(
            { title: taskForm.title, priority: taskForm.priority, projectId },
            { onSuccess: () => { setIsTaskModalOpen(false); setTaskForm({ title: '', priority: 'MEDIUM', projectId: '' }); } },
        );
    };

    // Real counts derived from project-service data — no fabricated deltas
    // since there's no historical snapshot to diff against yet.
    const stats: StatCardData[] = [
        { id: 's1', label: 'Active Projects', value: activeProjects.length, change: 0, trend: 'neutral', icon: 'FolderOpen', color: 'blue' },
        { id: 's2', label: 'Tasks Completed', value: tasksByStatus.done.length, change: 0, trend: 'neutral', icon: 'CheckCircle', color: 'green' },
        { id: 's3', label: 'In Progress', value: tasksByStatus.in_progress.length, change: 0, trend: 'neutral', icon: 'Users', color: 'purple' },
        { id: 's4', label: 'Open Tasks', value: tasksByStatus.todo.length, change: 0, trend: 'neutral', icon: 'Clock', color: 'orange' },
    ];

    const upNext = [...tasks]
        .filter((t) => t.status !== 'done')
        .sort((a, b) => (a.priority === 'urgent' ? -1 : b.priority === 'urgent' ? 1 : 0))
        .slice(0, 3);

    return (
        <PageWrapper>
            {/* Page header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-[rgb(var(--text-primary))]">Dashboard</h1>
                    <p className="text-sm text-[rgb(var(--text-secondary))] mt-0.5">
                        Good morning, {user?.name?.split(' ')[0] || 'there'}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="secondary" size="sm" leftIcon={<RefreshCw size={14} />} onClick={handleRefresh}>
                        Refresh
                    </Button>
                    <Button size="sm" leftIcon={<Plus size={14} />} onClick={() => setIsTaskModalOpen(true)}>
                        New Task
                    </Button>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                {stats.map((stat, i) => (
                    <StatsCard
                        key={stat.id}
                        stat={stat}
                        index={i}
                        onClick={() => router.push(stat.id === 's1' ? '/projects' : '/tasks')}
                    />
                ))}
            </div>

            {/* Main Content Area: Analytics + Task Summary */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
                {/* Analytics Chart */}
                <Card padding="md" className="xl:col-span-2 overflow-hidden">
                    <CardHeader
                        title="Project Velocity"
                        description="Tasks completed per month across all projects"
                    >
                        <div className="flex items-center gap-2">
                            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                                +12.5%
                            </span>
                        </div>
                    </CardHeader>
                    <div className="mt-4">
                        <AnalyticsChart data={mockChartData} />
                    </div>
                </Card>

                {/* Quick Task Summary / Recent Task */}
                <Card padding="md">
                    <CardHeader title="Up Next" description="Your most urgent tasks today" />
                    <div className="space-y-4">
                        {upNext.length === 0 ? (
                            <p className="text-sm text-[rgb(var(--text-muted))] py-6 text-center">Nothing outstanding — nice work.</p>
                        ) : upNext.map((t, i) => (
                            <motion.div
                                key={t.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 * i }}
                                className="p-3 rounded-lg border border-[rgb(var(--border-default))] bg-[rgb(var(--bg-muted))/30] hover:bg-[rgb(var(--bg-muted))/50] transition-colors cursor-pointer group"
                            >
                                <p className="text-sm font-semibold text-[rgb(var(--text-primary))] group-hover:text-indigo-500 transition-colors">
                                    {t.title}
                                </p>
                                <div className="flex items-center justify-between mt-1">
                                    <span className="text-xs text-[rgb(var(--text-muted))]">{t.status.replace('_', ' ')}</span>
                                    <span className={cn(
                                        'text-[10px] font-bold uppercase px-1.5 py-0.5 rounded',
                                        (t.priority === 'high' || t.priority === 'urgent') ? 'bg-red-500/10 text-red-500' :
                                            t.priority === 'medium' ? 'bg-amber-500/10 text-amber-500' :
                                                'bg-slate-500/10 text-slate-500'
                                    )}>
                                        {t.priority}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Bottom Row — Activity + Quick Stats */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                <Card padding="md" className="xl:col-span-2">
                    <CardHeader title="Recent Activity" description="Latest updates from your team" />
                    <ActivityFeed activities={mockActivity} />
                </Card>

                {/* Quick Info */}
                <Card padding="md">
                    <CardHeader title="Workspace" description={user?.name || ''} />
                    <div className="space-y-3">
                        {[
                            { label: 'Plan', value: user?.plan || 'free' },
                            { label: 'Projects', value: `${activeProjects.length} active` },
                            { label: 'Open Tasks', value: `${tasksByStatus.todo.length + tasksByStatus.in_progress.length}` },
                        ].map(({ label, value }) => (
                            <div key={label} className="flex items-center justify-between py-2 border-b border-[rgb(var(--border-default))] last:border-0">
                                <span className="text-sm text-[rgb(var(--text-secondary))]">{label}</span>
                                <span className="text-sm font-semibold text-[rgb(var(--text-primary))]">{value}</span>
                            </div>
                        ))}
                    </div>
                    <Button variant="outline" size="sm" fullWidth className="mt-4" onClick={() => router.push('/settings')}>
                        Manage Workspace
                    </Button>
                </Card>
            </div>

            <Modal
                isOpen={isTaskModalOpen}
                onClose={() => setIsTaskModalOpen(false)}
                title="New Task"
                description="Creates a real task via project-service."
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setIsTaskModalOpen(false)}>Cancel</Button>
                        <Button
                            isLoading={isCreatingTask}
                            disabled={!taskForm.title.trim() || projects.length === 0}
                            onClick={handleCreateTask}
                        >
                            Create Task
                        </Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <Input
                        label="Task title"
                        value={taskForm.title}
                        onChange={(e) => setTaskForm((f) => ({ ...f, title: e.target.value }))}
                        placeholder="Wire contact form to backend"
                        required
                    />
                    <div>
                        <p className="text-sm font-medium text-[rgb(var(--text-secondary))] mb-2">Project</p>
                        <select
                            value={taskForm.projectId || projects[0]?.id || ''}
                            onChange={(e) => setTaskForm((f) => ({ ...f, projectId: e.target.value }))}
                            className="w-full h-10 px-3 rounded-[var(--radius-md)] text-sm bg-[rgb(var(--bg-muted))] border border-[rgb(var(--border-default))] text-[rgb(var(--text-primary))]"
                        >
                            {projects.length === 0 && <option value="">No projects yet — create one first</option>}
                            {projects.map((p) => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-[rgb(var(--text-secondary))] mb-2">Priority</p>
                        <div className="flex gap-2">
                            {(['LOW', 'MEDIUM', 'HIGH', 'URGENT'] as const).map((p) => (
                                <button
                                    key={p}
                                    type="button"
                                    onClick={() => setTaskForm((f) => ({ ...f, priority: p }))}
                                    className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition-colors ${taskForm.priority === p
                                        ? 'border-indigo-500 bg-indigo-500/10 text-indigo-500'
                                        : 'border-[rgb(var(--border-default))] text-[rgb(var(--text-secondary))]'
                                        }`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </Modal>
        </PageWrapper>
    );
}
