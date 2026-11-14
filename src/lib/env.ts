import { z } from 'zod';

const publicEnv = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().default('http://localhost:3000'),
  NEXT_PUBLIC_BUSINESS_PHONE: z.string().default('+91-00000-00000'),
  NEXT_PUBLIC_WHATSAPP_NUMBER: z.string().default('910000000000'),
  NEXT_PUBLIC_BUSINESS_ADDRESS: z.string().default('Patna, Bihar')
});

export const env = publicEnv.parse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  NEXT_PUBLIC_BUSINESS_PHONE: process.env.NEXT_PUBLIC_BUSINESS_PHONE || '+91-00000-00000',
  NEXT_PUBLIC_WHATSAPP_NUMBER: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '910000000000',
  NEXT_PUBLIC_BUSINESS_ADDRESS: process.env.NEXT_PUBLIC_BUSINESS_ADDRESS || 'Patna, Bihar'
});
