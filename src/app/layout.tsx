import type { Metadata } from 'next';
import './globals.css';
import { env } from '@/lib/env';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  icons: { icon: '/favicon.svg' },
  openGraph: { type: 'website', locale: 'en_IN', siteName: 'QuickFix', title: 'QuickFix RO Service in Patna', description: 'RO repair, installation, AMC and genuine spare parts in Patna.', images: ['/images/quickfix-hero-water-purifier.jpg'] },
  title: { default: 'QuickFix RO Service in Patna', template: '%s | QuickFix' },
  description: 'Trusted RO water purifier repair, installation, AMC and spare parts in Patna. Call QuickFix to request a service visit.',
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en-IN"><body>{children}</body></html>;
}
