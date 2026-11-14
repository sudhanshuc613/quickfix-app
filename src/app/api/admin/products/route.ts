import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getAdminSession } from '@/lib/admin-session';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';
const productInput = z.object({
  name: z.string().trim().min(2).max(160),
  slug: z.string().trim().max(180).optional().default(''),
  sku: z.string().trim().min(2).max(80),
  description: z.string().trim().max(12000).optional().default(''),
  price: z.coerce.number().int().nonnegative(),
  mrp: z.preprocess((value) => value === '' || value === undefined ? null : value, z.coerce.number().int().nonnegative().nullable()),
  stock: z.coerce.number().int().nonnegative().default(0),
  gstPercent: z.coerce.number().min(0).max(100).default(18),
  hsn: z.string().trim().max(32).optional().default(''),
  categoryId: z.string().trim().optional().default(''),
  brandId: z.string().trim().optional().default(''),
  imageUrl: z.union([z.string().url().max(1000), z.literal(''), z.null()]).optional(),
  status: z.enum(['DRAFT','PUBLISHED','ARCHIVED']).default('DRAFT'),
  seoTitle: z.string().trim().max(160).optional().default(''),
  seoDescription: z.string().trim().max(320).optional().default('')
});
const slugify = (value: string) => value.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 180);

export async function GET() {
  if (!(await getAdminSession())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const [products, categories, brands] = await Promise.all([
    prisma.product.findMany({ include: { category: true, brand: true }, orderBy: { updatedAt: 'desc' }, take: 500 }),
    prisma.category.findMany({ where: { active: true }, orderBy: { name: 'asc' } }),
    prisma.brand.findMany({ where: { active: true }, orderBy: { name: 'asc' } })
  ]);
  return NextResponse.json({ products, categories, brands });
}

export async function POST(request: NextRequest) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const parsed = productInput.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Check the product fields and try again.', details: parsed.error.flatten() }, { status: 400 });
  const p = parsed.data;
  const slug = p.slug ? slugify(p.slug) : slugify(p.name);
  try {
    const product = await prisma.$transaction(async (tx) => {
      const created = await tx.product.create({ data: {
        name: p.name, slug, sku: p.sku, description: p.description,
        price: p.price, mrp: p.mrp ?? null,
        stock: p.stock, gstPercent: p.gstPercent, hsn: p.hsn || null,
        categoryId: p.categoryId || null, brandId: p.brandId || null,
        imageUrl: p.imageUrl || null, status: p.status,
        seoTitle: p.seoTitle || null, seoDescription: p.seoDescription || null
      } });
      if (p.stock > 0) await tx.inventoryEntry.create({ data: { productId: created.id, delta: p.stock, reason: 'Initial stock on product creation' } });
      await tx.auditLog.create({ data: { action: 'PRODUCT_CREATED', entity: 'Product', entityId: created.id, details: { actor: admin, sku: p.sku, stock: p.stock } } });
      return created;
    });
    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error && error.message.includes('Unique constraint') ? 'SKU or slug already exists. Use a unique value.' : 'Could not save this product. Check the SKU, slug and category.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
