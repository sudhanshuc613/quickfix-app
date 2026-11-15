import type { MetadataRoute } from 'next';
import { env } from '@/lib/env';
import { prisma } from '@/lib/prisma';
import { brands, servicePages } from '@/lib/public-content';
import { localityPages } from '@/lib/patna-localities';
export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = env.NEXT_PUBLIC_SITE_URL;
  const core = ['', '/ro-service-in-patna', '/about', '/contact', '/faq', '/reviews', '/shop', '/areas', '/brands', '/privacy-policy', '/terms', '/refund-policy', '/shipping-policy', '/warranty-policy'];
  let categories: { slug: string; updatedAt: Date }[] = [];
  let products: { slug: string; updatedAt: Date }[] = [];
  try {
    [categories, products] = await Promise.all([
      prisma.category.findMany({ where: { active: true }, select: { slug: true } }).then((rows) => rows.map((row) => ({ slug: row.slug, updatedAt: new Date() }))),
      prisma.product.findMany({ where: { status: 'PUBLISHED', stock: { gt: 0 } }, select: { slug: true, updatedAt: true }, take: 500 })
    ]);
  } catch { /* Sitemap still serves stable pages while DB is temporarily unavailable. */ }
  return [
    ...core.map((path, index) => ({ url: `${base}${path}`, lastModified: new Date(), changeFrequency: index === 0 ? 'weekly' as const : 'monthly' as const, priority: index === 0 ? 1 : 0.75 })),
    ...servicePages.map((service) => ({ url: `${base}/${service.slug}`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.85 })),
    ...localityPages.map((area) => ({ url: `${base}/areas/${area.slug}`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 })),
    ...brands.map((brand) => ({ url: `${base}/brands/${brand.slug}`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.65 })),
    ...categories.map((category) => ({ url: `${base}/shop/category/${category.slug}`, lastModified: category.updatedAt, changeFrequency: 'weekly' as const, priority: 0.55 })),
    ...products.map((product) => ({ url: `${base}/shop/${product.slug}`, lastModified: product.updatedAt, changeFrequency: 'weekly' as const, priority: 0.6 }))
  ];
}
