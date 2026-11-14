import { createHash } from 'node:crypto';
import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin-session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST() {
  if (!(await getAdminSession())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json({ error: 'Image storage is not configured yet. The owner must add Cloudinary credentials in the private deployment environment.' }, { status: 503 });
  }
  const timestamp = Math.floor(Date.now() / 1000);
  const folder = 'quickfix/products';
  const allowedFormats = 'jpg,jpeg,png,webp';
  const signatureBase = `allowed_formats=${allowedFormats}&folder=${folder}&timestamp=${timestamp}${apiSecret}`;
  const signature = createHash('sha1').update(signatureBase).digest('hex');
  return NextResponse.json({ cloudName, apiKey, timestamp, folder, allowedFormats, signature });
}
