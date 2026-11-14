import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/admin-session';
import { AdminLogout } from '../dashboard/logout';
import { SiteSettingsForm } from './site-settings-form';
export const dynamic = 'force-dynamic';
export default async function SettingsPage() {
  if (!(await getAdminSession())) redirect('/control/login');
  return <main className="dashboard"><header className="dash-head"><Link className="brand" href="/control/dashboard"><span className="brandmark">Q<span>F</span></span><span>quickfix<span className="branddot">.</span><small>OWNER CONSOLE</small></span></Link><nav className="admin-nav"><Link href="/control/dashboard">Dashboard</Link><Link href="/control/products">Products</Link><Link href="/control/settings">Settings</Link></nav><AdminLogout /></header><section className="dash-main admin-main-wide"><div className="eyebrow">SITE CONFIGURATION</div><h1>Business profile</h1><p>These public contact details are stored in Neon and displayed across the site. Add verified business information before launch.</p><SiteSettingsForm /></section></main>;
}
