import type { Metadata } from 'next';
import { getBusinessProfile } from '@/lib/business-profile';
import { StaticContentPage } from '@/components/static-content-page';
export const metadata: Metadata = { title: 'Contact QuickFix RO Care | Patna', alternates: { canonical: '/contact' }, description: 'Contact QuickFix for RO service enquiries in Patna.' };
export default async function Page() {
  const profile = await getBusinessProfile();
  return <StaticContentPage title="Contact QuickFix" lead="Tell us your area, purifier brand/model and what help you need. We will confirm availability and the next steps." sections={[{ heading: 'Call the team', paragraphs: [`Phone: ${profile.phone}`, 'Call to confirm current service availability, charges and visit timing.'] }, { heading: 'WhatsApp', paragraphs: [`WhatsApp: +${profile.whatsapp}`, 'When you message, include your locality, purifier brand/model and a short description of the issue. Do not send payment PINs, passwords or OTPs.'] }, { heading: 'Service location', paragraphs: [profile.address, 'The published address and service area must be verified by the business owner before public launch.'] }, { heading: 'Working hours', paragraphs: [profile.hours] }]} />;
}
