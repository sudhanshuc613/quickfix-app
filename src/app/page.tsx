import Link from 'next/link';
import { env } from '@/lib/env';
import { brands } from '@/lib/public-content';

const wa = `https://wa.me/${env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi QuickFix, I need RO service in Patna.')}`;

export default function Home() {
  return <main>
    <div className="topline"><div className="container topinner"><span>Patna, Bihar · Home & Commercial RO Care</span><span className="top-right">Mon–Sun · 8:00 AM–8:00 PM</span></div></div>
    <header className="nav"><div className="container navinner">
      <Link className="brand" href="/" aria-label="QuickFix home"><span className="brandmark">Q<span>F</span></span><span>quickfix<span className="branddot">.</span><small>RO CARE · PATNA</small></span></Link>
      <nav className="navlinks"><Link href="#services">Services</Link><Link href="#why-us">Why QuickFix</Link><Link href="#contact">Contact</Link></nav>
      <a className="navphone" href={`tel:${env.NEXT_PUBLIC_BUSINESS_PHONE}`}><span className="phoneicon">↗</span><span><small>CALL OUR TEAM</small><b>{env.NEXT_PUBLIC_BUSINESS_PHONE}</b></span></a>
    </div></header>

    <section className="hero"><div className="container hero-grid">
      <div className="hero-copy"><div className="eyebrow"><span className="pulse"></span> YOUR LOCAL RO CARE TEAM · PATNA</div>
        <h1>Clean water.<br/><span>Zero worries.</span></h1>
        <p className="hero-lede">Expert RO repair, installation and annual care — at your doorstep, with honest pricing and genuine parts.</p>
        <div className="hero-actions"><a className="button button-orange" href={wa}>Request a service <span>→</span></a><a className="button button-light" href={`tel:${env.NEXT_PUBLIC_BUSINESS_PHONE}`}>Call our team</a></div>
        <div className="proof"><div className="avatarstack"><i>R</i><i>A</i><i>S</i><i>+</i></div><div><b>Local technicians. Real support.</b><small>Serving homes and businesses across Patna</small></div></div>
      </div>
      <div className="hero-art" aria-label="Illustration of a water purifier"><div className="art-orbit orbit-a"></div><div className="art-orbit orbit-b"></div><div className="waterdrop">✦</div><div className="machine"><div className="machine-top"></div><div className="machine-screen"><span></span><i>PURE<br/>WATER</i></div><div className="machine-body"><div className="machine-logo">QUICKFIX</div><div className="machine-tap"></div></div><div className="machine-foot"></div></div><div className="floating-card"><span className="check">✓</span><span><b>Genuine parts</b><small>Service you can trust</small></span></div><div className="art-caption">MADE FOR YOUR HOME <span>✦</span></div></div>
    </div><div className="hero-wave"></div></section>

    <section className="trustbar"><div className="container trustgrid"><div><strong>01</strong><span><b>Doorstep service</b><small>Across Patna & nearby</small></span></div><div><strong>02</strong><span><b>Upfront estimates</b><small>No surprise add-ons</small></span></div><div><strong>03</strong><span><b>Genuine spare parts</b><small>Quality-first repairs</small></span></div><div><strong>04</strong><span><b>All major brands</b><small>One team for your RO</small></span></div></div></section>

    <section id="services" className="section services"><div className="container"><div className="section-head"><div><div className="eyebrow">HOW CAN WE HELP?</div><h2>Everything your RO needs.</h2></div><p>From a quick fix to long-term care, we make clean water easier to maintain.</p></div><div className="service-cards">
      <article className="service-card featured"><div className="card-icon">⌁</div><span className="card-tag">MOST REQUESTED</span><h3>RO repair</h3><p>Leaks, low flow, odd taste or a unit that won't start. Get a technician to diagnose it.</p><a href="/ro-repair-in-patna">Request a repair <b>↗</b></a></article>
      <article className="service-card"><div className="card-icon aqua">◉</div><h3>Installation</h3><p>New purifier setup, shifting or re-installation with careful fitting and a clean finish.</p><a href="/ro-installation-in-patna">Book installation <b>↗</b></a></article>
      <article className="service-card"><div className="card-icon green">✳</div><h3>AMC & filter care</h3><p>Planned maintenance and timely filter changes to help keep your purifier performing.</p><a href="/ro-amc-in-patna">Explore maintenance <b>↗</b></a></article>
      <article className="service-card"><div className="card-icon sand">▦</div><h3>RO spare parts</h3><p>Need a membrane, pump or filter? Talk to us about compatible parts for your model.</p><a href={wa}>Ask about a part <b>↗</b></a></article>
    </div></div></section>

    <section className="brand-directory"><div className="container"><div className="eyebrow">PURIFIER BRAND ENQUIRIES</div><div className="brand-directory-head"><h2>Service enquiries for major RO brands.</h2><p>Share the exact model so compatibility and availability can be confirmed.</p></div><div className="brand-pills">{brands.map((brand) => <Link key={brand.slug} href={`/brands/${brand.slug}`}>{brand.name}<span>↗</span></Link>)}</div></div></section>

    <section id="why-us" className="promise"><div className="container promise-grid"><div><div className="eyebrow">THE QUICKFIX PROMISE</div><h2>Good service should<br/>feel simple.</h2><p>We pair skilled local technicians with clear communication, so you know what's happening at every step.</p><a className="textlink" href={wa}>Speak to our team <span>→</span></a></div><div className="promise-points"><div><span>01</span><p><b>We explain before we repair</b><small>Understand the issue and estimate before work begins.</small></p></div><div><span>02</span><p><b>Care for every major brand</b><small>Kent, Aquaguard, Pureit, Livpure, Havells and more.</small></p></div><div><span>03</span><p><b>Support that stays local</b><small>One Patna-based team for your home and business.</small></p></div></div></div></section>

    <section className="cta"><div className="container cta-inner"><div><div className="eyebrow">READY WHEN YOU ARE</div><h2>Let's get your RO back<br/>to its best.</h2></div><div className="cta-actions"><a className="button button-orange" href={wa}>WhatsApp QuickFix <span>→</span></a><a className="cta-call" href={`tel:${env.NEXT_PUBLIC_BUSINESS_PHONE}`}>or call {env.NEXT_PUBLIC_BUSINESS_PHONE}</a></div><div className="cta-drops">◌</div></div></section>

    <footer id="contact"><div className="container footer-main"><div className="footer-brand"><Link className="brand brand-white" href="/"><span className="brandmark">Q<span>F</span></span><span>quickfix<span className="branddot">.</span><small>RO CARE · PATNA</small></span></Link><p>Your local partner for dependable RO water purifier service.</p></div><div><b>Explore</b><a href="#services">Our services</a><a href="/ro-repair-in-patna">RO repair</a><a href="/commercial-ro-service-in-patna">Commercial RO</a><a href="/faq">FAQs</a><a href="/about">About QuickFix</a><a href={wa}>WhatsApp support</a></div><div><b>Get in touch</b><a href={`tel:${env.NEXT_PUBLIC_BUSINESS_PHONE}`}>{env.NEXT_PUBLIC_BUSINESS_PHONE}</a><span>{env.NEXT_PUBLIC_BUSINESS_ADDRESS}</span><span>Mon–Sun · 8:00 AM–8:00 PM</span></div><div className="footer-note"><span className="footer-shield">✓</span><p><b>Clean water, cared for.</b><br/>Honest help from your Patna RO team.</p></div></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} QuickFix RO Care. All rights reserved.</span><span>Built for Patna, Bihar <i>♥</i></span></div></footer>
    <div className="float-contact"><a className="float-wa" href={wa} aria-label="Message QuickFix on WhatsApp">◔</a><a className="float-call" href={`tel:${env.NEXT_PUBLIC_BUSINESS_PHONE}`} aria-label="Call QuickFix">☎</a></div>
  </main>;
}
