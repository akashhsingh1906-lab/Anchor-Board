'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { Mail, Anchor, ArrowLeft, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { PageWrapper } from '@/components/layout/PageWrapper';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        await new Promise((r) => setTimeout(r, 1000));
        setIsLoading(false);
        setSent(true);
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
                <AnimatePresence mode="wait">
                    {!sent ? (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <div className="mb-7">
                                <h1 className="text-2xl font-bold text-[rgb(var(--text-primary))]">Reset password</h1>
                                <p className="text-sm text-[rgb(var(--text-secondary))] mt-1.5">
                                    Enter your email and we&apos;ll send you a reset link
                                </p>
                            </div>

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
                                <Button
                                    type="submit"
                                    fullWidth
                                    isLoading={isLoading}
                                    rightIcon={<ArrowRight size={16} />}
                                >
                                    Send reset link
                                </Button>
                            </form>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-4"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                                className="mx-auto mb-4 h-16 w-16 rounded-full bg-emerald-500/15 flex items-center justify-center"
                            >
                                <CheckCircle2 size={32} className="text-emerald-500" />
                            </motion.div>
                            <h2 className="text-xl font-bold text-[rgb(var(--text-primary))]">Check your inbox</h2>
                            <p className="text-sm text-[rgb(var(--text-secondary))] mt-2 mb-6">
                                We sent a reset link to <strong>{email}</strong>
                            </p>
                            <Button variant="secondary" fullWidth onClick={() => setSent(false)}>
                                Send again
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="mt-6 text-center">
                    <Link
                        href="/login"
                        className="inline-flex items-center gap-1.5 text-sm text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))] transition-colors"
                    >
                        <ArrowLeft size={14} />
                        Back to sign in
                    </Link>
                </div>
            </Card>
        </PageWrapper>
    );
}
