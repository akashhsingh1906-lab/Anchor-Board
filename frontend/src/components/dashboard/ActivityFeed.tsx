'use client';

import { motion } from 'framer-motion';
import { Activity } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { timeAgo } from '@/utils/formatters';
import { cn } from '@/utils/cn';

const activityColors: Record<string, string> = {
    task_created: 'bg-blue-500',
    task_completed: 'bg-emerald-500',
    project_created: 'bg-violet-500',
    member_joined: 'bg-amber-500',
    comment_added: 'bg-indigo-500',
    file_uploaded: 'bg-pink-500',
};

interface ActivityFeedProps {
    activities: Activity[];
    maxItems?: number;
}

/**
 * ActivityFeed — vertical timeline of recent workspace activity.
 */
export function ActivityFeed({ activities, maxItems = 5 }: ActivityFeedProps) {
    const visibleActivities = activities.slice(0, maxItems);

    return (
        <div className="space-y-0">
            {visibleActivities.map((activity, i) => (
                <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex gap-3 relative group"
                >
                    {/* Timeline line */}
                    {i < visibleActivities.length - 1 && (
                        <div className="absolute left-[17px] top-10 bottom-0 w-px bg-[rgb(var(--border-default))] group-last:hidden" />
                    )}

                    {/* Avatar with colored dot */}
                    <div className="relative shrink-0 pt-3">
                        <Avatar
                            src={activity.userAvatar}
                            name={activity.userName}
                            size="sm"
                        />
                        <span
                            className={cn(
                                'absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[rgb(var(--bg-surface))]',
                                activityColors[activity.type] ?? 'bg-indigo-500',
                            )}
                        />
                    </div>

                    {/* Content */}
                    <div className="flex-1 pb-4 min-w-0">
                        <div className="flex items-baseline gap-1 flex-wrap pt-3.5">
                            <span className="text-sm font-semibold text-[rgb(var(--text-primary))]">
                                {activity.userName}
                            </span>
                            <span className="text-sm text-[rgb(var(--text-secondary))]">{activity.message}</span>
                            {activity.resourceName && (
                                <span className="text-sm font-medium text-indigo-500 cursor-pointer hover:underline truncate">
                                    &quot;{activity.resourceName}&quot;
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-[rgb(var(--text-muted))] mt-0.5">{timeAgo(activity.createdAt)}</p>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
