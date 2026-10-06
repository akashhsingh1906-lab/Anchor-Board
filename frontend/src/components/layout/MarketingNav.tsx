'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Anchor } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { cn } from '@/utils/cn';

const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Features', href: '/#features' },
    { label: 'Pricing', href: '/#pricing' },
    { label: 'About', href: '/#about' },
    { label: 'Blog', href: '/#blog' },
];

/**
 * MarketingNav — shared sticky navbar for all public pages.
 * Adds shadow on scroll and a thin scroll-progress bar at the top.
 */
export function MarketingNav() {
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);

    // Scroll-progress bar (only meaningful on long pages)
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 12);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <>
            {/* Scroll progress bar */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-[3px] bg-indigo-500 z-[60] origin-left"
                style={{ scaleX }}
            />

            <nav
                className={cn(
                    'sticky top-0 z-50 border-b transition-all duration-300',
                    'bg-[rgb(var(--bg-surface))]/80 backdrop-blur-md',
                    scrolled
                        ? 'border-[rgb(var(--border-default))] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.12)]'
                        : 'border-transparent',
                )}
            >
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5 shrink-0">
                        <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                            <Anchor size={16} className="text-white" strokeWidth={2.25} />
                        </div>
                        <span className="font-bold text-base text-[rgb(var(--text-primary))]">AnchorBoard</span>
                    </Link>

                    {/* Links */}
                    <div className="hidden md:flex items-center gap-6">
                        {navLinks.map(({ label, href }) => {
                            const isActive = href === '/' ? pathname === '/' : pathname === href.split('#')[0];
                            return (
                                <Link
                                    key={label}
                                    href={href}
                                    className={cn(
                                        'text-sm font-medium transition-colors relative text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))]'
                                    )}
                                >
                                    {label}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <Link href="/login"><Button variant="ghost" size="sm">Sign in</Button></Link>
                        <Link href="/signup"><Button size="sm">Get started free</Button></Link>
                    </div>
                </div>
            </nav>
        </>
    );
}
