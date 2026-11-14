import type { Metadata } from 'next';
import { StaticContentPage } from '@/components/static-content-page';
type Section = { heading: string; paragraphs: string[]; bullets?: string[] };
export function PolicyPage({ title, description, sections }: { title: string; description: string; sections: Section[] }) {
  return <StaticContentPage title={title} eyebrow="POLICY DRAFT · OWNER REVIEW REQUIRED" lead={description} notice="Draft content only. The business owner must replace/confirm business identity, contact details, applicable law, timelines and actual operational terms with qualified advice before accepting customer orders or publishing this as a final policy." sections={sections} />;
}
export function policyMetadata(title: string, description: string): Metadata {
  return { title: `${title} | QuickFix`, description, robots: { index: false, follow: true } };
}
