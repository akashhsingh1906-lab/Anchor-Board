'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { useTeamMembers } from '@/hooks/useTeamMembers';

const roleVariant = (role: string) => {
    const map: Record<string, 'primary' | 'info' | 'default' | 'warning'> = {
        owner: 'primary', admin: 'info', member: 'default', viewer: 'warning',
    };
    return map[role.toLowerCase()] ?? 'default';
};

export default function TeamPage() {
    const { members, isLoading } = useTeamMembers();
    const [search, setSearch] = useState('');
    const [inviteOpen, setInviteOpen] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');

    const filtered = members.filter(
        (m) =>
            m.displayName.toLowerCase().includes(search.toLowerCase()) ||
            m.email.toLowerCase().includes(search.toLowerCase()),
    );

    return (
        <PageWrapper>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-[rgb(var(--text-primary))]">Team</h1>
                    <p className="text-sm text-[rgb(var(--text-secondary))] mt-0.5">
                        {isLoading ? 'Loading...' : `${members.length} members in this workspace`}
                    </p>
                </div>
                <Button leftIcon={<UserPlus size={14} />} onClick={() => setInviteOpen(true)}>
                    Invite Member
                </Button>
            </div>

            {/* Search */}
            <div className="relative max-w-xs mb-5">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(var(--text-muted))]" />
                <input
                    type="search"
                    placeholder="Search members..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full h-9 pl-9 pr-3 rounded-[var(--radius-md)] text-sm bg-[rgb(var(--bg-muted))] border border-[rgb(var(--border-default))] text-[rgb(var(--text-primary))] placeholder:text-[rgb(var(--text-muted))] focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
            </div>

            {/* Members Table, real data from GET /auth/api/users */}
            <Card padding="none">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-[rgb(var(--border-default))]">
                            {['Member', 'Role'].map((h) => (
                                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[rgb(var(--text-secondary))] uppercase tracking-wider first:pl-6 last:pr-6">
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[rgb(var(--border-default))]">
                        {filtered.map((member, i) => (
                            <motion.tr
                                key={member.id}
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.04 }}
                                className="hover:bg-[rgb(var(--bg-muted))] transition-colors"
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <Avatar name={member.displayName} size="sm" />
                                        <div>
                                            <p className="text-sm font-semibold text-[rgb(var(--text-primary))]">{member.displayName}</p>
                                            <p className="text-xs text-[rgb(var(--text-muted))]">{member.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 pr-6 py-4">
                                    <Badge variant={roleVariant(member.role)} size="sm">{member.role}</Badge>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
                {!isLoading && filtered.length === 0 && (
                    <div className="text-center py-12 text-[rgb(var(--text-muted))] text-sm">
                        No members found
                    </div>
                )}
            </Card>

            {/* Invite Modal, honest: no email-invite backend exists yet */}
            <Modal
                isOpen={inviteOpen}
                onClose={() => setInviteOpen(false)}
                title="Invite team member"
                description="Team invites aren't wired up yet."
                footer={
                    <Button variant="secondary" onClick={() => setInviteOpen(false)}>Close</Button>
                }
            >
                <Input
                    label="Email address"
                    type="email"
                    placeholder="colleague@company.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    leftIcon={<Mail size={15} />}
                    disabled
                />
                <p className="text-xs text-[rgb(var(--text-muted))] mt-3">
                    There is no invite-by-email endpoint yet, new teammates currently join by
                    registering their own account against this tenant.
                </p>
            </Modal>
        </PageWrapper>
    );
}
