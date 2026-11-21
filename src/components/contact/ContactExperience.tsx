"use client";
import { validateContact, enquiryIntent, createReference, submitEnquiry } from "@/lib/forms";
import { site } from "@/content/site";
import { FloatingField } from "@/components/forms/FloatingField";
import { helpOptions, productOptions, countryOptions, processSteps } from "@/content/contact";

import Image from "next/image";
import { FormEvent, PointerEvent as ReactPointerEvent, useEffect, useRef, useState } from "react";

export function ContactExperience() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [mapLoaded, setMapLoaded] = useState(false);
  const [reference, setReference] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const contactHeroRef = useRef<HTMLElement>(null);
  const contactVisualRef = useRef<HTMLDivElement>(null);
  const contactFrameRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (contactFrameRef.current !== null) cancelAnimationFrame(contactFrameRef.current);
    },
    [],
  );

  const move = (event: ReactPointerEvent<HTMLElement>) => {
    if (
      matchMedia("(pointer: coarse)").matches ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;

    const clientX = event.clientX;
    const clientY = event.clientY;
    if (contactFrameRef.current !== null) cancelAnimationFrame(contactFrameRef.current);

    contactFrameRef.current = requestAnimationFrame(() => {
      const hero = contactHeroRef.current;
      const visual = contactVisualRef.current;
      if (!hero || !visual) return;
      const rect = hero.getBoundingClientRect();
      const x = (clientX - rect.left) / rect.width - 0.5;
      const y = (clientY - rect.top) / rect.height - 0.5;
      visual.style.setProperty("--parallax-x", `${(x * 30).toFixed(2)}px`);
      visual.style.setProperty("--parallax-y", `${(y * 20).toFixed(2)}px`);
    });
  };
  const resetTilt = () => {
    if (contactFrameRef.current !== null) cancelAnimationFrame(contactFrameRef.current);
    contactVisualRef.current?.style.setProperty("--parallax-x", "0px");
    contactVisualRef.current?.style.setProperty("--parallax-y", "0px");
  };

  const validate = (form: HTMLFormElement) => {
    const data = new FormData(form);
    const next = validateContact(data);
    setErrors(next);
    const first = Object.keys(next)[0];
    if (first) (form.elements.namedItem(first) as HTMLElement | null)?.focus();
    return !first;
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;
    const form = e.currentTarget;
    if (!validate(form)) return;
    setStatus("sending");
    const data = new FormData(form);
    const selectedInterest = String(data.get("interest") || "");
    const intent = enquiryIntent(selectedInterest);
    data.set("intent", intent);
    const ref = createReference();
    data.set("reference", ref);
    data.set(
      "_subject",
      `Enquiry (${intent}) — ${String(data.get("company") || data.get("name") || "ERK Dynamics")}`,
    );
    try {
      await submitEnquiry(data);
      setReference(ref);
      setStatus("success");
      window.dispatchEvent(
        new CustomEvent("erk:analytics", { detail: { event: "contact_form_success" } }),
      );
      form.reset();
    } catch {
      setStatus("error");
      window.dispatchEvent(
        new CustomEvent("erk:analytics", { detail: { event: "contact_form_failure" } }),
      );
    }
  };

  return (
    <main className="contact-simple">
      <section
        ref={contactHeroRef}
        className="contact-hero"
        id="contactHero"
        onPointerMove={move}
        onPointerLeave={resetTilt}
      >
        <div className="contact-hero__grid" aria-hidden="true" />
        <div className="contact-hero__inner">
          <div className="contact-hero-copy contact-hero__copy">
            <h1>
              <span>Connect With</span>
              <span>Our Experts</span>
            </h1>
            <p className="contact-hero__description">
              Tell us about your project, product requirements, or operational challenges.
            </p>
            <div className="contact-hero__actions">
              <a className="contact-button contact-button--primary" href="#contact-form">
                <span>Send an Enquiry</span>
                <span className="site-arrow contact-button__arrow" aria-hidden="true" />
              </a>
              <a className="contact-button contact-button--secondary" href={site.phoneHref}>
                <span>Talk to a Specialist</span>
                <span className="site-arrow contact-button__arrow" aria-hidden="true" />
              </a>
            </div>
          </div>

          <div
            ref={contactVisualRef}
            className="contact-hero__visual"
            data-parallax
            aria-hidden="true"
          >
            <div className="contact-hero__halo" />
            <Image
              className="contact-hero__dragonfly"
              src="/media/erk-dragonfly.png"
              alt=""
              width={833}
              height={479}
              preload
              sizes="(max-width: 900px) 90vw, 36vw"
            />
            <span className="contact-particle contact-particle--1" />
            <span className="contact-particle contact-particle--2" />
            <span className="contact-particle contact-particle--3" />
            <span className="contact-particle contact-particle--4" />
          </div>
        </div>
        <a className="page-scroll-cue" href="#contact-form">
          <span>Scroll to discover</span>
          <i aria-hidden="true" />
        </a>
      </section>

      <section id="contact-form" className="contact-form-section section">
        <div className="contact-flight-box" aria-hidden="true">
          <i className="contact-flight-dot contact-flight-dot--one" />
          <i className="contact-flight-dot contact-flight-dot--two" />
          <i className="contact-flight-dot contact-flight-dot--three" />
        </div>
        {status === "success" ? (
          <div className="contact-success" role="status">
            <span>✓</span>
            <h2>Thank you.</h2>
            <p>
              Your request has been received and will be directed to the appropriate member of our
              team.
            </p>
            <small>REFERENCE / {reference}</small>
            <button className="text-link" onClick={() => setStatus("idle")}>
              Send another request <span className="site-arrow" aria-hidden="true" />
            </button>
          </div>
        ) : (
          <div className="contact-form-layout">
            <aside className="contact-form-aside">
              <p className="eyebrow">ENQUIRY FORM</p>
              <h2>How can we help?</h2>
              <ol className="contact-steps">
                {processSteps.map((step) => (
                  <li key={step.title}>
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </li>
                ))}
              </ol>
            </aside>
            <form className="contact-form" onSubmit={submit} noValidate>
              <div className="contact-field-grid">
                <FloatingField
                  name="name"
                  label="Full name "
                  error={errors.name}
                  autoComplete="name"
                  required
                />
                <FloatingField
                  name="email"
                  label="Email "
                  type="email"
                  error={errors.email}
                  autoComplete="email"
                  required
                />
                <FloatingField
                  name="company"
                  label="Company "
                  error={errors.company}
                  autoComplete="organization"
                  required
                />
                <FloatingField
                  as="select"
                  name="country"
                  label="Country "
                  options={countryOptions}
                  error={errors.country}
                  autoComplete="country-name"
                  required
                />
                <FloatingField
                  as="select"
                  name="interest"
                  label="Reason Of Contact "
                  options={helpOptions}
                  error={errors.interest}
                  required
                />
                <FloatingField
                  as="select"
                  name="product"
                  label="Category"
                  options={productOptions}
                />
              </div>
              <FloatingField as="textarea" name="message" label="Description" />
              <input name="website" className="honeypot" tabIndex={-1} autoComplete="off" />
              <button
                className={`button primary submit-request ${status === "sending" ? "sending" : ""}`}
                disabled={status === "sending"}
              >
                <span className="submit-request__label">
                  {status === "sending" ? "Sending…" : "Send Request"}
                </span>
                <span className="site-arrow submit-request__arrow" aria-hidden="true" />
                <i />
              </button>
              {status === "error" && (
                <p className="field-error" role="alert">
                  We could not send your request. Please try again or email info@erkdynamics.com.
                </p>
              )}
            </form>
          </div>
        )}
        <svg className="contact-routing-diagram" aria-hidden="true" viewBox="0 0 430 220">
          <path className="routing-guide" d="M18 48h102l56 62h72l58-62h106" />
          <path className="routing-guide" d="M18 110h158M248 110h164" />
          <path className="routing-guide" d="M18 172h102l56-62M248 110l58 62h106" />
          <path className="routing-flow routing-flow--one" d="M18 48h102l56 62" pathLength="1" />
          <path className="routing-flow routing-flow--two" d="M18 110h158" pathLength="1" />
          <path className="routing-flow routing-flow--three" d="M18 172h102l56-62" pathLength="1" />
          <g className="routing-rotor">
            <circle cx="212" cy="110" r="43" />
            <circle cx="212" cy="110" r="31" />
            <path d="m212 68 14 25 29 4-21 20 5 29-27-14-27 14 5-29-21-20 29-4 14-25Z" />
          </g>
          <circle className="routing-core" cx="212" cy="110" r="8" />
          <path className="routing-flow routing-flow--out" d="M248 110h164" pathLength="1" />
          <circle className="routing-node routing-node--one" cx="18" cy="48" r="5" />
          <circle className="routing-node routing-node--two" cx="18" cy="110" r="5" />
          <circle className="routing-node routing-node--three" cx="18" cy="172" r="5" />
          <circle className="routing-node routing-node--out" cx="412" cy="110" r="6" />
        </svg>
      </section>

      <section className="contact-location section">
        <div>
          <h2>Prefer a direct conversation?</h2>
          <dl>
            <div>
              <dt>PHONE</dt>
              <dd>
                <a href={site.phoneHref}>+90 (537) 257 45 43</a>
              </dd>
            </div>
            <div>
              <dt>WHATSAPP</dt>
              <dd>
                <a
                  className="contact-location-link"
                  href={site.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>WhatsApp</span>
                  <span className="site-arrow" aria-hidden="true" />
                </a>
              </dd>
            </div>
            <div>
              <dt>EMAIL</dt>
              <dd>
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </dd>
            </div>
            <div>
              <dt>OFFICE</dt>
              <dd>Istanbul, Türkiye</dd>
            </div>
          </dl>
        </div>
        <div className={`istanbul-map ${mapLoaded ? "is-loaded" : ""}`}>
          <div className="map-skeleton" aria-hidden="true">
            <span className="map-skeleton__pin" />
            <span className="map-skeleton__text">Loading map…</span>
          </div>
          <iframe
            src="https://www.google.com/maps?q=Istanbul%2C%20Turkey&z=11&output=embed"
            title="ERK Dynamics — Istanbul, Turkey"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            onLoad={() => setMapLoaded(true)}
          />
        </div>
      </section>
    </main>
  );
}
