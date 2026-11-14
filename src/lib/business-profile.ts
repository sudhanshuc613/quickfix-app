import { cache } from 'react';
import { env } from '@/lib/env';
import { prisma } from '@/lib/prisma';

export const telephoneHref = (phone: string) => `tel:${phone.replace(/[^+\d]/g, '')}`;

export type BusinessProfile = { name: string; legalName: string; gstin: string; state: string; pinCode: string; phone: string; whatsapp: string; email: string; address: string; hours: string };
const defaults: BusinessProfile = { name: 'QuickFix RO Care', legalName: '', gstin: '', state: 'Bihar', pinCode: '', phone: env.NEXT_PUBLIC_BUSINESS_PHONE, whatsapp: env.NEXT_PUBLIC_WHATSAPP_NUMBER, email: '', address: env.NEXT_PUBLIC_BUSINESS_ADDRESS, hours: 'Hours to be confirmed' };

export const getBusinessProfile = cache(async (): Promise<BusinessProfile> => {
  try {
    const row = await prisma.setting.findUnique({ where: { key: 'businessProfile' }, select: { value: true } });
    if (!row || typeof row.value !== 'object' || row.value === null || Array.isArray(row.value)) return defaults;
    const stored = row.value as Record<string, unknown>;
    return {
      name: typeof stored.name === 'string' ? stored.name : defaults.name,
      legalName: typeof stored.legalName === 'string' ? stored.legalName : defaults.legalName,
      gstin: typeof stored.gstin === 'string' ? stored.gstin : defaults.gstin,
      state: typeof stored.state === 'string' ? stored.state : defaults.state,
      pinCode: typeof stored.pinCode === 'string' ? stored.pinCode : defaults.pinCode,
      phone: typeof stored.phone === 'string' && !stored.phone.includes('00000') ? stored.phone : defaults.phone,
      whatsapp: typeof stored.whatsapp === 'string' && !stored.whatsapp.includes('000000') ? stored.whatsapp : defaults.whatsapp,
      email: typeof stored.email === 'string' ? stored.email : defaults.email,
      address: typeof stored.address === 'string' ? stored.address : defaults.address,
      hours: typeof stored.hours === 'string' ? stored.hours : defaults.hours
    };
  } catch { return defaults; }
});
