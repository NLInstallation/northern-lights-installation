"use client";

import { FormEvent, useState } from "react";

const services = [
  { title: "Residential lighting", photo: "roofline", alt: "Warm white bulbs tracing a home's roofline at dusk", copy: "Frame the eaves and peaks in warm white for a clean silhouette from the street.", option: "Residential holiday lighting" },
  { title: "Commercial displays", photo: "storefront", alt: "A storefront decorated with holiday lighting", copy: "Draw attention to your entrance and display windows with a lighting plan built around your storefront.", option: "Commercial holiday lighting" },
  { title: "Custom lighting design", photo: "entryway", alt: "Evergreen decorations lit around an entryway", copy: "Bring the glow closer to the door with an illuminated entry, greenery, or a favorite architectural detail.", option: "Custom lighting design" },
  { title: "Holiday yard décor", photo: "yard", alt: "Illuminated reindeer figures arranged on a front lawn", copy: "Give the lawn a holiday scene of its own. Ask about a stand-alone yard display or coordinate décor with your roofline lighting.", option: "Holiday yard décor" },
];

const questions = [
  ["Do you work in my area?", "We serve Kansas City and surrounding communities. Include your city or ZIP code in your request so we can confirm service at your property."],
  ["What should I include for an estimate?", "Tell us which parts of the property you’d like to light, any yard décor you have in mind, your preferred colors, and any date you have in mind. If you’re still deciding, choose “Not sure yet” on the form."],
  ["Can I send a photo of my property?", "Yes. Reply to your quote confirmation email with a photo from the street or a picture of a display you like."],
  ["Does requesting an estimate reserve an installation?", "The estimate starts the conversation. We’ll review the design, pricing, and scheduling with you before you book."],
];

export default function Home() {
  const [selectedService, setSelectedService] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendFailed, setSendFailed] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;

    const fields = Object.fromEntries(new FormData(event.currentTarget));
    setSendFailed(false);
    setSending(true);

    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });
      if (response.ok) {
        setSent(true);
      } else {
        setSendFailed(true);
      }
    } catch {
      setSendFailed(true);
    } finally {
      setSending(false);
    }
  }

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#home" aria-label="Northern Lights Installation home">
          <span className="brand-mark">✳</span>
          <span>NORTHERN LIGHTS <small>INSTALLATION</small></span>
        </a>
        <nav>
          <a href="#services">Lights &amp; décor</a>
          <a href="#faq">FAQ</a>
          <a className="nav-cta" href="#quote">Get an estimate</a>
        </nav>
      </header>

      <section className="hero" id="home">
        <img className="hero-photo" src="/lighting/roofline.webp" alt="" fetchPriority="high" />
        <div className="hero-content">
          <p className="eyebrow">KANSAS CITY HOLIDAY INSTALLATION</p>
          <h1>Come home<br />to <em>the glow.</em></h1>
          <p className="hero-copy">Holiday lighting and yard décor installation for Kansas City homes and businesses.</p>
          <div className="hero-actions">
            <a className="button button-gold" href="#quote">Get a complimentary estimate</a>
            <a className="text-link" href="#services">Explore lights and décor</a>
          </div>
        </div>
      </section>

      <section className="services section-wrap" id="services">
        <div className="section-heading">
          <h2>Holiday lights <em>&amp; yard décor.</em></h2>
          <p>Find a look for your roofline, storefront, entrance, or lawn. These concept images illustrate design possibilities.</p>
        </div>
        <div className="service-grid">
          {services.map((service) => (
            <article className="service-card" key={service.photo}>
              <img src={`/lighting/${service.photo}.webp`} alt={service.alt} loading="lazy" />
              <div>
                <h3>{service.title}</h3>
                <p>{service.copy}</p>
                <a href="#quote" onClick={() => { setSent(false); setSendFailed(false); setSelectedService(service.option); }}>Discuss {service.title.toLowerCase()}</a>
              </div>
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

      <section className="faq section-wrap" id="faq">
        <h2>Before you <em>book.</em></h2>
        <div>{questions.map(([question, answer]) => (
          <details key={question}><summary>{question}</summary><p>{answer}</p></details>
        ))}</div>
      </section>

      <section className="quote-section section-wrap" id="quote">
        <div className="quote-copy">
          <div className="section-kicker">LET’S LIGHT UP THE SEASON</div>
          <h2>Request your<br /><em>estimate.</em></h2>
          <p>Tell us a little about your project. We’ll be in touch to discuss the next step.</p>
          <a className="contact-email" href="mailto:nlightsinstallation@gmail.com">nlightsinstallation@gmail.com</a>
        </div>
        <form className="quote-form" action="/api/quote" method="post" onSubmit={handleSubmit} aria-busy={sending}>
          {sent ? (
            <div className="success-message" role="status">
              <span className="success-icon">✓</span>
              <h3>Thanks for reaching out.</h3>
              <p>We received your estimate request and will be in touch about your project.</p>
              <button type="button" className="text-link" onClick={() => setSent(false)}>Send another request</button>
            </div>
          ) : (
            <>
              <div className="form-title">PROJECT DETAILS</div>
              <label>Your name<input name="name" placeholder="Full name" maxLength={120} required /></label>
              <div className="form-row">
                <label>Email address<input name="email" type="email" placeholder="you@example.com" maxLength={254} required /></label>
                <label>Phone number (optional)<input name="phone" type="tel" placeholder="(555) 555-5555" maxLength={50} /></label>
              </div>
              <label>What are you looking for?
                <select name="service" value={selectedService} onChange={(event) => setSelectedService(event.target.value)} required>
                  <option value="" disabled>Select a service</option>
                  <option>Residential holiday lighting</option>
                  <option>Commercial holiday lighting</option>
                  <option>Custom lighting design</option>
                  <option>Holiday yard décor</option>
                  <option>Lighting and yard décor</option>
                  <option>Not sure yet</option>
                </select>
              </label>
              <label>Tell us about your project<textarea name="message" rows={3} maxLength={3000} placeholder="Your city or ZIP, lighting or yard décor ideas, and any timing you have in mind…" /></label>
              <div hidden>
                <label>Leave this field empty<input name="website" tabIndex={-1} autoComplete="off" /></label>
              </div>
              <button className="button button-gold submit-button" type="submit" disabled={sending}>
                {sending ? "Sending…" : "Send estimate request"}
              </button>
              {sendFailed && (
                <p role="alert">
                  We couldn’t send your request. Please try again in a moment.
                </p>
              )}
              <p className="form-footnote">No obligation. Just a conversation about your project.</p>
            </>
          )}
        </form>
      </section>

      <footer className="footer">
        <a className="brand footer-brand" href="#home"><span className="brand-mark">✳</span><span>NORTHERN LIGHTS <small>INSTALLATION</small></span></a>
        <span>Holiday lighting and yard décor in Kansas City.</span>
        <a href="#home">BACK TO TOP ↑</a>
        <small className="copyright">© {new Date().getFullYear()} Northern Lights Installation. All rights reserved.</small>
      </footer>
    </main>
  );
}
