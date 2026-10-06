import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'AnchorBoard — SaaS Project Management',
    template: '%s | AnchorBoard',
  },
  description:
    'Enterprise-grade multi-tenant project management platform. Track tasks, manage projects, and collaborate in real-time.',
  keywords: ['saas', 'project management', 'task tracking', 'team collaboration', 'enterprise'],
  authors: [{ name: 'Rayen Lassoued' }],
  creator: 'Rayen Lassoued',
  metadataBase: new URL('https://github.com/Hamilas'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://github.com/Hamilas',
    title: 'AnchorBoard — SaaS Project Management',
    description: 'Enterprise-grade multi-tenant project management platform.',
    siteName: 'AnchorBoard',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AnchorBoard — SaaS Project Management',
    description: 'Enterprise-grade multi-tenant project management platform.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
