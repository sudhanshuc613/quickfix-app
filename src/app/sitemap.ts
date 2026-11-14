import type { MetadataRoute } from 'next';
import { env } from '@/lib/env';
import { brands, servicePages } from '@/lib/public-content';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = env.NEXT_PUBLIC_SITE_URL;
  const core = [
    '',
    '/ro-service-in-patna',
    '/about',
    '/contact',
    '/faq',
    '/reviews'
  ];
  return [
    ...core.map((path, index) => ({ url: `${base}${path}`, lastModified: new Date(), changeFrequency: index === 0 ? 'weekly' as const : 'monthly' as const, priority: index === 0 ? 1 : 0.75 })),
    ...servicePages.map((service) => ({ url: `${base}/${service.slug}`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.85 })),
    ...brands.map((brand) => ({ url: `${base}/brands/${brand.slug}`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.65 }))
  ];
}
