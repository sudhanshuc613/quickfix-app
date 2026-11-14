import type { Metadata } from 'next';
import { ServiceLanding } from '@/components/seo-page';
import { servicePages } from '@/lib/public-content';
const data = servicePages.find((item) => item.slug === 'ro-amc-in-patna')!;
export const metadata: Metadata = { title: 'RO AMC in Patna | QuickFix', description: data.summary };
export default function Page() { return <ServiceLanding data={data} />; }
