"use client";

import { FormEvent, useState } from "react";

const services = [
  {
    number: "01",
    title: "Residential Lighting",
    copy: "A warm, polished holiday display designed around your home’s architecture.",
  },
  {
    number: "02",
    title: "Commercial Displays",
    copy: "Make your storefront, office, or property feel welcoming throughout the season.",
  },
  {
    number: "03",
    title: "Custom Design",
    copy: "Thoughtful roofline, entryway, and landscape lighting planned to fit your vision.",
  },
];

export default function Home() {
  const [sent, setSent] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  return (
    <main>
      <div className="announcement">
        <span className="status-dot" />
        Serving Kansas City and surrounding communities
      </div>

      <header className="site-header">
        <a className="brand" href="#home" aria-label="Northern Lights Installation home">
          <span className="brand-mark">✳</span>
          <span>NORTHERN LIGHTS <small>INSTALLATION</small></span>
        </a>
        <nav>
          <a href="#services">Services</a>
          <a href="#process">Our approach</a>
          <a className="nav-cta" href="#quote">Request an estimate <span>↗</span></a>
        </nav>
      </header>

      <section className="hero" id="home">
        <div className="hero-glow" />
        <div className="hero-content">
          <p className="eyebrow"><span /> HOLIDAY LIGHTING, ELEVATED</p>
          <h1>Make your home<br /><em>the moment.</em></h1>
          <p className="hero-copy">
            Thoughtfully designed holiday lighting. Expert installation.
            A little more magic when the sun goes down.
          </p>
          <div className="hero-actions">
            <a className="button button-gold" href="#quote">Get a complimentary estimate <span>↗</span></a>
            <a className="text-link" href="#services">Explore our services <span>↓</span></a>
          </div>
          <div className="hero-note"><span className="note-line" /> DESIGNED FOR YOUR HOME. INSTALLED WITH CARE.</div>
        </div>
        <div className="hero-side-label">KANSAS CITY · MISSOURI</div>
        <div className="hero-bottom">
          <span>01 / 03</span><span className="hero-bottom-line" /><span>THE SEASON, BEAUTIFULLY LIT</span>
        </div>
      </section>

      <section className="intro section-wrap">
        <div className="section-kicker">A BRIGHTER KIND OF HOLIDAY</div>
        <div>
          <h2>Beautifully lit.<br /><em>Effortlessly enjoyed.</em></h2>
          <p className="intro-copy">
            Your time should be spent enjoying the season, not untangling lights.
            We bring the design, detail, and care that make a holiday display feel
            considered from the first bulb to the final switch-on.
          </p>
        </div>
      </section>

      <section className="services section-wrap" id="services">
        <div className="section-heading">
          <div><div className="section-kicker">WHAT WE DO</div><h2>Made to <em>make an impression.</em></h2></div>
          <p>From a refined roofline to a complete property display, every detail has a purpose.</p>
        </div>
        <div className="service-grid">
          {services.map((service) => (
            <article className="service-card" key={service.number}>
              <div className="service-number">{service.number}</div>
              <div className="service-symbol">{service.number === "01" ? "⌂" : service.number === "02" ? "▤" : "✧"}</div>
              <h3>{service.title}</h3>
              <p>{service.copy}</p>
              <a href="#quote" aria-label={`Request an estimate for ${service.title}`}>Discuss your project <span>↗</span></a>
            </article>
          ))}
        </div>
      </section>

      <section className="process" id="process">
        <div className="process-inner section-wrap">
          <div>
            <div className="section-kicker">THE NORTHERN LIGHTS APPROACH</div>
            <h2>Simple from<br /><em>the first hello.</em></h2>
          </div>
          <div className="steps">
            <div className="step"><span>01</span><div><h3>Tell us what you have in mind</h3><p>Share your property, ideas, and the look you love.</p></div></div>
            <div className="step"><span>02</span><div><h3>We plan your display</h3><p>We’ll discuss the details and prepare an estimate for your project.</p></div></div>
            <div className="step"><span>03</span><div><h3>Enjoy the glow</h3><p>Our goal is a smooth installation and a display you’ll love coming home to.</p></div></div>
          </div>
        </div>
      </section>

      <section className="quote-section section-wrap" id="quote">
        <div className="quote-copy">
          <div className="section-kicker">LET’S LIGHT UP THE SEASON</div>
          <h2>Your home.<br /><em>A little more magic.</em></h2>
          <p>Tell us a little about your project. We’ll be in touch to discuss the next step.</p>
          <div className="quote-aside">NORTHERN LIGHTS INSTALLATION <span>·</span> KANSAS CITY</div>
        </div>
        <form className="quote-form" onSubmit={handleSubmit}>
          {sent ? (
            <div className="success-message">
              <span className="success-icon">✓</span>
              <h3>Thanks for reaching out.</h3>
              <p>Your form is working as a front-end preview. Before launch, we’ll connect it to your business email so submissions are delivered to you.</p>
              <button type="button" className="text-link" onClick={() => setSent(false)}>Send another request ↗</button>
            </div>
          ) : (
            <>
              <div className="form-title">REQUEST AN ESTIMATE <span>01 — 04</span></div>
              <label>Your name<input name="name" placeholder="Full name" required /></label>
              <div className="form-row">
                <label>Email address<input name="email" type="email" placeholder="you@example.com" required /></label>
                <label>Phone number<input name="phone" type="tel" placeholder="(555) 555-5555" /></label>
              </div>
              <label>What are you looking for?
                <select name="service" defaultValue="" required>
                  <option value="" disabled>Select a service</option>
                  <option>Residential holiday lighting</option>
                  <option>Commercial holiday lighting</option>
                  <option>Custom lighting design</option>
                  <option>Not sure yet</option>
                </select>
              </label>
              <label>Tell us about your project<textarea name="message" rows={3} placeholder="A little about your property and the look you have in mind…" /></label>
              <button className="button button-gold submit-button" type="submit">Send estimate request <span>↗</span></button>
              <p className="form-footnote">No obligation. Just a conversation about your project.</p>
            </>
          )}
        </form>
      </section>

      <footer className="footer">
        <a className="brand footer-brand" href="#home"><span className="brand-mark">✳</span><span>NORTHERN LIGHTS <small>INSTALLATION</small></span></a>
        <span>Thoughtful holiday lighting in Kansas City.</span>
        <a href="#home">BACK TO TOP ↑</a>
        <small className="copyright">© {new Date().getFullYear()} Northern Lights Installation. All rights reserved.</small>
      </footer>
    </main>
  );
}
