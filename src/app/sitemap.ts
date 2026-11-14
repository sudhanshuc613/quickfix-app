import type { MetadataRoute } from 'next';
import { env } from '@/lib/env';
export default function sitemap(): MetadataRoute.Sitemap {
  const base = env.NEXT_PUBLIC_SITE_URL;
  return [
    { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/ro-service-in-patna`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 }
  ];
}
