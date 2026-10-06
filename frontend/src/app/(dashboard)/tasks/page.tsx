'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { TaskBoard } from '@/components/dashboard/TaskBoard';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useTasks } from '@/hooks/useTasks';
import { useProjects } from '@/hooks/useProjects';

export default function TasksPage() {
    const { tasksByStatus, isLoading, createTask, isCreatingTask } = useTasks();
    const { projects } = useProjects();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form, setForm] = useState<{ title: string; priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'; projectId: string }>(
        { title: '', priority: 'MEDIUM', projectId: '' },
    );

    const handleCreate = () => {
        const projectId = form.projectId || projects[0]?.id;
        if (!form.title.trim() || !projectId) return;
        createTask(
            { title: form.title, priority: form.priority, projectId },
            { onSuccess: () => { setIsModalOpen(false); setForm({ title: '', priority: 'MEDIUM', projectId: '' }); } },
        );
    };

    return (
        <PageWrapper>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-[rgb(var(--text-primary))]">Task Board</h1>
                    <p className="text-sm text-[rgb(var(--text-secondary))] mt-0.5">
                        Every task across every project
                    </p>
                </div>
                <Button leftIcon={<Plus size={14} />} onClick={() => setIsModalOpen(true)}>New Task</Button>
            </div>

            <Card padding="md">
                <CardHeader title="All Tasks" description="Drag priority aside — use the arrows on a card to move it between columns" />
                {isLoading ? (
                    <div className="grid grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-64 rounded-[var(--radius-lg)] skeleton" />
                        ))}
                    </div>
                ) : (
                    <TaskBoard tasksByStatus={tasksByStatus} />
                )}
            </Card>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="New Task"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button isLoading={isCreatingTask} disabled={!form.title.trim() || projects.length === 0} onClick={handleCreate}>Create Task</Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <Input
                        label="Task title"
                        value={form.title}
                        onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                        placeholder="Wire contact form to backend"
                        required
                    />
                    <div>
                        <p className="text-sm font-medium text-[rgb(var(--text-secondary))] mb-2">Project</p>
                        <select
                            value={form.projectId || projects[0]?.id || ''}
                            onChange={(e) => setForm((f) => ({ ...f, projectId: e.target.value }))}
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
                                    onClick={() => setForm((f) => ({ ...f, priority: p }))}
                                    className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition-colors ${form.priority === p
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
