import { cache } from 'react';
import { env } from '@/lib/env';
import { prisma } from '@/lib/prisma';

export type BusinessProfile = { name: string; phone: string; whatsapp: string; email: string; address: string; hours: string };
const defaults: BusinessProfile = { name: 'QuickFix RO Care', phone: env.NEXT_PUBLIC_BUSINESS_PHONE, whatsapp: env.NEXT_PUBLIC_WHATSAPP_NUMBER, email: '', address: env.NEXT_PUBLIC_BUSINESS_ADDRESS, hours: 'Hours to be confirmed' };

export const getBusinessProfile = cache(async (): Promise<BusinessProfile> => {
  try {
    const row = await prisma.setting.findUnique({ where: { key: 'businessProfile' }, select: { value: true } });
    if (!row || typeof row.value !== 'object' || row.value === null || Array.isArray(row.value)) return defaults;
    const stored = row.value as Record<string, unknown>;
    return {
      name: typeof stored.name === 'string' ? stored.name : defaults.name,
      phone: typeof stored.phone === 'string' ? stored.phone : defaults.phone,
      whatsapp: typeof stored.whatsapp === 'string' ? stored.whatsapp : defaults.whatsapp,
      email: typeof stored.email === 'string' ? stored.email : defaults.email,
      address: typeof stored.address === 'string' ? stored.address : defaults.address,
      hours: typeof stored.hours === 'string' ? stored.hours : defaults.hours
    };
  } catch { return defaults; }
});
