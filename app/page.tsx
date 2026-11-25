"use client";

import { supplyOptions } from "./supply-options";
import { FormEvent, useState } from "react";

const services = [
  { title: "Residential lighting", photo: "roofline", alt: "Warm white bulbs tracing a home's roofline at dusk", copy: "Frame the eaves and peaks in warm white for a clean silhouette from the street.", option: "Residential holiday lighting" },
  { title: "Commercial displays", photo: "storefront", alt: "A storefront decorated with holiday lighting", copy: "Draw attention to your entrance and display windows with a lighting plan built around your storefront.", option: "Commercial holiday lighting" },
  { title: "Custom lighting design", photo: "entryway", alt: "Evergreen decorations lit around an entryway", copy: "Bring the glow closer to the door with an illuminated entry, greenery, or a favorite architectural detail.", option: "Custom lighting design" },
  { title: "Holiday yard décor", photo: "yard", alt: "Illuminated reindeer figures arranged on a front lawn", copy: "Give the lawn a holiday scene of its own. Ask about a stand-alone yard display or coordinate décor with your roofline lighting.", option: "Holiday yard décor" },
];

const questions = [
  ["Can you install lights and decorations I already own?", "Yes. We can install your lights and yard décor, supply items for your display, or combine both. Tell us what you already have so we can confirm what will work and include any additional materials in your estimate."],
  ["Do you work in my area?", "We serve Kansas City and surrounding communities. Include your property’s ZIP code in your request so we can confirm service at your property."],
  ["What should I include for an estimate?", "Tell us which parts of the property you’d like to light, any yard décor you have in mind, your preferred colors, and any date you have in mind. If you’re still deciding, choose “Not sure yet” on the form."],
  ["Can I send a photo of my property?", "Yes. Reply to your quote confirmation email with a photo from the street or a picture of a display you like."],
  ["Does requesting an estimate reserve an installation?", "The estimate starts the conversation. We’ll review the design, pricing, and scheduling with you before you book."],
];

function BrandBulb() {
  return (
    <svg width="30" height="44" viewBox="0 0 48 72" fill="var(--gold-light, #e2c891)" aria-hidden="true" focusable="false">
      {/* The open star and initials let the header or footer color show through. */}
      <path fillRule="evenodd" d="M24 1C18 8 2 25 2 39c0 9 5 15 11 20h22c6-5 11-11 11-20C46 25 30 8 24 1Z
        M24 12l1.6 5.7 5.3 1.6-5.3 1.5L24 26l-1.6-5.2-5.3-1.5 5.3-1.6Z
        M8 47V30h4.4l8.1 10.3V30H25v17h-4.2l-8.3-10.5V47Z
        M28 30h4.8v12.7H40V47H28Z" />
      <rect x="14" y="61" width="20" height="4" rx="1.5" />
      <rect x="16" y="67" width="16" height="4" rx="1.5" />
    </svg>
  );
}

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
          <BrandBulb />
          <span>NORTHERN LIGHTS <small>INSTALLATION</small></span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#services">Lights &amp; décor</a>
          <a href="#faq">FAQ</a>
          <a className="nav-cta" href="#quote">Get an estimate</a>
        </nav>
      </header>

      <section className="hero" id="home">
        <img className="hero-photo" src="/lighting/roofline.webp" alt="" fetchPriority="high" />
        <div className="hero-content">
          <p className="eyebrow">YEAR-ROUND INSTALLATION IN KANSAS CITY</p>
          <h1>Lights for<br /><em>every holiday.</em></h1>
          <p className="hero-copy">We install holiday lighting and yard décor for Kansas City homes and businesses all year long. Use your own decorations or have us supply them. We offer discounted rates for veterans.</p>
          <div className="hero-actions">
            <a className="button button-gold" href="#quote">Get a complimentary estimate</a>
            <a className="text-link" href="#services">Explore lights and décor</a>
          </div>
        </div>
      </section>

      <section className="services section-wrap" id="services">
        <div className="section-heading">
          <h2>Holiday lights <em>&amp; yard décor.</em></h2>
          <p>Picture a red, white, and blue roofline for the Fourth of July, a purple porch for Halloween, or a warm Christmas glow. Browse the winter design concepts below.</p>
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
              <label>Your name<input name="name" autoComplete="name" placeholder="Full name" maxLength={120} required /></label>
              <div className="form-row">
                <label>Email address<input name="email" autoComplete="email" type="email" placeholder="you@example.com" maxLength={254} required /></label>
                <label>Phone number (optional)<input name="phone" autoComplete="tel" type="tel" placeholder="(555) 555-5555" maxLength={50} /></label>
              </div>
              <label>Property ZIP code (required)
                <input name="location" autoComplete="postal-code" placeholder="e.g. 66204" pattern="[0-9]{5}(-[0-9]{4})?" title="Enter a 5-digit ZIP code or ZIP+4, such as 66204 or 66204-1234." maxLength={10} required />
              </label>
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
              <label>Who will supply the lights or décor?
                <select name="supplies" defaultValue="">
                  <option value="">Select an option (optional)</option>
                  {supplyOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </label>
              <label>Tell us about your project<textarea name="message" rows={3} maxLength={3000} placeholder="Which holiday are you celebrating? Tell us your colors, display ideas, and preferred dates…" /></label>
              <label className="discount-option">
                <input type="checkbox" name="veteranDiscount" value="requested" />
                Request the veteran discount for my estimate
              </label>
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
        <a className="brand footer-brand" href="#home"><BrandBulb /><span>NORTHERN LIGHTS <small>INSTALLATION</small></span></a>
        <span>Holiday lighting and yard décor in Kansas City.</span>
        <a href="#home">BACK TO TOP ↑</a>
        <small className="copyright">© {new Date().getFullYear()} Northern Lights Installation. All rights reserved.</small>
      </footer>
    </main>
  );
}
