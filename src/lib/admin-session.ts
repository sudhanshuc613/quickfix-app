import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'qf_admin_session';
function key() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) throw new Error('SESSION_SECRET must be at least 32 characters.');
  return new TextEncoder().encode(secret);
}

export async function createAdminSession(username: string) {
  return new SignJWT({ role: 'SUPER_ADMIN' })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(username)
    .setIssuedAt()
    .setExpirationTime('30m')
    .sign(key());
}

export async function getAdminSession() {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, key());
    return typeof payload.sub === 'string' ? payload.sub : null;
  } catch {
    return null;
  }
}

export { COOKIE_NAME };
