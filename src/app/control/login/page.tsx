'use client';

import { FormEvent, useState } from 'react';

export default function AdminLogin() {
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(''); setBusy(true);
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: form.get('username'), password: form.get('password'), totp: form.get('totp') }) });
      const result = await response.json();
      if (!response.ok) setError(result.error || 'Sign-in could not be completed.');
      else window.location.assign('/control/dashboard');
    } catch { setError('Unable to reach the sign-in service. Try again.'); }
    finally { setBusy(false); }
  }
  return <main className="admin-page"><section className="admin-card"><a className="brand" href="/"><span className="brandmark">Q<span>F</span></span><span>quickfix<span className="branddot">.</span><small>OWNER CONSOLE</small></span></a><h1>Welcome back.</h1><p>Sign in to the QuickFix owner console. Use your password and authenticator code.</p><form onSubmit={submit}>
    <label htmlFor="username">Admin username</label><input id="username" name="username" autoComplete="username" required />
    <label htmlFor="password">Password</label><input id="password" name="password" type="password" autoComplete="current-password" required />
    <label htmlFor="totp">6-digit authenticator code</label><input id="totp" name="totp" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} required />
    <button className="button button-orange admin-submit" type="submit" disabled={busy}>{busy ? 'Checking…' : 'Sign in securely'}</button>
  </form>{error && <div className="admin-error" role="alert">{error}</div>}<div className="admin-hint">Admin access is protected by password + TOTP. Never share your one-time code. If you did not expect this page, close it.</div></section></main>;
}
