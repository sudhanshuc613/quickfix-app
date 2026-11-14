import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getAdminSession } from '@/lib/admin-session';
import { getBusinessProfile } from '@/lib/business-profile';
import { prisma } from '@/lib/prisma';
export const runtime = 'nodejs';
const profileSchema = z.object({
  name: z.string().trim().min(2).max(120),
  legalName: z.string().trim().max(160).optional().default(''),
  gstin: z.string().trim().toUpperCase().max(15).optional().default(''),
  state: z.string().trim().max(80).optional().default('Bihar'),
  pinCode: z.string().trim().max(12).optional().default(''),
  phone: z.string().trim().min(7).max(32),
  whatsapp: z.string().trim().min(8).max(24).regex(/^\d+$/, 'WhatsApp must contain digits only.'),
  email: z.union([z.string().email().max(254), z.literal('')]),
  address: z.string().trim().min(2).max(500),
  hours: z.string().trim().min(2).max(160)
});
export async function GET() {
  if (!(await getAdminSession())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json({ profile: await getBusinessProfile() });
}
export async function PUT(request: NextRequest) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const parsed = profileSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Check the business profile fields and try again.' }, { status: 400 });
  const value = parsed.data;
  try {
    await prisma.$transaction(async (tx) => {
      await tx.setting.upsert({ where: { key: 'businessProfile' }, update: { value }, create: { key: 'businessProfile', value } });
      await tx.auditLog.create({ data: { action: 'BUSINESS_PROFILE_UPDATED', entity: 'Setting', entityId: 'businessProfile', details: { actor: admin } } });
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Could not save settings. Check the database connection.' }, { status: 500 });
  }
}
