import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/admin-session';
import { AdminLogout } from './logout';

export const dynamic = 'force-dynamic';
export default async function Dashboard() {
  const username = await getAdminSession();
  if (!username) redirect('/control/login');
  return <main className="dashboard"><header className="dash-head"><a className="brand" href="/"><span className="brandmark">Q<span>F</span></span><span>quickfix<span className="branddot">.</span><small>OWNER CONSOLE</small></span></a><AdminLogout /></header><section className="dash-main"><div className="eyebrow">QUICKFIX · ADMIN</div><h1>Good to see you, {username}.</h1><p>Your foundation is ready. This console is being built in phases.</p><div className="dash-notice"><b>Phase 1 foundation</b><br/>This secure starter includes the owner sign-in flow and database schema. Live booking, catalog, payment, customer and settings management screens will be implemented in their respective roadmap phases. Do not enter real customer data until those flows are complete and tested.</div><div className="dash-grid"><article className="dash-tile"><b>Business profile</b><p>Current public contact values are set through deployment environment variables. Admin-managed database settings are part of the next CMS phase.</p></article><article className="dash-tile"><b>Bookings & orders</b><p>Database structures are prepared. Booking and checkout workflows are not yet active.</p></article><article className="dash-tile"><b>Security reminder</b><p>Turn on platform-level rate limiting / WAF for sign-in and keep all secrets out of source control.</p></article></div></section></main>;
}
