import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PublicFooter, PublicHeader } from '@/components/seo-page';
import { getBusinessProfile } from '@/lib/business-profile';
import { localityPages } from '@/lib/patna-localities';
import { env } from '@/lib/env';
import { QuickEnquiryForm } from '@/components/quick-enquiry-form';

export const dynamicParams = false;
type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return localityPages.map(({ slug }) => ({ slug })); }
function findArea(slug: string) { return localityPages.find((area) => area.slug === slug); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const area = findArea(slug);
  if (!area) return { title: 'Patna RO service area | QuickFix' };
  return {
    title: `RO Service & Repair in ${area.name}, Patna | QuickFix`,
    alternates: { canonical: `/areas/${area.slug}` },
    description: `Enquire about RO repair, installation, AMC and water purifier service in ${area.name}, Patna. Confirm address coverage, appointment availability, visit charges and parts before booking.`,
    keywords: [`RO service in ${area.name} Patna`, `RO repair ${area.name}`, `water purifier service ${area.name} Patna`, `RO installation ${area.name} Patna`, `RO AMC ${area.name}`],
    openGraph: { title: `RO Service in ${area.name}, Patna | QuickFix`, description: `Locality-specific RO service enquiry guide for ${area.name}, Patna.` }
  };
}

export default async function AreaPage({ params }: Props) {
  const { slug } = await params;
  const area = findArea(slug);
  if (!area) notFound();
  const profile = await getBusinessProfile();
  const phoneHref = `tel:${profile.phone.replace(/[^+\d]/g, '')}`;
  const wa = `https://wa.me/${profile.whatsapp}?text=${encodeURIComponent(`Hi QuickFix, please confirm RO service availability and charges for ${area.name}, Patna. Brand/model: `)}`;
  const faq = [
    { question: `Do you currently visit ${area.name} in Patna?`, answer: `Availability for ${area.name} depends on the exact address and schedule. Contact QuickFix with your complete address and confirm a visit before relying on coverage.` },
    { question: `What should I share for RO repair in ${area.name}?`, answer: `Share your purifier brand and model, the issue, your ${area.name} address and a preferred time window. Ask for the visit fee and estimate before approving work.` },
    { question: `Can I request installation or AMC in ${area.name}?`, answer: `You can enquire about installation, shifting, maintenance and AMC. The team should confirm scope, inclusions, exclusions and charges for your model in writing.` }
  ];
  const jsonLd = { '@context': 'https://schema.org', '@type': 'Service', name: `RO service enquiry in ${area.name}, Patna`, serviceType: 'RO repair, installation and maintenance enquiry', areaServed: { '@type': 'Place', name: `${area.name}, Patna, Bihar, India` }, provider: { '@type': 'LocalBusiness', name: profile.name, telephone: profile.phone, address: { '@type': 'PostalAddress', addressLocality: 'Patna', addressRegion: 'Bihar', addressCountry: 'IN' } }, availableChannel: { '@type': 'ServiceChannel', serviceUrl: `${env.NEXT_PUBLIC_SITE_URL}/areas/${area.slug}` } };
  const faqLd = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })) };
  return <main className="seo-page"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd).replace(/</g, '\\u003c') }} /><PublicHeader /><section className="seo-hero area-hero"><div className="container seo-hero-inner"><div><div className="eyebrow">LOCALITY ENQUIRY · PATNA, BIHAR</div><h1>RO Service in {area.name}, Patna</h1><p>Looking for RO repair, installation, filter replacement or maintenance in {area.name}? Share your full address and purifier model so the team can confirm coverage, availability and the current estimate.</p><div className="hero-actions"><a className="button button-orange" href={wa}>Check availability on WhatsApp <span>→</span></a><a className="button button-light" href={phoneHref}>Call {profile.phone}</a></div><small className="estimate-note">Address availability and charges are confirmed case by case; no response time is guaranteed.</small></div><div className="seo-hero-card area-card"><span className="seo-card-mark">{area.name.slice(0, 1).toUpperCase()}</span><b>{area.name} address check</b><p>Send your landmark or pin code, purifier make/model, and a short description of what needs attention.</p></div></div></section><div className="container crumbs"><Link href="/">Home</Link><span>›</span><Link href="/areas">Patna service areas</Link><span>›</span><span>{area.name}</span></div><QuickEnquiryForm whatsapp={profile.whatsapp} initialLocality={area.name} compact /><section className="section seo-content"><div className="container seo-two-col"><div><div className="eyebrow">RO REPAIR & WATER PURIFIER SERVICE</div><h2>Start with the issue and your exact address.</h2><p className="body-copy">This page helps residents searching for RO service in {area.name}, Patna prepare a clear enquiry. Whether you need a repair check, new installation, purifier shifting, a filter change or AMC information, the available service and parts depend on the unit and the address. Confirm that the team can visit before scheduling.</p><div className="numbered-steps"><div><span>01</span><p>Share your full address in {area.name}, a nearby landmark and any useful pin-code details.</p></div><div><span>02</span><p>Send the purifier brand/model and describe the symptom. A photo of the product label can help identify the right parts.</p></div><div><span>03</span><p>Ask the current visit fee, labour/parts estimate, appointment window and applicable warranty before authorising work.</p></div></div><h2 className="area-subheading">Common RO enquiries for {area.name}</h2><ul className="area-service-list"><li>RO repair and fault diagnosis</li><li>Water purifier installation, uninstallation or shifting</li><li>Filter and membrane replacement enquiry</li><li>Routine maintenance and AMC scope enquiry</li><li>Commercial purifier/site assessment request</li></ul></div><aside className="estimate-box"><div className="eyebrow">CHECK BEFORE CONFIRMING</div><h3>Get the visit details in writing.</h3><ul><li>Exact address coverage and appointment availability</li><li>Current visit or inspection charge</li><li>Parts compatibility, availability and itemised estimate</li><li>Warranty scope and exclusions for the specific job</li></ul><p>QuickFix is an independent service provider. Confirm manufacturer warranty directly with the manufacturer.</p></aside></div></section><section className="faq-section"><div className="container faq-inner"><div><div className="eyebrow">AREA QUESTIONS</div><h2>RO service in {area.name}</h2></div><div className="faq-list">{faq.map((item) => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</div></div></section><section className="area-neighbours"><div className="container"><div className="eyebrow">MORE PATNA LOCALITY GUIDES</div><div className="area-neighbour-links">{localityPages.filter((item) => item.slug !== area.slug).slice(0, 12).map((item) => <Link key={item.slug} href={`/areas/${item.slug}`}>{item.name}</Link>)}<Link href="/areas">View all areas →</Link></div></div></section><section className="seo-bottom-cta"><div className="container seo-bottom-inner"><div><div className="eyebrow">NEED AN RO VISIT IN {area.name.toUpperCase()}?</div><h2>Confirm availability first.</h2></div><a className="button button-orange" href={wa}>Message QuickFix <span>→</span></a></div></section><PublicFooter /></main>;
}
