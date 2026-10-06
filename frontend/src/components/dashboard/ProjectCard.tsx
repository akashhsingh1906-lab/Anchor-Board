'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { useProjects } from '@/hooks/useProjects';
import { Badge, statusVariant } from '@/components/ui/Badge';
import { AvatarGroup } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cn';
import { useTeamMembers } from '@/hooks/useTeamMembers';
import type { Project } from '@/types';

interface ProjectCardProps {
    project: Project;
    index?: number;
}

/**
 * ProjectCard — shows project progress, tags, team, due date.
 */
export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
    const { members } = useTeamMembers();
    const teamNames = project.teamIds.map(
        (id) => members.find((m) => m.id === id)?.displayName ?? 'Unknown',
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -3, boxShadow: '0 16px 32px rgb(0 0 0 / 0.1)' }}
        >
        <Link
            href={`/projects/${project.id}`}
            className={cn(
                'block rounded-[var(--radius-lg)] p-5',
                'bg-[rgb(var(--bg-surface))] border border-[rgb(var(--border-default))]',
                'cursor-pointer transition-all duration-200',
                'border-l-4',
            )}
            style={{ borderLeftColor: project.color }}
        >
            {/* Header */}
            <div className="flex items-start justify-between gap-2 mb-3">
                <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-[rgb(var(--text-primary))] text-sm truncate">{project.name}</h3>
                    <p className="text-xs text-[rgb(var(--text-secondary))] mt-0.5 line-clamp-2">{project.description}</p>
                </div>
                <Badge variant={statusVariant(project.status)} size="sm" dot>
                    {project.status}
                </Badge>
            </div>

            {/* Progress bar */}
            <div className="mb-3">
                <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-[rgb(var(--text-muted))]">Progress</span>
                    <span className="font-semibold text-[rgb(var(--text-primary))]">{project.progress}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-[rgb(var(--bg-muted))] overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${project.progress}%` }}
                        transition={{ duration: 0.8, delay: index * 0.05 + 0.2, ease: 'easeOut' }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: project.color }}
                    />
                </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-3">
                {project.tags.map((tag) => (
                    <span
                        key={tag}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-[rgb(var(--bg-muted))] text-[rgb(var(--text-muted))] font-medium"
                    >
                        #{tag}
                    </span>
                ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between">
                <AvatarGroup names={teamNames} max={3} size="xs" />
                <ExternalLink size={14} className="text-[rgb(var(--text-muted))] hover:text-indigo-500 transition-colors" />
            </div>
        </Link>
        </motion.div>
    );
}
