'use client';

export function AdminLogout() {
  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    window.location.assign('/control/login');
  }
  return <button onClick={logout} className="button button-light" style={{ height: 38, cursor: 'pointer' }}>Sign out</button>;
}
