import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getAdminSession } from '@/lib/admin-session';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';
const inputSchema = z.object({
  name: z.string().trim().min(2).max(160), slug: z.string().trim().max(180).optional().default(''),
  sku: z.string().trim().min(2).max(80), description: z.string().trim().max(12000).optional().default(''),
  price: z.coerce.number().int().nonnegative(), mrp: z.preprocess((value) => value === '' || value === undefined ? null : value, z.coerce.number().int().nonnegative().nullable()),
  stock: z.coerce.number().int().nonnegative().default(0), gstPercent: z.coerce.number().min(0).max(100).default(18),
  hsn: z.string().trim().max(32).optional().default(''), categoryId: z.string().trim().optional().default(''), brandId: z.string().trim().optional().default(''),
  imageUrl: z.union([z.string().url().max(1000), z.literal(''), z.null()]).optional(), status: z.enum(['DRAFT','PUBLISHED','ARCHIVED']).default('DRAFT'),
  seoTitle: z.string().trim().max(160).optional().default(''), seoDescription: z.string().trim().max(320).optional().default('')
});
const slugify = (value: string) => value.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 180);
type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Context) {
  if (!(await getAdminSession())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const parsed = inputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Check the product fields and try again.' }, { status: 400 });
  const p = parsed.data;
  try {
    const current = await prisma.product.findUnique({ where: { id }, select: { stock: true } });
    if (!current) return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
    const slug = p.slug ? slugify(p.slug) : slugify(p.name);
    const product = await prisma.$transaction(async (tx) => {
      const updated = await tx.product.update({ where: { id }, data: {
        name: p.name, slug, sku: p.sku, description: p.description,
        price: p.price, mrp: p.mrp ?? null,
        stock: p.stock, gstPercent: p.gstPercent, hsn: p.hsn || null,
        categoryId: p.categoryId || null, brandId: p.brandId || null,
        imageUrl: p.imageUrl || null, status: p.status,
        seoTitle: p.seoTitle || null, seoDescription: p.seoDescription || null
      } });
      const delta = p.stock - current.stock;
      if (delta !== 0) await tx.inventoryEntry.create({ data: { productId: id, delta, reason: 'Admin stock adjustment' } });
      await tx.auditLog.create({ data: { action: 'PRODUCT_UPDATED', entity: 'Product', entityId: id, details: { sku: p.sku, stockDelta: delta } } });
      return updated;
    });
    return NextResponse.json({ product });
  } catch (error) {
    const message = error instanceof Error && error.message.includes('Unique constraint') ? 'SKU or slug already exists. Use a unique value.' : 'Could not update this product.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(_request: NextRequest, { params }: Context) {
  if (!(await getAdminSession())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  try {
    const product = await prisma.product.update({ where: { id }, data: { status: 'ARCHIVED' } });
    await prisma.auditLog.create({ data: { action: 'PRODUCT_ARCHIVED', entity: 'Product', entityId: id, details: { sku: product.sku } } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Product not found or could not be archived.' }, { status: 404 });
  }
}
