import { randomBytes } from 'node:crypto';
import { authenticator } from 'otplib';
console.log('Copy these values to your private environment-variable manager; do not commit them.');
console.log(`SESSION_SECRET=${randomBytes(48).toString('base64url')}`);
console.log(`ADMIN_TOTP_SECRET=${authenticator.generateSecret()}`);
