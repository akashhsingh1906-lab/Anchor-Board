'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Shield, Rocket, Heart, Globe, Twitter, Linkedin, Github } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: '-80px' });
    return (
        <motion.div ref={ref} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay, ease: 'easeOut' }}>
            {children}
        </motion.div>
    );
}

const values = [
    { icon: Rocket, title: 'Move Fast', description: 'We ship every week. Speed is a feature, not a trade-off. Our roadmap is driven by real user feedback.', color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    { icon: Shield, title: 'Trust First', description: 'Security and privacy are built-in, not bolted-on. We hold ourselves to enterprise-grade standards.', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { icon: Heart, title: 'User Obsessed', description: 'Every pixel and every interaction is designed to delight. We care deeply about the experience we create.', color: 'text-pink-500', bg: 'bg-pink-500/10' },
    { icon: Globe, title: 'Built for Everyone', description: 'From solo freelancers to enterprise teams. AnchorBoard scales with you from day one to IPO.', color: 'text-amber-500', bg: 'bg-amber-500/10' },
];

const team = [
    { name: 'Rayen Lassoued', role: 'Builder & AI Engineer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rayen', bio: 'AI/ML Engineer at Madiba Consult GmbH, Bonn. Builds production multi-agent LLM systems and microservices SaaS platforms.' },
    { name: 'Sarah Chen', role: 'CTO & Co-founder', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', bio: 'Ex-Meta infra engineer. Loves distributed systems and tools developers actually enjoy.' },
    { name: 'Marcus Williams', role: 'Head of Design', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus', bio: 'Previously at Linear and Figma. Believes great design is invisible — it just works.' },
    { name: 'Priya Patel', role: 'Head of Growth', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya', bio: 'Scaled two SaaS products from 0 to $10M ARR. Passionate about product-led growth.' },
];

export function AboutSection() {
    return (
        <section id="about" className="py-24 px-6 border-t border-[rgb(var(--border-default))] scroll-mt-16">
            <div className="max-w-7xl mx-auto">
                <FadeIn>
                    <div className="text-center mb-16">
                        <Badge variant="primary" size="md" className="mb-4">Our Story</Badge>
                        <h2 className="text-4xl md:text-5xl font-black text-[rgb(var(--text-primary))] mb-5">
                            Built by builders, <span className="gradient-text">for builders</span>
                        </h2>
                        <p className="text-lg text-[rgb(var(--text-secondary))] max-w-2xl mx-auto">
                            We started AnchorBoard because we were frustrated with bloated project management tools. We wanted something fast, beautiful, and laser-focused on helping teams ship.
                        </p>
                    </div>
                </FadeIn>

                {/* Values */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
                    {values.map((v, i) => (
                        <FadeIn key={v.title} delay={i * 0.08}>
                            <motion.div whileHover={{ y: -4 }} className="rounded-[var(--radius-lg)] border border-[rgb(var(--border-default))] bg-[rgb(var(--bg-surface))] p-6 h-full shadow-sm hover:shadow-[var(--shadow-md)] transition-all">
                                <div className={`h-11 w-11 rounded-[var(--radius-md)] flex items-center justify-center mb-4 ${v.bg}`}>
                                    <v.icon size={22} className={v.color} />
                                </div>
                                <h3 className="text-base font-bold text-[rgb(var(--text-primary))] mb-2">{v.title}</h3>
                                <p className="text-sm text-[rgb(var(--text-secondary))] leading-relaxed">{v.description}</p>
                            </motion.div>
                        </FadeIn>
                    ))}
                </div>

                {/* Team */}
                <FadeIn>
                    <div className="text-center mb-12">
                        <h3 className="text-3xl font-black text-[rgb(var(--text-primary))]">The people behind the product</h3>
                    </div>
                </FadeIn>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {team.map((member, i) => (
                        <FadeIn key={member.name} delay={i * 0.08}>
                            <motion.div whileHover={{ y: -4 }} className="rounded-[var(--radius-lg)] border border-[rgb(var(--border-default))] bg-[rgb(var(--bg-surface))] p-5 text-center shadow-sm">
                                <img src={member.avatar} alt={member.name} className="h-16 w-16 rounded-full mx-auto mb-3 ring-2 ring-indigo-500/20" />
                                <p className="font-bold text-sm text-[rgb(var(--text-primary))]">{member.name}</p>
                                <p className="text-xs text-indigo-500 font-semibold mb-2">{member.role}</p>
                                <p className="text-xs text-[rgb(var(--text-muted))] leading-relaxed">{member.bio}</p>
                                <div className="flex justify-center gap-3 mt-4">
                                    {[Twitter, Linkedin, Github].map((Icon, j) => (
                                        <button key={j} className="text-[rgb(var(--text-muted))] hover:text-[rgb(var(--text-primary))] transition-colors">
                                            <Icon size={14} />
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    );
}
