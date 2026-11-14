import type { Metadata } from 'next';
import Link from 'next/link';
import { PublicFooter, PublicHeader } from '@/components/seo-page';
import { localityPages } from '@/lib/patna-localities';

export const metadata: Metadata = {
  title: 'Patna RO Service Areas | Locality Enquiry Pages',
  alternates: { canonical: '/areas' },
  description: 'Find RO repair, installation and purifier service enquiry information by locality across Patna. Confirm address coverage and charges before arranging a visit.'
};

export default function AreasIndexPage() {
  return <main className="seo-page"><PublicHeader /><section className="seo-hero"><div className="container seo-hero-inner"><div><div className="eyebrow">QUICKFIX · PATNA, BIHAR</div><h1>Patna RO service areas</h1><p>Choose a locality for RO repair, installation, maintenance and water purifier service enquiry information. Exact address coverage, appointment availability and charges must be confirmed with the team.</p></div><div className="seo-hero-card"><span className="seo-card-mark">📍</span><b>Check your address</b><p>Locality names are a starting point, not a promise that every pin code or outlying area is covered.</p></div></div></section><div className="container crumbs"><Link href="/">Home</Link><span>›</span><span>Patna service areas</span></div><section className="section"><div className="container"><div className="eyebrow">LOCALITY GUIDE</div><h2>Choose your area</h2><p className="area-index-intro">Tell the team your complete address, purifier brand/model and issue. Confirm the visit fee, estimated parts cost and warranty terms before approving work.</p><div className="area-index-grid">{localityPages.map((area) => <Link key={area.slug} href={`/areas/${area.slug}`}><span>RO service in {area.name}</span><b>↗</b></Link>)}</div><p className="area-note">These are locality-specific enquiry guides. They do not imply QuickFix has a staffed branch, guaranteed same-day availability or a verified technician in every locality.</p></div></section><PublicFooter /></main>;
}
