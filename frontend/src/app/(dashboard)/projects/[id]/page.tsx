'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronLeft, ChevronRight, Clock, Plus, User } from 'lucide-react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card, CardHeader } from '@/components/ui/Card';
import { Badge, priorityVariant, statusVariant } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Avatar } from '@/components/ui/Avatar';
import { useProjects } from '@/hooks/useProjects';
import { useTasks } from '@/hooks/useTasks';
import { useTeamMembers } from '@/hooks/useTeamMembers';
import { formatDate } from '@/utils/formatters';
import { cn } from '@/utils/cn';
import type { Task, TaskStatus } from '@/types';

const columnConfig: Record<TaskStatus, { label: string; color: string; dotColor: string }> = {
    todo: { label: 'To Do', color: 'border-t-slate-400', dotColor: 'bg-slate-400' },
    in_progress: { label: 'In Progress', color: 'border-t-blue-500', dotColor: 'bg-blue-500' },
    review: { label: 'Review', color: 'border-t-amber-500', dotColor: 'bg-amber-500' },
    done: { label: 'Done', color: 'border-t-emerald-500', dotColor: 'bg-emerald-500' },
};
const statuses: TaskStatus[] = ['todo', 'in_progress', 'review', 'done'];

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { projects, isLoading: projectsLoading } = useProjects();
    const { tasks, updateStatus, createTask, isCreatingTask, assignTask } = useTasks();
    const { members } = useTeamMembers();

    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [taskForm, setTaskForm] = useState<{ title: string; priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' }>({ title: '', priority: 'MEDIUM' });

    const project = projects.find((p) => p.id === id);
    const projectTasks = tasks.filter((t) => t.projectId === id);
    const tasksByStatus = {
        todo: projectTasks.filter((t) => t.status === 'todo'),
        in_progress: projectTasks.filter((t) => t.status === 'in_progress'),
        review: projectTasks.filter((t) => t.status === 'review'),
        done: projectTasks.filter((t) => t.status === 'done'),
    };

    const handleCreateTask = () => {
        if (!taskForm.title.trim()) return;
        createTask(
            { title: taskForm.title, priority: taskForm.priority, projectId: id },
            { onSuccess: () => { setIsTaskModalOpen(false); setTaskForm({ title: '', priority: 'MEDIUM' }); } },
        );
    };

    if (projectsLoading) {
        return <PageWrapper><div className="h-64 rounded-xl skeleton" /></PageWrapper>;
    }

    if (!project) {
        return (
            <PageWrapper>
                <Link href="/projects" className="inline-flex items-center gap-1.5 text-sm text-indigo-500 hover:text-indigo-400 mb-4">
                    <ArrowLeft size={14} /> Back to projects
                </Link>
                <p className="text-[rgb(var(--text-secondary))]">Project not found.</p>
            </PageWrapper>
        );
    }

    return (
        <PageWrapper>
            <Link href="/projects" className="inline-flex items-center gap-1.5 text-sm text-indigo-500 hover:text-indigo-400 mb-4">
                <ArrowLeft size={14} /> Back to projects
            </Link>

            <div className="flex items-start justify-between mb-6">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <span className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: project.color }} />
                        <h1 className="text-2xl font-bold text-[rgb(var(--text-primary))]">{project.name}</h1>
                        <Badge variant={statusVariant(project.status)} size="sm">{project.status}</Badge>
                    </div>
                    <p className="text-sm text-[rgb(var(--text-secondary))]">{project.description}</p>
                </div>
                <Button leftIcon={<Plus size={14} />} onClick={() => setIsTaskModalOpen(true)}>New Task</Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <Card padding="sm">
                    <p className="text-xs text-[rgb(var(--text-muted))] mb-1">Progress</p>
                    <p className="text-xl font-bold text-[rgb(var(--text-primary))]">
                        {projectTasks.length > 0 ? Math.round((tasksByStatus.done.length / projectTasks.length) * 100) : 0}%
                    </p>
                </Card>
                <Card padding="sm">
                    <p className="text-xs text-[rgb(var(--text-muted))] mb-1">Total tasks</p>
                    <p className="text-xl font-bold text-[rgb(var(--text-primary))]">{projectTasks.length}</p>
                </Card>
                <Card padding="sm">
                    <p className="text-xs text-[rgb(var(--text-muted))] mb-1">Due date</p>
                    <p className="text-xl font-bold text-[rgb(var(--text-primary))]">{formatDate(project.dueDate)}</p>
                </Card>
            </div>

            <Card padding="md">
                <CardHeader title="Task Board" description="Tasks in this project only" />
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    {statuses.map((status) => {
                        const cfg = columnConfig[status];
                        const colTasks = tasksByStatus[status];
                        return (
                            <div
                                key={status}
                                className={cn(
                                    'rounded-[var(--radius-lg)] border border-[rgb(var(--border-default))] border-t-2',
                                    'bg-[rgb(var(--bg-muted))/30] p-3 min-h-[300px]',
                                    cfg.color,
                                )}
                            >
                                <div className="flex items-center justify-between mb-4 px-1">
                                    <div className="flex items-center gap-2">
                                        <span className={cn('h-2 w-2 rounded-full', cfg.dotColor)} />
                                        <h3 className="text-[11px] font-bold text-[rgb(var(--text-secondary))] uppercase tracking-widest">{cfg.label}</h3>
                                    </div>
                                    <span className="text-[10px] font-black text-[rgb(var(--text-muted))] bg-[rgb(var(--bg-subtle))] px-2 py-0.5 rounded-full">
                                        {colTasks.length}
                                    </span>
                                </div>
                                <div className="space-y-3">
                                    <AnimatePresence mode="popLayout" initial={false}>
                                        {colTasks.map((task) => (
                                            <ProjectTaskCard
                                                key={task.id}
                                                task={task}
                                                members={members}
                                                onMove={(newStatus) => updateStatus({ id: task.id, status: newStatus })}
                                                onAssign={(assigneeId) => assignTask({ id: task.id, assigneeId })}
                                            />
                                        ))}
                                    </AnimatePresence>
                                    {colTasks.length === 0 && (
                                        <div className="text-center py-8 border-2 border-dashed border-[rgb(var(--border-default))] rounded-xl text-[rgb(var(--text-muted))]">
                                            <p className="text-xs font-medium">Empty</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Card>

            <Modal
                isOpen={isTaskModalOpen}
                onClose={() => setIsTaskModalOpen(false)}
                title={`New Task in ${project.name}`}
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setIsTaskModalOpen(false)}>Cancel</Button>
                        <Button isLoading={isCreatingTask} disabled={!taskForm.title.trim()} onClick={handleCreateTask}>Create Task</Button>
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

interface ProjectTaskCardProps {
    task: Task;
    members: { id: string; displayName: string }[];
    onMove: (status: TaskStatus) => void;
    onAssign: (assigneeId: string) => void;
}

function ProjectTaskCard({ task, members, onMove, onAssign }: ProjectTaskCardProps) {
    const currentIndex = statuses.indexOf(task.status);
    const assignee = members.find((m) => m.id === task.assigneeId);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="group relative rounded-[var(--radius-md)] p-3.5 bg-[rgb(var(--bg-surface))] border border-[rgb(var(--border-default))] hover:border-indigo-400 theme-transition"
        >
            <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {currentIndex > 0 && (
                    <button onClick={() => onMove(statuses[currentIndex - 1])} className="p-1 rounded-md hover:bg-[rgb(var(--bg-muted))] text-[rgb(var(--text-muted))]" title="Move Left">
                        <ChevronLeft size={14} />
                    </button>
                )}
                {currentIndex < statuses.length - 1 && (
                    <button onClick={() => onMove(statuses[currentIndex + 1])} className="p-1 rounded-md hover:bg-[rgb(var(--bg-muted))] text-[rgb(var(--text-muted))]" title="Move Right">
                        <ChevronRight size={14} />
                    </button>
                )}
            </div>

            <Badge variant={priorityVariant(task.priority)} size="sm">{task.priority}</Badge>
            <h4 className="text-sm font-medium text-[rgb(var(--text-primary))] leading-snug mt-2 mb-2.5">{task.title}</h4>

            <div className="flex items-center justify-between gap-2">
                <select
                    value={task.assigneeId || ''}
                    onChange={(e) => e.target.value && onAssign(e.target.value)}
                    className="text-[11px] bg-transparent border border-[rgb(var(--border-default))] rounded-md px-1.5 py-1 text-[rgb(var(--text-secondary))] max-w-[120px]"
                    title="Assign to"
                >
                    <option value="">Unassigned</option>
                    {members.map((m) => (
                        <option key={m.id} value={m.id}>{m.displayName}</option>
                    ))}
                </select>
                {task.dueDate && (
                    <div className="flex items-center gap-1 text-[10px] text-[rgb(var(--text-muted))] shrink-0">
                        <Clock size={11} />
                        <span>{formatDate(task.dueDate)}</span>
                    </div>
                )}
            </div>
            {assignee && (
                <div className="flex items-center gap-1.5 mt-2 text-[10px] text-[rgb(var(--text-muted))]">
                    <User size={10} /> {assignee.displayName}
                </div>
            )}
        </motion.div>
    );
}
