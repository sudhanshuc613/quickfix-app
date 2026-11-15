import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { QuickEnquiryForm } from '@/components/quick-enquiry-form';
import { notFound } from 'next/navigation';
import { PublicFooter, PublicHeader } from '@/components/seo-page';
import { getBusinessProfile, telephoneHref } from '@/lib/business-profile';
import { brands } from '@/lib/public-content';

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return brands.map((brand) => ({ slug: brand.slug })); }
function getBrand(slug: string) { return brands.find((brand) => brand.slug === slug); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const brand = getBrand(slug);
  if (!brand) return { title: 'Brand RO Service | QuickFix' };
  return { title: `${brand.name} RO Service in Patna | QuickFix`, alternates: { canonical: `/brands/${brand.slug}` }, description: `Enquire about independent repair and maintenance support for ${brand.name} water purifiers in Patna. Confirm model compatibility, availability and charges before booking.` };
}
export default async function BrandPage({ params }: Props) {
  const { slug } = await params;
  const brand = getBrand(slug);
  if (!brand) notFound();
  const profile = await getBusinessProfile();
  const wa = `https://wa.me/${profile.whatsapp}?text=${encodeURIComponent(`Hi QuickFix, I need help with my ${brand.name} RO purifier in Patna.`)}`;
  const schema = { '@context': 'https://schema.org', '@type': 'Service', name: `${brand.name} RO purifier service enquiry`, serviceType: 'Water purifier repair and maintenance enquiry', areaServed: { '@type': 'City', name: 'Patna' }, provider: { '@type': 'LocalBusiness', name: profile.name, telephone: profile.phone } };
  return <main className="seo-page"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} /><PublicHeader /><section className="seo-hero"><div className="container seo-hero-inner"><div><div className="eyebrow">BRAND SUPPORT ENQUIRY · PATNA</div><h1>{brand.name} RO Service in Patna</h1><p>Tell us your purifier model and what is happening. QuickFix can check whether support is available for your specific unit and address.</p><div className="hero-actions"><a className="button button-orange" href={wa}>Enquire on WhatsApp <span>→</span></a><a className="button button-light" href={telephoneHref(profile.phone)}>Call our team</a></div></div><div className="brand-hero-visual"><Image src="/images/ro-brand-model-guide.jpg" alt={`Illustrative unbranded water purifier products for ${brand.name} model enquiries`} fill priority sizes="(max-width: 800px) 100vw, 45vw"/><span>Illustrative products · not {brand.name} branded</span></div></div></section><div className="container crumbs"><Link href="/">Home</Link><span>›</span><Link href="/brands">RO brands</Link><span>›</span><span>{brand.name}</span></div><QuickEnquiryForm whatsapp={profile.whatsapp} initialService="RO repair / fault diagnosis" initialModel={`${brand.name} — model not specified`} compact /><section className="section seo-content"><div className="container seo-two-col"><div><div className="eyebrow">BEFORE REQUESTING SERVICE</div><h2>Share the model, not just the brand.</h2><p className="body-copy">Purifiers from the same brand can use different filters, electrical parts and service procedures. Send the model name, approximate purchase year and a short description of the issue so the team can check compatibility before confirming a visit.</p><div className="numbered-steps"><div><span>01</span><p>Find the model name on the product label or invoice.</p></div><div><span>02</span><p>Describe the symptom—leak, low flow, unusual taste or no power—without opening the unit.</p></div><div><span>03</span><p>Confirm the current visit charge, parts compatibility and warranty terms before work starts.</p></div></div></div><aside className="estimate-box"><div className="eyebrow">INDEPENDENT SERVICE ENQUIRY</div><h3>QuickFix is not the manufacturer.</h3><p>QuickFix is an independent local service enquiry provider and is not claiming affiliation with {brand.name}. Manufacturer warranty and brand-authorised service status must be checked directly with the manufacturer.</p><p>Parts availability and service support vary by model and are confirmed case by case.</p></aside></div></section><section className="seo-bottom-cta"><div className="container seo-bottom-inner"><div><div className="eyebrow">HAVE A {brand.name.toUpperCase()} PURIFIER?</div><h2>Send the model and issue.</h2></div><a className="button button-orange" href={wa}>Message QuickFix <span>→</span></a></div></section><PublicFooter /></main>;
}
