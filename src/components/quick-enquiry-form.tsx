'use client';

import { FormEvent, useState } from 'react';
import { localityPages } from '@/lib/patna-localities';

type Props = { whatsapp: string; initialService?: string; initialLocality?: string; initialModel?: string; compact?: boolean };
const serviceOptions = ['RO repair / fault diagnosis', 'Routine service / filter check', 'Filter or membrane replacement', 'New RO installation', 'Uninstallation / shifting', 'AMC / maintenance enquiry', 'Commercial RO / plant enquiry'];
function matchService(initial: string) {
  const value = initial.toLowerCase();
  if (value.includes('repair')) return serviceOptions[0];
  if (value.includes('uninstall') || value.includes('shift')) return serviceOptions[4];
  if (value.includes('install')) return serviceOptions[3];
  if (value.includes('filter') || value.includes('membrane')) return serviceOptions[2];
  if (value.includes('amc') || value.includes('maint')) return serviceOptions[5];
  if (value.includes('commercial')) return serviceOptions[6];
  return '';
}

export function QuickEnquiryForm({ whatsapp, initialService = '', initialLocality = '', initialModel = '', compact = false }: Props) {
  const [notice, setNotice] = useState('');
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const service = String(form.get('service') || 'RO service enquiry');
    const locality = String(form.get('locality') || 'Patna');
    const name = String(form.get('name') || '').trim();
    const phone = String(form.get('phone') || '').trim();
    const model = String(form.get('model') || '').trim();
    const issue = String(form.get('issue') || '').trim();
    const message = [`Hello QuickFix, I have a service enquiry.`, `Name: ${name}`, `Contact: ${phone}`, `Area: ${locality}, Patna`, `Service: ${service}`, `Purifier brand/model: ${model || 'Not sure'}`, `Issue/details: ${issue || 'Please contact me to discuss'}`, `Please confirm address availability, visit fee, estimate and warranty before scheduling.`].join('\n');
    const destination = `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`;
    window.location.assign(destination);
    setNotice('Opening WhatsApp… This is an enquiry; the team must confirm the visit separately.');
  }
  return <section id="quick-enquiry" className={`quick-enquiry ${compact ? 'quick-enquiry-compact' : ''}`}><div className="container quick-enquiry-grid"><div className="quick-enquiry-intro"><div className="eyebrow">QUICK SERVICE ENQUIRY · PATNA</div><h2>Tell us what your purifier needs.</h2><p>Share your area, service type and purifier model. We’ll prepare a WhatsApp enquiry—your visit is not booked until the team confirms it.</p><div className="enquiry-note">No payment or online booking is taken here. Confirm service coverage, fee, estimate and warranty directly with QuickFix.</div></div><form className="quick-enquiry-form" onSubmit={submit}><div className="quick-form-grid"><label>Your name<input name="name" required minLength={2} maxLength={80} autoComplete="name" placeholder="Name" /></label><label>Mobile number<input name="phone" type="tel" required minLength={10} maxLength={16} inputMode="tel" autoComplete="tel" placeholder="10-digit phone" /></label><label>Patna locality<select name="locality" required defaultValue={initialLocality || ''}><option value="" disabled>Select area</option>{localityPages.map((area) => <option key={area.slug} value={area.name}>{area.name}</option>)}</select></label><label>What do you need?<select name="service" required defaultValue={matchService(initialService)}><option value="" disabled>Select service</option>{serviceOptions.map((option) => <option key={option}>{option}</option>)}</select></label><label className="quick-form-wide">RO brand & model (if known)<input name="model" maxLength={150} defaultValue={initialModel} placeholder="e.g. Kent Grand Plus / not sure" /></label><label className="quick-form-wide">Issue or visit details<textarea name="issue" rows={3} maxLength={700} placeholder="Leak, low flow, installation, preferred day/time…" /></label><label className="quick-consent"><input type="checkbox" required /><span>I agree to open WhatsApp and send these enquiry details to QuickFix. I will not include OTPs, passwords or payment PINs.</span></label></div><button className="button button-orange" type="submit">Continue to WhatsApp <span>→</span></button>{notice && <p role="status" className="quick-form-notice">{notice}</p>}</form></div></section>;
}
