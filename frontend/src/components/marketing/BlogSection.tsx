'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight, Clock, Tag } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/utils/cn';

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: '-80px' });
    return (
        <motion.div ref={ref} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay, ease: 'easeOut' }}>
            {children}
        </motion.div>
    );
}

const posts = [
    {
        slug: 'introducing-v2',
        title: 'Introducing AnchorBoard v2.0 — A Complete Rebuild',
        excerpt: "After 6 months of work, we've completely reimagined our platform. Here's what's new, what changed, and why we rewrote the core engine.",
        category: 'Product',
        author: { name: 'Rayen Lassoued', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rayen' },
        date: 'Mar 15, 2026',
        readTime: '8 min read',
        color: 'bg-indigo-500/10',
    },
    {
        slug: 'how-we-built-realtime',
        title: 'How We Built Real-Time Collaboration with WebSockets',
        excerpt: 'A deep-dive into our WebSocket architecture, how we handle 50,000 concurrent connections, and handling distributed state.',
        category: 'Engineering',
        author: { name: 'Sarah Chen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
        date: 'Mar 10, 2026',
        readTime: '12 min read',
        color: 'bg-blue-500/10',
    },
    {
        slug: 'plg-0-to-1m',
        title: 'Product-Led Growth: How We Hit $1M ARR Without Sales',
        excerpt: 'A frank, numbers-included story of how we grew organically. The tactics that worked, the ones that flopped, and the lessons learned.',
        category: 'Growth',
        author: { name: 'Priya Patel', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya' },
        date: 'Feb 18, 2026',
        readTime: '10 min read',
        color: 'bg-emerald-500/10',
    },
];

const categoryColor: Record<string, string> = {
    Product: 'primary',
    Engineering: 'info',
    Growth: 'success',
};

export function BlogSection() {
    return (
        <section id="blog" className="py-24 px-6 border-t border-[rgb(var(--border-default))] bg-[rgb(var(--bg-muted))/30] scroll-mt-16">
            <div className="max-w-7xl mx-auto">
                <FadeIn>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                        <div>
                            <Badge variant="success" size="md" className="mb-4">Our Blog</Badge>
                            <h2 className="text-4xl md:text-5xl font-black text-[rgb(var(--text-primary))]">
                                Latest from the team
                            </h2>
                        </div>
                        <Button variant="secondary" rightIcon={<ArrowRight size={15} />}>
                            View all articles
                        </Button>
                    </div>
                </FadeIn>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {posts.map((post, i) => (
                        <FadeIn key={post.slug} delay={i * 0.1}>
                            <motion.article
                                whileHover={{ y: -4 }}
                                className="group flex flex-col h-full rounded-[var(--radius-lg)] border border-[rgb(var(--border-default))] bg-[rgb(var(--bg-surface))] overflow-hidden cursor-pointer hover:border-indigo-400/40 hover:shadow-[var(--shadow-lg)] transition-all duration-300"
                            >
                                <div className={cn('h-1.5 w-full', post.color)} />
                                <div className="p-6 flex flex-col flex-1">
                                    <div className="mb-4">
                                        <Badge variant={categoryColor[post.category] as 'primary'} size="sm">
                                            <Tag size={10} className="mr-1.5" />{post.category}
                                        </Badge>
                                    </div>
                                    <h3 className="text-lg font-bold text-[rgb(var(--text-primary))] mb-2 leading-snug group-hover:text-indigo-500 transition-colors">
                                        {post.title}
                                    </h3>
                                    <p className="text-sm text-[rgb(var(--text-secondary))] leading-relaxed flex-1 mb-6">
                                        {post.excerpt}
                                    </p>
                                    <div className="flex items-center justify-between pt-4 border-t border-[rgb(var(--border-default))]">
                                        <div className="flex items-center gap-2.5">
                                            <img src={post.author.avatar} alt={post.author.name} className="h-8 w-8 rounded-full ring-1 ring-[rgb(var(--border-default))]" />
                                            <div>
                                                <p className="text-xs font-semibold text-[rgb(var(--text-primary))]">{post.author.name}</p>
                                                <p className="text-[10px] text-[rgb(var(--text-muted))]">{post.date}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-[rgb(var(--text-muted))]">
                                            <Clock size={12} />
                                            <span>{post.readTime}</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.article>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    );
}
