import bcrypt from 'bcryptjs';
const password = process.env.ADMIN_BOOTSTRAP_PASSWORD || process.argv[2];
if (!password || password.length < 14) {
  console.error('Provide ADMIN_BOOTSTRAP_PASSWORD or an argument; use at least 14 characters.');
  process.exit(1);
}
console.log(await bcrypt.hash(password, 12));
