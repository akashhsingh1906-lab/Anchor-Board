'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, Anchor, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { PageWrapper } from '@/components/layout/PageWrapper';
import type { PlanType } from '@/types';
import { cn } from '@/utils/cn';
import { useAuth } from '@/hooks/useAuth';

const plans: Array<{ id: PlanType; name: string; price: string; features: string[] }> = [
    { id: 'free', name: 'Free', price: '$0', features: ['3 projects', '5 members'] },
    { id: 'pro', name: 'Pro', price: '$19/mo', features: ['Unlimited projects', '20 members'] },
];

export default function SignupPage() {
    const router = useRouter();
    const { signup } = useAuth();
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [plan, setPlan] = useState<PlanType>('free');
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!acceptTerms) return;
        setIsLoading(true);
        setError(null);
        const result = await signup({ ...form, plan, acceptTerms });
        setIsLoading(false);
        if (result.success) {
            router.push('/dashboard');
        } else {
            setError(result.error || 'Could not create account');
        }
    };

    return (
        <PageWrapper className="w-full max-w-md">
            <div className="flex items-center justify-center gap-2.5 mb-8">
                <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                    <Anchor size={18} className="text-white" />
                </div>
                <span className="text-xl font-bold text-[rgb(var(--text-primary))]">AnchorBoard</span>
            </div>

            <Card className="w-full p-8">
                <div className="mb-7 text-center">
                    <h1 className="text-2xl font-bold text-[rgb(var(--text-primary))]">Create your account</h1>
                    <p className="text-sm text-[rgb(var(--text-secondary))] mt-1.5">
                        Start free — no credit card required
                    </p>
                </div>

                {error && (
                    <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-3.5 py-2.5 text-sm text-red-600">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Full name"
                        type="text"
                        placeholder="Alex Johnson"
                        value={form.name}
                        onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                        leftIcon={<User size={15} />}
                        required
                    />
                    <Input
                        label="Work email"
                        type="email"
                        placeholder="alex@company.com"
                        value={form.email}
                        onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                        leftIcon={<Mail size={15} />}
                        required
                    />
                    <Input
                        label="Password"
                        type="password"
                        placeholder="Min. 8 characters"
                        value={form.password}
                        onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                        leftIcon={<Lock size={15} />}
                        hint="Use at least 8 characters with a mix of letters and numbers."
                        required
                    />

                    {/* Plan selector */}
                    <div>
                        <p className="text-sm font-medium text-[rgb(var(--text-secondary))] mb-2">Choose a plan</p>
                        <div className="grid grid-cols-2 gap-2">
                            {plans.map((p) => (
                                <button
                                    key={p.id}
                                    type="button"
                                    onClick={() => setPlan(p.id)}
                                    className={cn(
                                        'flex flex-col gap-1 p-3 rounded-[var(--radius-md)] border text-left transition-all',
                                        plan === p.id
                                            ? 'border-indigo-500 bg-indigo-500/10 ring-1 ring-indigo-500'
                                            : 'border-[rgb(var(--border-default))] hover:border-[rgb(var(--border-strong))]',
                                    )}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-semibold text-[rgb(var(--text-primary))]">{p.name}</span>
                                        {plan === p.id && <Check size={13} className="text-indigo-500" />}
                                    </div>
                                    <span className="text-xs font-medium text-indigo-500">{p.price}</span>
                                    {p.features.map((f) => (
                                        <span key={f} className="text-[11px] text-[rgb(var(--text-muted))]">• {f}</span>
                                    ))}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Terms */}
                    <label className="flex items-start gap-2.5 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={acceptTerms}
                            onChange={(e) => setAcceptTerms(e.target.checked)}
                            className="mt-0.5 rounded border-[rgb(var(--border-default))] accent-indigo-600"
                            required
                        />
                        <span className="text-sm text-[rgb(var(--text-secondary))]">
                            I agree to the{' '}
                            <span className="text-indigo-500 underline cursor-pointer">Terms of Service</span>
                            {' '}and{' '}
                            <span className="text-indigo-500 underline cursor-pointer">Privacy Policy</span>
                        </span>
                    </label>

                    <Button
                        type="submit"
                        fullWidth
                        isLoading={isLoading}
                        rightIcon={<ArrowRight size={16} />}
                        className="mt-1"
                    >
                        Create account
                    </Button>
                </form>

                <p className="text-center text-sm text-[rgb(var(--text-secondary))] mt-6">
                    Already have an account?{' '}
                    <Link href="/login" className="text-indigo-500 hover:text-indigo-400 font-semibold">
                        Sign in
                    </Link>
                </p>
            </Card>
        </PageWrapper>
    );
}
