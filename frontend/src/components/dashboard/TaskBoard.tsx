'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Flag, Clock, User } from 'lucide-react';
import { Badge, priorityVariant, statusVariant } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { cn } from '@/utils/cn';
import { formatDate } from '@/utils/formatters';
import { useTasks } from '@/hooks/useTasks';
import { useTeamMembers } from '@/hooks/useTeamMembers';
import { ChevronRight, ChevronLeft, MoreVertical } from 'lucide-react';
import type { Task, TaskStatus } from '@/types';

const columnConfig: Record<TaskStatus, { label: string; color: string; dotColor: string }> = {
    todo: { label: 'To Do', color: 'border-t-slate-400', dotColor: 'bg-slate-400' },
    in_progress: { label: 'In Progress', color: 'border-t-blue-500', dotColor: 'bg-blue-500' },
    review: { label: 'Review', color: 'border-t-amber-500', dotColor: 'bg-amber-500' },
    done: { label: 'Done', color: 'border-t-emerald-500', dotColor: 'bg-emerald-500' },
};

interface TaskCardProps {
    task: Task;
    index: number;
    onMove?: (id: string, status: TaskStatus) => void;
}

function TaskCard({ task, index, onMove }: TaskCardProps) {
    const { members } = useTeamMembers();
    const assignee = members.find((m) => m.id === task.assigneeId);
    const statuses: TaskStatus[] = ['todo', 'in_progress', 'review', 'done'];
    const currentIndex = statuses.indexOf(task.status);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            whileHover={{ y: -2, boxShadow: '0 8px 24px rgb(0 0 0 / 0.12)' }}
            className={cn(
                'group relative rounded-[var(--radius-md)] p-3.5 cursor-pointer',
                'bg-[rgb(var(--bg-surface))] border border-[rgb(var(--border-default))]',
                'hover:border-indigo-400 theme-transition',
            )}
        >
            {/* Action buttons (revealed on hover) */}
            <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {currentIndex > 0 && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onMove?.(task.id, statuses[currentIndex - 1]); }}
                        className="p-1 rounded-md hover:bg-[rgb(var(--bg-muted))] text-[rgb(var(--text-muted))] hover:text-[rgb(var(--text-primary))]"
                        title="Move Left"
                    >
                        <ChevronLeft size={14} />
                    </button>
                )}
                {currentIndex < statuses.length - 1 && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onMove?.(task.id, statuses[currentIndex + 1]); }}
                        className="p-1 rounded-md hover:bg-[rgb(var(--bg-muted))] text-[rgb(var(--text-muted))] hover:text-[rgb(var(--text-primary))]"
                        title="Move Right"
                    >
                        <ChevronRight size={14} />
                    </button>
                )}
            </div>
            {/* Priority & Status */}
            <div className="flex items-center gap-2 mb-2">
                <Badge variant={priorityVariant(task.priority)} size="sm">
                    {task.priority}
                </Badge>
                {task.tags.slice(0, 1).map((tag) => (
                    <Badge key={tag} variant="default" size="sm">{tag}</Badge>
                ))}
            </div>

            <h4 className="text-sm font-medium text-[rgb(var(--text-primary))] leading-snug mb-2.5">
                {task.title}
            </h4>

            {/* Footer */}
            <div className="flex items-center justify-between">
                {assignee ? (
                    <Avatar name={assignee.displayName} size="xs" />
                ) : (
                    <User size={14} className="text-[rgb(var(--text-muted))]" />
                )}
                {task.dueDate && (
                    <div className="flex items-center gap-1 text-[10px] text-[rgb(var(--text-muted))]">
                        <Clock size={11} />
                        <span>{formatDate(task.dueDate)}</span>
                    </div>
                )}
            </div>
        </motion.div>
    );
}

interface TaskBoardProps {
    tasksByStatus: Record<TaskStatus, Task[]>;
}

/**
 * TaskBoard — Kanban-style board with 4 columns.
 * Each column has animated task cards.
 */
export function TaskBoard({ tasksByStatus }: TaskBoardProps) {
    const { updateStatus } = useTasks();
    const statuses: TaskStatus[] = ['todo', 'in_progress', 'review', 'done'];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {statuses.map((status) => {
                const cfg = columnConfig[status];
                const tasks = tasksByStatus[status] ?? [];
                return (
                    <div
                        key={status}
                        className={cn(
                            'rounded-[var(--radius-lg)] border border-[rgb(var(--border-default))] border-t-2',
                            'bg-[rgb(var(--bg-muted))/30] p-3 min-h-[400px]',
                            cfg.color,
                        )}
                    >
                        {/* Column header */}
                        <div className="flex items-center justify-between mb-4 px-1">
                            <div className="flex items-center gap-2">
                                <span className={cn('h-2 w-2 rounded-full', cfg.dotColor)} />
                                <h3 className="text-[11px] font-bold text-[rgb(var(--text-secondary))] uppercase tracking-widest">
                                    {cfg.label}
                                </h3>
                            </div>
                            <span className="text-[10px] font-black text-[rgb(var(--text-muted))] bg-[rgb(var(--bg-subtle))] px-2 py-0.5 rounded-full">
                                {tasks.length}
                            </span>
                        </div>

                        {/* Cards */}
                        <div className="space-y-3">
                            <AnimatePresence mode="popLayout" initial={false}>
                                {tasks.map((task, i) => (
                                    <TaskCard
                                        key={task.id}
                                        task={task}
                                        index={i}
                                        onMove={(id, status) => updateStatus({ id, status })}
                                    />
                                ))}
                            </AnimatePresence>
                            {tasks.length === 0 && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center py-12 border-2 border-dashed border-[rgb(var(--border-default))] rounded-xl text-[rgb(var(--text-muted))]"
                                >
                                    <p className="text-xs font-medium">Empty column</p>
                                </motion.div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
