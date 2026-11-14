import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { authenticator } from 'otplib';
import { z } from 'zod';
import { createAdminSession, COOKIE_NAME } from '@/lib/admin-session';

export const runtime = 'nodejs';
const bodySchema = z.object({
  username: z.string().min(1).max(100),
  password: z.string().min(1).max(200),
  totp: z.string().regex(/^\d{6}$/)
});

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  const requestHost = request.headers.get('x-forwarded-host') || request.headers.get('host');
  let originHost = '';
  try { originHost = origin ? new URL(origin).host : ''; } catch { originHost = ''; }
  if (!originHost || !requestHost || originHost !== requestHost) {
    return NextResponse.json({ error: 'Request origin could not be verified.' }, { status: 403 });
  }
  let parsed: z.infer<typeof bodySchema>;
  try {
    parsed = bodySchema.parse(await request.json());
  } catch {
    return NextResponse.json({ error: 'Enter a valid username, password, and six-digit authenticator code.' }, { status: 400 });
  }

  const expectedUser = process.env.ADMIN_USERNAME;
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;
  const totpSecret = process.env.ADMIN_TOTP_SECRET;
  if (!expectedUser || !passwordHash || !totpSecret || !process.env.SESSION_SECRET) {
    return NextResponse.json({ error: 'Admin sign-in is not configured yet. Set the admin secrets in the deployment environment.' }, { status: 503 });
  }

  const usernameOk = parsed.username === expectedUser;
  const passwordOk = await bcrypt.compare(parsed.password, passwordHash).catch(() => false);
  const totpOk = authenticator.check(parsed.totp, totpSecret);
  if (!usernameOk || !passwordOk || !totpOk) {
    // Configure platform-level rate limiting/WAF before exposing this endpoint publicly.
    return NextResponse.json({ error: 'Sign-in details are incorrect.' }, { status: 401 });
  }

  const token = await createAdminSession(expectedUser);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 30 * 60
  });
  return response;
}
