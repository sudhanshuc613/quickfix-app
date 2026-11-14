import type { Metadata } from 'next';
import { getBusinessProfile } from '@/lib/business-profile';
import { PublicFooter, PublicHeader } from '@/components/seo-page';
const faqs = [
  { q: 'Which areas do you serve?', a: 'QuickFix accepts enquiries for Patna and nearby areas. Availability and timing must be confirmed for your exact address.' },
  { q: 'Which purifier brands can I ask about?', a: 'You can enquire about Kent, Aquaguard, Pureit, Livpure, Havells, Blue Star, AO Smith, Whirlpool and other brands. Support depends on the particular model and parts availability.' },
  { q: 'What does an RO service visit cost?', a: 'Charges may vary by service, location, model and parts. Ask for the current visit charge and estimate before approving work.' },
  { q: 'Do you guarantee same-day service?', a: 'No fixed response time is guaranteed on this page. Contact the team to confirm an available visit window for your address.' },
  { q: 'Do replacement parts come with a warranty?', a: 'Warranty, duration and exclusions depend on the specific part and job. Ask for the written terms on your invoice or job sheet.' },
  { q: 'Can I buy spare parts online here?', a: 'The online shop is not active yet. Contact QuickFix with your purifier model and part requirement to enquire about availability.' }
];
export const metadata: Metadata = { title: 'RO Service FAQs | QuickFix Patna', description: 'Answers about RO service availability, charges, brands and warranty enquiries in Patna.' };
export default async function Page() {
  const profile = await getBusinessProfile();
  const schema = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) };
  return <main className="seo-page"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} /><PublicHeader /><section className="seo-hero"><div className="container seo-hero-inner"><div><div className="eyebrow">HELP CENTRE · PATNA</div><h1>Frequently asked questions</h1><p>Quick answers about RO service enquiries, availability, estimates and parts.</p><a className="button button-orange" href={`https://wa.me/${profile.whatsapp}`}>Ask the team <span>→</span></a></div><div className="seo-hero-card"><span className="seo-card-mark">?</span><b>Need a specific answer?</b><p>Share your locality, purifier model and question with the team.</p></div></div></section><section className="faq-section"><div className="container faq-list faq-list-wide">{faqs.map((f) => <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>)}</div></section><PublicFooter /></main>;
}
