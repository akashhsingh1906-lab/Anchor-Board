'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Plus, LayoutGrid, List, Search } from 'lucide-react';
import { ProjectCard } from '@/components/dashboard/ProjectCard';
import { Badge, statusVariant } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { useProjects } from '@/hooks/useProjects';
import { useTasks } from '@/hooks/useTasks';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { formatDate } from '@/utils/formatters';

type ViewMode = 'grid' | 'list';

export default function ProjectsPage() {
    const router = useRouter();
    const [view, setView] = useState<ViewMode>('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form, setForm] = useState<{ name: string; code: string; description: string; priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' }>(
        { name: '', code: '', description: '', priority: 'MEDIUM' },
    );
    const { projects, isLoading, createProject, isCreating } = useProjects();
    const { tasks } = useTasks();

    // Real progress: percentage of this project's tasks that are done.
    const projectsWithProgress = projects.map((p) => {
        const projectTasks = tasks.filter((t) => t.projectId === p.id);
        const doneCount = projectTasks.filter((t) => t.status === 'done').length;
        const progress = projectTasks.length > 0 ? Math.round((doneCount / projectTasks.length) * 100) : 0;
        return { ...p, progress };
    });

    const filtered = projectsWithProgress.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCreate = () => {
        if (!form.name.trim() || !form.code.trim()) return;
        createProject(
            { name: form.name, code: form.code.toUpperCase(), description: form.description, priority: form.priority },
            { onSuccess: () => { setIsModalOpen(false); setForm({ name: '', code: '', description: '', priority: 'MEDIUM' }); } },
        );
    };

    return (
        <PageWrapper>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-[rgb(var(--text-primary))]">Projects</h1>
                    <p className="text-sm text-[rgb(var(--text-secondary))] mt-0.5">
                        {projects.length} projects total
                    </p>
                </div>
                <Button leftIcon={<Plus size={14} />} onClick={() => setIsModalOpen(true)}>New Project</Button>
            </div>

            {/* Toolbar */}
            <div className="flex items-center gap-3 mb-5">
                <div className="relative flex-1 max-w-xs">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(var(--text-muted))]" />
                    <input
                        type="search"
                        placeholder="Search projects..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-9 pl-9 pr-3 rounded-[var(--radius-md)] text-sm bg-[rgb(var(--bg-muted))] border border-[rgb(var(--border-default))] text-[rgb(var(--text-primary))] placeholder:text-[rgb(var(--text-muted))] focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                    />
                </div>
                <div className="flex items-center gap-1 bg-[rgb(var(--bg-muted))] rounded-[var(--radius-md)] p-1 border border-[rgb(var(--border-default))]">
                    <button
                        onClick={() => setView('grid')}
                        className={`p-1.5 rounded-md transition-colors ${view === 'grid' ? 'bg-[rgb(var(--bg-surface))] text-[rgb(var(--text-primary))] shadow-sm' : 'text-[rgb(var(--text-muted))]'}`}
                        aria-label="Grid view"
                    >
                        <LayoutGrid size={15} />
                    </button>
                    <button
                        onClick={() => setView('list')}
                        className={`p-1.5 rounded-md transition-colors ${view === 'list' ? 'bg-[rgb(var(--bg-surface))] text-[rgb(var(--text-primary))] shadow-sm' : 'text-[rgb(var(--text-muted))]'}`}
                        aria-label="List view"
                    >
                        <List size={15} />
                    </button>
                </div>
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(4)].map((_, i) => <CardSkeleton key={i} />)}
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-16 text-[rgb(var(--text-muted))]">
                    <p className="text-base font-medium">No projects found</p>
                    <p className="text-sm mt-1">Try adjusting your search or create a new project</p>
                </div>
            ) : view === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((project, i) => (
                        <ProjectCard key={project.id} project={project} index={i} />
                    ))}
                </div>
            ) : (
                /* List view */
                <Card padding="none">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[rgb(var(--border-default))]">
                                {['Project', 'Status', 'Progress', 'Due Date', 'Team'].map((h) => (
                                    <th key={h} className="px-4 py-3 text-xs font-semibold text-[rgb(var(--text-secondary))] uppercase tracking-wider text-left first:pl-6 last:pr-6">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[rgb(var(--border-default))]">
                            {filtered.map((project, i) => (
                                <motion.tr
                                    key={project.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: i * 0.04 }}
                                    onClick={() => router.push(`/projects/${project.id}`)}
                                    className="hover:bg-[rgb(var(--bg-muted))] transition-colors cursor-pointer"
                                >
                                    <td className="px-6 py-3.5">
                                        <div className="flex items-center gap-2.5">
                                            <span className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: project.color }} />
                                            <div>
                                                <p className="text-sm font-semibold text-[rgb(var(--text-primary))]">{project.name}</p>
                                                <p className="text-xs text-[rgb(var(--text-muted))] truncate max-w-xs">{project.description}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <Badge variant={statusVariant(project.status)} size="sm" dot>{project.status}</Badge>
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 h-1.5 rounded-full bg-[rgb(var(--bg-muted))] w-20 overflow-hidden">
                                                <div
                                                    className="h-full rounded-full"
                                                    style={{ width: `${project.progress}%`, backgroundColor: project.color }}
                                                />
                                            </div>
                                            <span className="text-xs font-medium text-[rgb(var(--text-secondary))]">{project.progress}%</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3.5 text-sm text-[rgb(var(--text-secondary))]">
                                        {formatDate(project.dueDate)}
                                    </td>
                                    <td className="px-4 pr-6 py-3.5 text-sm text-[rgb(var(--text-secondary))]">
                                        {project.teamIds.length} members
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </Card>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="New Project"
                description="Creates a real project in project-service, indexed by Postgres."
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button isLoading={isCreating} onClick={handleCreate}>Create Project</Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <Input
                        label="Project name"
                        value={form.name}
                        onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                        placeholder="Website Relaunch"
                        required
                    />
                    <Input
                        label="Project code"
                        value={form.code}
                        onChange={(e) => setForm((p) => ({ ...p, code: e.target.value.toUpperCase() }))}
                        placeholder="WEB"
                        hint="Uppercase letters, numbers, underscores only"
                        required
                    />
                    <Input
                        label="Description"
                        value={form.description}
                        onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                        placeholder="What is this project about?"
                    />
                    <div>
                        <p className="text-sm font-medium text-[rgb(var(--text-secondary))] mb-2">Priority</p>
                        <div className="flex gap-2">
                            {(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const).map((p) => (
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
