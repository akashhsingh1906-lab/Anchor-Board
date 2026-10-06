'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, Anchor, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { useAuth } from '@/hooks/useAuth';

/**
 * Login Page — email + password form with Google SSO placeholder.
 */
export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [email, setEmail] = useState('demo@anchorboard.io');
    const [password, setPassword] = useState('Demo1234!');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        const result = await login({ email, password });
        setIsLoading(false);
        if (result.success) {
            router.push('/dashboard');
        } else {
            setError(result.error || 'Invalid email or password');
        }
    };

    return (
        <PageWrapper className="w-full max-w-md">
            {/* Logo */}
            <div className="flex items-center justify-center gap-2.5 mb-8">
                <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                    <Anchor size={18} className="text-white" />
                </div>
                <span className="text-xl font-bold text-[rgb(var(--text-primary))]">AnchorBoard</span>
            </div>

            <Card className="w-full p-8">
                <div className="mb-7 text-center">
                    <h1 className="text-2xl font-bold text-[rgb(var(--text-primary))]">Welcome back</h1>
                    <p className="text-sm text-[rgb(var(--text-secondary))] mt-1.5">
                        Sign in to your workspace
                    </p>
                </div>

                {/* Google SSO placeholder */}
                <Button variant="secondary" fullWidth className="mb-5 gap-3">
                    <svg width="18" height="18" viewBox="0 0 24 24">
                        <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                            fill="#FBBC05"
                            d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z"
                        />
                        <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                    </svg>
                    Continue with Google
                </Button>

                <div className="relative flex items-center gap-3 mb-5">
                    <div className="flex-1 h-px bg-[rgb(var(--border-default))]" />
                    <span className="text-xs text-[rgb(var(--text-muted))] font-medium">or continue with email</span>
                    <div className="flex-1 h-px bg-[rgb(var(--border-default))]" />
                </div>

                {error && (
                    <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-3.5 py-2.5 text-sm text-red-600">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Email address"
                        type="email"
                        placeholder="alex@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        leftIcon={<Mail size={15} />}
                        required
                    />
                    <div>
                        <Input
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            leftIcon={<Lock size={15} />}
                            required
                        />
                        <div className="text-right mt-1.5">
                            <Link
                                href="/forgot-password"
                                className="text-xs text-indigo-500 hover:text-indigo-400 font-medium"
                            >
                                Forgot password?
                            </Link>
                        </div>
                    </div>

                    {/* Remember me */}
                    <label className="flex items-center gap-2.5 cursor-pointer">
                        <input
                            type="checkbox"
                            className="rounded border-[rgb(var(--border-default))] accent-indigo-600"
                        />
                        <span className="text-sm text-[rgb(var(--text-secondary))]">Remember me for 30 days</span>
                    </label>

                    <Button
                        type="submit"
                        fullWidth
                        isLoading={isLoading}
                        rightIcon={<ArrowRight size={16} />}
                        className="mt-2"
                    >
                        Sign in
                    </Button>
                </form>

                <p className="text-center text-sm text-[rgb(var(--text-secondary))] mt-6">
                    Don&apos;t have an account?{' '}
                    <Link href="/signup" className="text-indigo-500 hover:text-indigo-400 font-semibold">
                        Sign up free
                    </Link>
                </p>

                <p className="text-center text-xs text-[rgb(var(--text-muted))] mt-4">
                    Demo account preloaded: demo@anchorboard.io / Demo1234!
                </p>
            </Card>

            <p className="text-center text-xs text-[rgb(var(--text-muted))] mt-5">
                By signing in, you agree to our{' '}
                <span className="underline cursor-pointer">Terms of Service</span> and{' '}
                <span className="underline cursor-pointer">Privacy Policy</span>
            </p>
        </PageWrapper>
    );
}
