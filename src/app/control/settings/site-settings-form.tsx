'use client';

import { FormEvent, useEffect, useState } from 'react';
type Profile = { name: string; phone: string; whatsapp: string; email: string; address: string; hours: string };
const blank: Profile = { name: '', phone: '', whatsapp: '', email: '', address: '', hours: '' };
export function SiteSettingsForm() {
  const [profile, setProfile] = useState<Profile>(blank);
  const [message, setMessage] = useState('Loading saved profile…');
  const [busy, setBusy] = useState(false);
  useEffect(() => { fetch('/api/admin/settings', { cache: 'no-store' }).then(async (r) => { const data = await r.json(); if (!r.ok) throw new Error(data.error || 'Could not load settings.'); setProfile(data.profile); setMessage(''); }).catch((e) => setMessage(e instanceof Error ? e.message : 'Could not load settings.')); }, []);
  function change(key: keyof Profile, value: string) { setProfile((p) => ({ ...p, [key]: value })); }
  async function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true); setMessage('');
    try { const r = await fetch('/api/admin/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(profile) }); const data = await r.json(); if (!r.ok) throw new Error(data.error || 'Could not save settings.'); setMessage('Saved. Changes now appear on public pages.'); }
    catch (err) { setMessage(err instanceof Error ? err.message : 'Could not save settings.'); }
    finally { setBusy(false); }
  }
  return <form className="product-form settings-form" onSubmit={save}><div className="product-form-grid"><label>Business display name<input required maxLength={120} value={profile.name} onChange={(e) => change('name', e.target.value)} /></label><label>Phone (include country code)<input required maxLength={32} value={profile.phone} onChange={(e) => change('phone', e.target.value)} placeholder="+91…" /></label><label>WhatsApp number (digits only)<input required inputMode="numeric" maxLength={24} value={profile.whatsapp} onChange={(e) => change('whatsapp', e.target.value)} placeholder="91…" /></label><label>Public email<input type="email" maxLength={254} value={profile.email} onChange={(e) => change('email', e.target.value)} /></label><label className="full-field">Verified business address or service area<textarea required rows={3} maxLength={500} value={profile.address} onChange={(e) => change('address', e.target.value)} /></label><label className="full-field">Working hours<input required maxLength={160} value={profile.hours} onChange={(e) => change('hours', e.target.value)} /></label></div><div className="product-form-actions"><button className="button button-orange" disabled={busy}>{busy ? 'Saving…' : 'Save business profile'}</button>{message && <span role="status">{message}</span>}</div><p className="admin-hint">Only publish details you have verified. GST number, legal pages, banners, social links and service-area/editorial management are separate modules still to be built.</p></form>;
}
