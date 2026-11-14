import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/admin-session';
import { AdminLogout } from './logout';

export const dynamic = 'force-dynamic';
export default async function Dashboard() {
  const username = await getAdminSession();
  if (!username) redirect('/control/login');
  return <main className="dashboard"><header className="dash-head"><Link className="brand" href="/"><span className="brandmark">Q<span>F</span></span><span>quickfix<span className="branddot">.</span><small>OWNER CONSOLE</small></span></Link><nav className="admin-nav"><Link href="/control/dashboard">Dashboard</Link><Link href="/control/products">Products</Link><Link href="/control/settings">Settings</Link></nav><AdminLogout /></header><section className="dash-main"><div className="eyebrow">QUICKFIX · ADMIN</div><h1>Good to see you, {username}.</h1><p>Manage the verified public profile and draft product catalog.</p><div className="dash-notice"><b>Modules still being built</b><br/>Bookings, customer OTP, online checkout/payments, orders, full CRM, technician operations, image uploads, reports and role management are not active. Do not accept live customer orders through this starter yet.</div><div className="dash-grid"><Link className="dash-tile dash-tile-link" href="/control/settings"><b>Business profile</b><p>Edit public phone, WhatsApp, email, address and hours. Save only verified information.</p><span>Open settings →</span></Link><Link className="dash-tile dash-tile-link" href="/control/products"><b>Product catalog</b><p>Add, edit, draft or archive product records, with SKU, stock, tax and SEO fields.</p><span>Manage products →</span></Link><article className="dash-tile"><b>Security reminder</b><p>Set a strong admin password and TOTP before use. Configure persistent rate limiting/WAF. Keep secrets out of Git.</p></article></div></section></main>;
}
