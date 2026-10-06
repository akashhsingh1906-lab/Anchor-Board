'use client';

import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  Anchor, ArrowRight, LayoutDashboard, Users, BarChart3, CheckCircle2,
  Globe, Shield, RefreshCw, Star, ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { MarketingNav } from '@/components/layout/MarketingNav';
import { AboutSection } from '@/components/marketing/AboutSection';
import { BlogSection } from '@/components/marketing/BlogSection';
import { mockPlans } from '@/lib/mockData';
import { cn } from '@/utils/cn';
import { formatCurrency } from '@/utils/formatters';

// ── Reusable section fade-in ──────────────────────────────────
function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

const features = [
  {
    icon: LayoutDashboard,
    title: 'Smart Dashboard',
    description: "Get a bird\u2019s-eye view of your workspace with real-time stats, task boards, and activity feeds.",
    color: 'text-indigo-500',
    bg: 'bg-indigo-500/10',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Invite team members, assign tasks, and track progress across projects in real-time.',
    color: 'text-violet-500',
    bg: 'bg-violet-500/10',
  },
  {
    icon: BarChart3,
    title: 'Powerful Analytics',
    description: 'Visualize trends, velocity, and team performance with beautiful charts and reports.',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  {
    icon: Globe,
    title: 'Multi-Tenant Ready',
    description: 'Built for agencies and teams. Each workspace is fully isolated and customizable.',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'SOC 2 compliant infrastructure, 2FA, SSO, and fine-grained role-based access control.',
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
  },
  {
    icon: RefreshCw,
    title: 'Real-Time Updates',
    description: 'Live notifications and WebSocket-powered updates keep your team always in sync.',
    color: 'text-pink-500',
    bg: 'bg-pink-500/10',
  },
];

const testimonials = [
  {
    quote: 'AnchorBoard transformed how our team manages projects. We ship 3× faster now.',
    name: 'Jordan Kim',
    role: 'CTO at CloudVault',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan',
  },
  {
    quote: 'The cleanest project management UI I\'ve ever used. Our team adopted it in one day.',
    name: 'Maya Patel',
    role: 'VP Engineering at Nexus',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maya',
  },
  {
    quote: 'From task boards to analytics, everything just works. Highly recommend for scaling teams.',
    name: 'Luca Ferrari',
    role: 'Founder at Loopbyte',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Luca',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[rgb(var(--bg-base))]">
      {/* ── Navbar ─────────────────────────────────────────── */}
      <MarketingNav />

      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="hero-bg pt-24 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="primary" size="md" dot pulse className="mb-6">
              Just launched · v2.0 is live
            </Badge>
            <h1 className="text-5xl md:text-6xl font-black text-[rgb(var(--text-primary))] leading-tight mb-6">
              The SaaS platform for{' '}
              <span className="gradient-text">modern teams</span>
            </h1>
            <p className="text-lg md:text-xl text-[rgb(var(--text-secondary))] max-w-2xl mx-auto mb-9 leading-relaxed">
              Manage projects, track tasks, and collaborate with your team in
              real-time — all in one beautifully designed workspace.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href="/signup">
                <Button size="xl" rightIcon={<ArrowRight size={18} />}>
                  Start for free
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="xl" variant="secondary">
                  View demo
                </Button>
              </Link>
            </div>
            <p className="text-xs text-[rgb(var(--text-muted))] mt-4">
              No credit card required · Free tier available · Cancel anytime
            </p>
          </motion.div>

          {/* Dashboard preview card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-14 relative"
          >
            <div className="rounded-[var(--radius-xl)] border border-[rgb(var(--border-default))] bg-[rgb(var(--bg-surface))] shadow-2xl shadow-indigo-500/10 overflow-hidden">
              <div className="bg-[rgb(var(--bg-muted))] px-4 py-2.5 flex items-center gap-2 border-b border-[rgb(var(--border-default))]">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-amber-400" />
                <div className="h-3 w-3 rounded-full bg-emerald-400" />
                <div className="mx-auto text-xs text-[rgb(var(--text-muted))] font-mono">
                  acme-saas.io/dashboard
                </div>
              </div>
              <div className="p-6 grid grid-cols-4 gap-3">
                {[
                  { label: 'Active Projects', value: '4', color: 'bg-indigo-500/10 border-indigo-500/20' },
                  { label: 'Tasks Done', value: '127', color: 'bg-emerald-500/10 border-emerald-500/20' },
                  { label: 'Team Size', value: '4', color: 'bg-violet-500/10 border-violet-500/20' },
                  { label: 'Hours Logged', value: '248h', color: 'bg-amber-500/10 border-amber-500/20' },
                ].map(({ label, value, color }, i) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + i * 0.08 }}
                    className={cn('rounded-lg border p-3 text-left', color)}
                  >
                    <p className="text-xs text-[rgb(var(--text-muted))] mb-1">{label}</p>
                    <p className="text-xl font-black text-[rgb(var(--text-primary))]">{value}</p>
                  </motion.div>
                ))}
              </div>
              <div className="px-6 pb-6 grid grid-cols-3 gap-3">
                {['Sprint Tasks', 'Activity', 'Projects'].map((t, i) => (
                  <div key={t} className="h-24 rounded-lg skeleton" style={{ animationDelay: `${i * 0.2}s` }} />
                ))}
              </div>
            </div>
            {/* Glow */}
            
          </motion.div>
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────── */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <div className="text-center mb-14">
              <Badge variant="primary" size="md" className="mb-4">Features</Badge>
              <h2 className="text-4xl font-black text-[rgb(var(--text-primary))] mb-4">
                Everything your team needs
              </h2>
              <p className="text-lg text-[rgb(var(--text-secondary))] max-w-2xl mx-auto">
                A complete platform built for ambitious teams who want to move fast and stay organized.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature, i) => (
              <FadeIn key={feature.title} delay={i * 0.07}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="rounded-[var(--radius-lg)] border border-[rgb(var(--border-default))] bg-[rgb(var(--bg-surface))] p-6 transition-shadow hover:shadow-[var(--shadow-lg)]"
                >
                  <div className={cn('h-11 w-11 rounded-[var(--radius-md)] flex items-center justify-center mb-4', feature.bg)}>
                    <feature.icon size={22} className={feature.color} />
                  </div>
                  <h3 className="text-base font-semibold text-[rgb(var(--text-primary))] mb-2">{feature.title}</h3>
                  <p className="text-sm text-[rgb(var(--text-secondary))] leading-relaxed">{feature.description}</p>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ───────────────────────────────────── */}
      <section className="py-20 px-6 bg-[rgb(var(--bg-muted))/50]">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <div className="text-center mb-14">
              <Badge variant="success" size="md" className="mb-4">Testimonials</Badge>
              <h2 className="text-4xl font-black text-[rgb(var(--text-primary))]">Loved by teams worldwide</h2>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <FadeIn key={t.name} delay={i * 0.1}>
                <div className="rounded-[var(--radius-lg)] bg-[rgb(var(--bg-surface))] border border-[rgb(var(--border-default))] p-6 shadow-[var(--shadow-md)]">
                  <div className="flex mb-3">
                    {[...Array(5)].map((_, s) => (
                      <Star key={s} size={14} className="text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-[rgb(var(--text-secondary))] leading-relaxed mb-5">
                    &quot;{t.quote}&quot;
                  </p>
                  <div className="flex items-center gap-3">
                    <img src={t.avatar} alt={t.name} className="h-9 w-9 rounded-full" />
                    <div>
                      <p className="text-sm font-semibold text-[rgb(var(--text-primary))]">{t.name}</p>
                      <p className="text-xs text-[rgb(var(--text-muted))]">{t.role}</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ────────────────────────────────────────── */}
      <section id="pricing" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <div className="text-center mb-14">
              <Badge variant="info" size="md" className="mb-4">Pricing</Badge>
              <h2 className="text-4xl font-black text-[rgb(var(--text-primary))] mb-3">Simple, transparent pricing</h2>
              <p className="text-lg text-[rgb(var(--text-secondary))]">No hidden fees. Upgrade, downgrade or cancel anytime.</p>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {mockPlans.map((plan, i) => (
              <FadeIn key={plan.id} delay={i * 0.08}>
                <div
                  className={cn(
                    'rounded-[var(--radius-xl)] border p-7 flex flex-col',
                    plan.highlighted
                      ? 'border-indigo-500/60 ring-2 ring-indigo-500/30 bg-indigo-500/5'
                      : 'border-[rgb(var(--border-default))] bg-[rgb(var(--bg-surface))]',
                  )}
                >
                  {plan.highlighted && (
                    <Badge variant="primary" size="sm" className="self-start mb-3">Best Value</Badge>
                  )}
                  <h3 className="text-xl font-bold text-[rgb(var(--text-primary))]">{plan.name}</h3>
                  <div className="mt-2 mb-5">
                    <span className="text-4xl font-black text-[rgb(var(--text-primary))]">
                      {formatCurrency(plan.price)}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-sm text-[rgb(var(--text-muted))]">/{plan.period}</span>
                    )}
                  </div>
                  <ul className="space-y-2.5 mb-7 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2.5 text-sm text-[rgb(var(--text-secondary))]">
                        <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/signup">
                    <Button
                      fullWidth
                      variant={plan.highlighted ? 'primary' : 'secondary'}
                      rightIcon={<ChevronRight size={15} />}
                    >
                      {plan.price === 0 ? 'Start free' : `Get ${plan.name}`}
                    </Button>
                  </Link>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── About ──────────────────────────────────────────── */}
      <AboutSection />

      {/* ── Blog ───────────────────────────────────────────── */}
      <BlogSection />

      {/* ── CTA ────────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <FadeIn>
          <div className="max-w-3xl mx-auto rounded-[var(--radius-xl)] bg-indigo-600 p-12 text-center shadow-xl shadow-indigo-500/30">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Ready to level up your workflow?
            </h2>
            <p className="text-indigo-100 mb-8 text-lg">
              Join thousands of teams already using AnchorBoard to ship faster.
            </p>
            <Link href="/signup">
              <Button
                size="xl"
                className="bg-white !text-indigo-700 hover:bg-indigo-50 shadow-lg"
                rightIcon={<ArrowRight size={18} />}
              >
                Start for free today
              </Button>
            </Link>
          </div>
        </FadeIn>
      </section>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer className="border-t border-[rgb(var(--border-default))] py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Anchor size={13} className="text-white" />
            </div>
            <span className="font-bold text-sm text-[rgb(var(--text-primary))]">AnchorBoard</span>
          </div>
          <p className="text-sm text-[rgb(var(--text-muted))]">
            © 2026 Rayen Lassoued. All rights reserved.
          </p>
          <div className="flex items-center gap-5 text-sm text-[rgb(var(--text-muted))]">
            <a href="https://github.com/Hamilas" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400 transition-colors">GitHub</a>
            <a href="https://www.linkedin.com/in/lassoued-rayen/" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400 transition-colors">LinkedIn</a>
            <a href="mailto:" className="hover:text-indigo-400 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
