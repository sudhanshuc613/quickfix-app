import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getAdminSession } from '@/lib/admin-session';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';
const schema = z.object({ name: z.string().trim().min(2).max(100), slug: z.string().trim().max(120).optional().default(''), description: z.string().trim().max(500).optional().default(''), active: z.boolean().default(true) });
const slugify = (value: string) => value.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 120);

export async function GET() {
  if (!(await getAdminSession())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' }, include: { _count: { select: { products: true } } } });
  return NextResponse.json({ categories });
}

export async function POST(request: NextRequest) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Check category name, URL and description.' }, { status: 400 });
  const data = parsed.data;
  const slug = data.slug ? slugify(data.slug) : slugify(data.name);
  if (!slug) return NextResponse.json({ error: 'Enter a valid category name or URL slug.' }, { status: 400 });
  try {
    const category = await prisma.$transaction(async (tx) => {
      const created = await tx.category.create({ data: { name: data.name, slug, description: data.description, active: data.active } });
      await tx.auditLog.create({ data: { action: 'CATEGORY_CREATED', entity: 'Category', entityId: created.id, details: { actor: admin, slug } } });
      return created;
    });
    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error && error.message.includes('Unique constraint') ? 'Category name or URL is already in use.' : 'Could not create this category.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
