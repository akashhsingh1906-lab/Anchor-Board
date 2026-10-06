'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, CreditCard, Shield, Trash2, Save } from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { mockPlans } from '@/lib/mockData';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useToast } from '@/providers/ToastProvider';
import { cn } from '@/utils/cn';

type SettingsTab = 'profile' | 'notifications' | 'billing' | 'security';

const tabs: { id: SettingsTab; label: string; icon: React.ElementType }[] = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'security', label: 'Security', icon: Shield },
];

const MAX_AVATAR_BYTES = 2 * 1024 * 1024; // 2MB

export default function SettingsPage() {
    const { user } = useAuth();
    const { profile, updateProfile, isUpdatingProfile, changePassword, isChangingPassword } = useProfile();
    const { showToast } = useToast();
    const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [form, setForm] = useState({ firstName: '', lastName: '', jobTitle: '' });
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [passwordForm, setPasswordForm] = useState({ current: '', next: '', confirm: '' });

    useEffect(() => {
        if (profile) {
            setForm({ firstName: profile.firstName, lastName: profile.lastName, jobTitle: profile.jobTitle || '' });
            setAvatarPreview(profile.avatarUrl);
        }
    }, [profile]);

    const handleSave = () => {
        updateProfile({ firstName: form.firstName, lastName: form.lastName, jobTitle: form.jobTitle });
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        e.target.value = '';
        if (!file) return;
        if (file.size > MAX_AVATAR_BYTES) {
            showToast('Image must be under 2MB', 'error');
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            const dataUrl = reader.result as string;
            setAvatarPreview(dataUrl);
            updateProfile({ avatarUrl: dataUrl });
        };
        reader.readAsDataURL(file);
    };

    const handleChangePassword = () => {
        if (passwordForm.next.length < 8) {
            showToast('New password must be at least 8 characters', 'error');
            return;
        }
        if (passwordForm.next !== passwordForm.confirm) {
            showToast('New passwords do not match', 'error');
            return;
        }
        changePassword(
            { currentPassword: passwordForm.current, newPassword: passwordForm.next },
            { onSuccess: () => setPasswordForm({ current: '', next: '', confirm: '' }) },
        );
    };

    const notAvailable = () => showToast('Billing is not available in this demo — no payment provider is configured', 'info');

    return (
        <PageWrapper>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-[rgb(var(--text-primary))]">Settings</h1>
                <p className="text-sm text-[rgb(var(--text-secondary))] mt-0.5">
                    Manage your account and workspace preferences
                </p>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                {/* Sidebar Tabs */}
                <div className="md:w-48 shrink-0">
                    <nav className="space-y-1">
                        {tabs.map(({ id, label, icon: Icon }) => (
                            <button
                                key={id}
                                onClick={() => setActiveTab(id)}
                                className={cn(
                                    'w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[var(--radius-md)] text-sm font-medium text-left transition-colors',
                                    activeTab === id
                                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                                        : 'text-[rgb(var(--text-secondary))] hover:bg-[rgb(var(--bg-muted))] hover:text-[rgb(var(--text-primary))]',
                                )}
                            >
                                <Icon size={15} />
                                {label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-5">
                    {/* Profile Tab */}
                    {activeTab === 'profile' && (
                        <motion.div initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                            <Card>
                                <CardHeader title="Profile Information" description="Update your personal details" />
                                <div className="flex items-center gap-4 mb-6 pb-5 border-b border-[rgb(var(--border-default))]">
                                    <Avatar src={avatarPreview || undefined} name={user?.name || ''} size="xl" />
                                    <div>
                                        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                                        <Button variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()}>Change photo</Button>
                                        <p className="text-xs text-[rgb(var(--text-muted))] mt-1.5">JPG, GIF or PNG, max 2MB</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Input
                                        label="First name"
                                        value={form.firstName}
                                        onChange={(e) => setForm((p) => ({ ...p, firstName: e.target.value }))}
                                    />
                                    <Input
                                        label="Last name"
                                        value={form.lastName}
                                        onChange={(e) => setForm((p) => ({ ...p, lastName: e.target.value }))}
                                    />
                                    <Input label="Email address" type="email" value={profile?.email || ''} disabled />
                                    <Input
                                        label="Job title"
                                        placeholder="e.g., Full-stack Developer"
                                        value={form.jobTitle}
                                        onChange={(e) => setForm((p) => ({ ...p, jobTitle: e.target.value }))}
                                    />
                                </div>
                                <div className="flex justify-end mt-5">
                                    <Button isLoading={isUpdatingProfile} onClick={handleSave} leftIcon={<Save size={14} />}>
                                        Save Changes
                                    </Button>
                                </div>
                            </Card>

                            {/* Danger Zone */}
                            <Card className="border-red-500/30">
                                <CardHeader title="Danger Zone" description="Irreversible actions for your account" />
                                <Button variant="danger" leftIcon={<Trash2 size={14} />} size="sm" onClick={notAvailable}>
                                    Delete Account
                                </Button>
                            </Card>
                        </motion.div>
                    )}

                    {/* Notifications Tab */}
                    {activeTab === 'notifications' && (
                        <motion.div initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}>
                            <Card>
                                <CardHeader title="Notification Preferences" description="Choose what you want to be notified about" />
                                <div className="space-y-4">
                                    {[
                                        { label: 'Task assignments', description: 'When someone assigns a task to you', defaultChecked: true },
                                        { label: 'Task completions', description: 'When a task in your projects is marked done', defaultChecked: true },
                                        { label: 'New comments', description: 'When someone comments on your tasks', defaultChecked: false },
                                        { label: 'Project updates', description: 'Status changes on projects you own', defaultChecked: true },
                                        { label: 'Team invitations', description: 'When someone invites you to a workspace', defaultChecked: true },
                                        { label: 'Billing alerts', description: 'Invoices, payment failures, plan changes', defaultChecked: true },
                                        { label: 'Weekly digest', description: 'A summary of your workspace activity', defaultChecked: false },
                                    ].map((item) => (
                                        <label key={item.label} className="flex items-start justify-between gap-4 py-3 border-b border-[rgb(var(--border-default))] last:border-0 cursor-pointer">
                                            <div>
                                                <p className="text-sm font-medium text-[rgb(var(--text-primary))]">{item.label}</p>
                                                <p className="text-xs text-[rgb(var(--text-muted))] mt-0.5">{item.description}</p>
                                            </div>
                                            <input
                                                type="checkbox"
                                                defaultChecked={item.defaultChecked}
                                                className="mt-0.5 rounded accent-indigo-600"
                                            />
                                        </label>
                                    ))}
                                </div>
                            </Card>
                        </motion.div>
                    )}

                    {/* Billing Tab — no payment provider is wired up; every action here is
                        clearly labeled instead of silently doing nothing. */}
                    {activeTab === 'billing' && (
                        <motion.div initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                            <Card>
                                <CardHeader title="Current Plan" description="You are on the Pro plan" />
                                <div className="flex items-center gap-3 p-4 rounded-[var(--radius-md)] bg-indigo-500/10 border border-indigo-500/20 mb-5">
                                    <CreditCard size={20} className="text-indigo-500 shrink-0" />
                                    <div>
                                        <p className="text-sm font-semibold text-[rgb(var(--text-primary))]">Pro Plan · $19/month</p>
                                        <p className="text-xs text-[rgb(var(--text-muted))]">No payment provider configured in this demo</p>
                                    </div>
                                    <Badge variant="warning" size="sm" dot className="ml-auto">Demo only</Badge>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="secondary" size="sm" onClick={notAvailable}>Manage Billing</Button>
                                    <Button variant="ghost" size="sm" onClick={notAvailable}>Download Invoice</Button>
                                </div>
                            </Card>

                            {/* Plans comparison */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {mockPlans.map((plan) => (
                                    <Card
                                        key={plan.id}
                                        hoverable
                                        className={cn(
                                            plan.highlighted ? 'border-indigo-500/60 ring-1 ring-indigo-500/30' : '',
                                        )}
                                    >
                                        {plan.highlighted && (
                                            <Badge variant="primary" size="sm" className="mb-3">Most Popular</Badge>
                                        )}
                                        <h3 className="text-base font-bold text-[rgb(var(--text-primary))]">{plan.name}</h3>
                                        <p className="text-2xl font-black text-[rgb(var(--text-primary))] mt-1">
                                            ${plan.price}
                                            <span className="text-sm font-normal text-[rgb(var(--text-muted))]">/mo</span>
                                        </p>
                                        <ul className="mt-3 space-y-1.5">
                                            {plan.features.map((f) => (
                                                <li key={f} className="text-xs text-[rgb(var(--text-secondary))] flex items-center gap-1.5">
                                                    <span className="text-emerald-500">✓</span> {f}
                                                </li>
                                            ))}
                                        </ul>
                                        <Button
                                            fullWidth
                                            size="sm"
                                            variant={plan.id === user?.plan ? 'secondary' : 'primary'}
                                            className="mt-4"
                                            disabled={plan.id === user?.plan}
                                            onClick={notAvailable}
                                        >
                                            {plan.id === user?.plan ? 'Current plan' : `Switch to ${plan.name}`}
                                        </Button>
                                    </Card>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Security Tab */}
                    {activeTab === 'security' && (
                        <motion.div initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                            <Card>
                                <CardHeader title="Change Password" description="Update your login password" />
                                <div className="space-y-4">
                                    <Input
                                        label="Current password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={passwordForm.current}
                                        onChange={(e) => setPasswordForm((p) => ({ ...p, current: e.target.value }))}
                                    />
                                    <Input
                                        label="New password"
                                        type="password"
                                        placeholder="Min. 8 characters"
                                        value={passwordForm.next}
                                        onChange={(e) => setPasswordForm((p) => ({ ...p, next: e.target.value }))}
                                    />
                                    <Input
                                        label="Confirm new password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={passwordForm.confirm}
                                        onChange={(e) => setPasswordForm((p) => ({ ...p, confirm: e.target.value }))}
                                    />
                                </div>
                                <Button className="mt-5" size="sm" isLoading={isChangingPassword} onClick={handleChangePassword}>
                                    Update Password
                                </Button>
                            </Card>
                            <Card>
                                <CardHeader title="Two-Factor Authentication" description="Add an extra layer of security" />
                                <p className="text-sm text-[rgb(var(--text-secondary))] mb-4">
                                    2FA is currently <strong className="text-red-400">disabled</strong>. Enable it to protect your account.
                                </p>
                                <Button variant="secondary" leftIcon={<Shield size={14} />} onClick={notAvailable}>Enable 2FA</Button>
                            </Card>
                        </motion.div>
                    )}
                </div>
            </div>
        </PageWrapper>
    );
}
