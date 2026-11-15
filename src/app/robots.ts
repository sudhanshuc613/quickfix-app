import type { MetadataRoute } from 'next';
import { env } from '@/lib/env';
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/control/', '/api/', '/account/', '/checkout/', '/cart/'] }, sitemap: `${env.NEXT_PUBLIC_SITE_URL}/sitemap.xml` };
}
