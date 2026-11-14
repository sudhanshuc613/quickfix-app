import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/admin-session';
import { AdminLogout } from '../dashboard/logout';
import { CategoryManager } from './category-manager';

export const dynamic = 'force-dynamic';
export default async function CategoriesPage() {
  if (!(await getAdminSession())) redirect('/control/login');
  return <main className="dashboard"><header className="dash-head"><Link className="brand" href="/control/dashboard"><span className="brandmark">Q<span>F</span></span><span>quickfix<span className="branddot">.</span><small>OWNER CONSOLE</small></span></Link><nav className="admin-nav"><Link href="/control/dashboard">Dashboard</Link><Link href="/control/products">Products</Link><Link href="/control/categories">Categories</Link><Link href="/control/settings">Settings</Link></nav><AdminLogout /></header><section className="dash-main admin-main-wide"><div className="eyebrow">SHOP STRUCTURE</div><h1>Product categories</h1><p>Create or pause categories for your real parts catalog. Hidden categories do not appear in the public shop.</p><CategoryManager /></section></main>;
}
