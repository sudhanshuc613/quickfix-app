import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { PublicFooter, PublicHeader } from '@/components/seo-page';
export const dynamic = 'force-dynamic';
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> { const { slug } = await params; const c = await prisma.category.findUnique({ where: { slug } }); return { title: c ? `${c.name} | RO Parts Shop | QuickFix` : 'RO Parts Category | QuickFix', description: c ? `Browse published ${c.name.toLowerCase()} listings. Confirm model compatibility, stock and price with QuickFix.` : 'Browse RO spare parts categories.' }; }
export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug, active: true } });
  if (!category) notFound();
  const products = await prisma.product.findMany({ where: { categoryId: category.id, status: 'PUBLISHED', stock: { gt: 0 } }, include: { brand: true }, orderBy: { name: 'asc' }, take: 100 });
  return <main className="seo-page"><PublicHeader /><section className="seo-hero"><div className="container seo-hero-inner"><div><div className="eyebrow">QUICKFIX · RO SPARES</div><h1>{category.name}</h1><p>Published listings in this category. Contact the team with your RO model to confirm compatibility, stock and final price. Checkout is not active yet.</p></div><div className="seo-hero-card"><span className="seo-card-mark">QF</span><b>Compatibility first</b><p>Do not order based on category name alone—match the product to your model.</p></div></div></section><section className="section"><div className="container"><div className="shop-head"><div><div className="eyebrow">{category.name.toUpperCase()}</div><h2>Published items</h2></div><Link href="/shop">← All categories</Link></div>{products.length === 0 ? <div className="admin-empty shop-empty">No verified products are published in this category yet.</div> : <div className="product-grid">{products.map((p) => <Link className="store-card" href={`/shop/${p.slug}`} key={p.id}>{p.imageUrl ? <img src={p.imageUrl} alt={p.name} loading="lazy" /> : <div className="store-placeholder">RO<br/>PART</div>}<small>{p.brand?.name || category.name}</small><b>{p.name}</b><span className="store-price">₹{p.price.toLocaleString('en-IN')}</span><em>Check stock</em></Link>)}</div>}</div></section><PublicFooter /></main>;
}
