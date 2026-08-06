"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, PointerEvent as ReactPointerEvent, useRef, useState } from "react";

const whatsapp =
  "https://wa.me/905372574543?text=Hello%20ERK%20Dynamics%2C%20I%20would%20like%20to%20discuss%20an%20industrial%20technology%20requirement.";

const helpOptions = [
  "Request a demonstration",
  "Request a quotation",
  "Ask a technical question",
  "Service and product support",
  "Explore a partnership",
  "General enquiry",
];
const productOptions = [
  "Auxivo LiftSuit",
  "Auxivo OmniSuit",
  "Industrial exoskeletons",
  "Other",
  "Not sure yet",
];
const processSteps = [
  {
    title: "Share your requirements",
    text: "Tell us about your project, technology requirements, or operational challenges.",
  },
  {
    title: "We’ll connect you",
    text: "Your enquiry will be directed to the appropriate specialist.",
  },
  {
    title: "Next steps",
    text: "Our team will review your request and get back to you with the most suitable solution.",
  },
];

export function ContactExperience() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [reference, setReference] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLFormElement>(null);

  const move = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (matchMedia("(pointer: coarse)").matches) return;
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${((e.clientX - r.left) / r.width - 0.5) * 8}px`);
    e.currentTarget.style.setProperty("--my", `${((e.clientY - r.top) / r.height - 0.5) * 8}px`);
  };
  const resetTilt = (e: ReactPointerEvent<HTMLDivElement>) => {
    e.currentTarget.style.setProperty("--mx", "0px");
    e.currentTarget.style.setProperty("--my", "0px");
  };

  const validate = (form: HTMLFormElement) => {
    const data = new FormData(form);
    const next: Record<string, string> = {};
    if (!String(data.get("name") || "").trim()) next.name = "Enter your full name.";
    if (!String(data.get("company") || "").trim()) next.company = "Enter your company name.";
    const email = String(data.get("email") || "");
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Enter a valid work email address.";
    if (!String(data.get("phone") || "").trim()) next.phone = "Enter your phone number.";
    if (!data.get("interest")) next.interest = "Select how we can help.";
    if (!data.get("consent")) next.consent = "You must accept the Privacy Policy to submit this form.";
    setErrors(next);
    const first = Object.keys(next)[0];
    if (first) (form.elements.namedItem(first) as HTMLElement | null)?.focus();
    return !first;
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!validate(form)) return;
    setStatus("sending");
    const data = new FormData(form);
    const selectedInterest = String(data.get("interest") || "");
    const intent = selectedInterest.includes("demonstration") ? "demo" : selectedInterest.includes("quotation") ? "quote" : selectedInterest.includes("technical") ? "technical" : selectedInterest.includes("support") ? "support" : selectedInterest.includes("partnership") ? "partnership" : "general";
    data.set("intent", intent);
    try {
      const response = await fetch("/api/forms", { method: "POST", body: data });
      const result = await response.json();
      if (!response.ok) throw Error(result.error);
      setReference(result.reference);
      setStatus("success");
      window.dispatchEvent(new CustomEvent("erk:analytics", { detail: { event: "contact_form_success" } }));
      form.reset();
    } catch {
      setStatus("error");
      window.dispatchEvent(new CustomEvent("erk:analytics", { detail: { event: "contact_form_failure" } }));
    }
  };

  return (
    <main className="contact-simple">
      <section className="contact-hero">
        <div className="contact-hero-copy">
          <h1>Connect With Our Experts</h1>
          <p>Tell us about your project, product requirements, or operational challenges.</p>
          <div>
            <a className="button primary" href="#contact-form">
              Send an Enquiry <span>↗</span>
            </a>
            <a className="button contact-secondary" href="tel:+905372574543">
              Talk to a Specialist <span>↗</span>
            </a>
          </div>
        </div>
        <div className="contact-hero-side">
          <div className="contact-portrait" onPointerMove={move} onPointerLeave={resetTilt}>
            <Image
              src="/media/liftsuit-work.webp"
              alt="Worker using an Auxivo LiftSuit during an industrial task"
              fill
              priority
              sizes="(max-width: 800px) 86vw, 43vw"
            />
            <span className="contact-badge" aria-hidden="true">
              ✉
            </span>
          </div>
        </div>
      </section>

      <section id="contact-form" className="contact-form-section section">
        {status === "success" ? (
          <div className="contact-success" role="status">
            <span>✓</span>
            <h2>Thank you.</h2>
            <p>Your request has been received and will be directed to the appropriate member of our team.</p>
            <small>REFERENCE / {reference}</small>
            <button className="text-link" onClick={() => setStatus("idle")}>
              Send another request →
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
            <form ref={formRef} className="contact-form" onSubmit={submit} noValidate>
              <div className="contact-field-grid">
                <FloatingField name="name" label="Full name *" error={errors.name} autoComplete="name" />
                <FloatingField name="company" label="Company *" error={errors.company} autoComplete="organization" />
                <FloatingField name="email" label="Work email *" type="email" error={errors.email} autoComplete="email" />
                <FloatingField name="phone" label="Phone *" type="tel" error={errors.phone} autoComplete="tel" required />
                <FloatingField as="select" name="interest" label="How can we help? *" options={helpOptions} error={errors.interest} />
                <FloatingField as="select" name="product" label="Product or solution" options={productOptions} />
              </div>
              <FloatingField as="textarea" name="message" label="Tell us about the task or requirement" />
              <ChoiceGroup legend="Preferred contact method" name="contactMethod" options={["Email", "Phone", "WhatsApp"]} defaultValue="Email" />
              <label className={`consent-field ${errors.consent ? "invalid" : ""}`}>
                <input type="checkbox" name="consent" />
                <span>
                  I have read the <Link href="/privacy">Privacy Policy</Link> and consent to ERK Dynamics using this information to respond to my request. *
                </span>
              </label>
              {errors.consent && (
                <p className="field-error" role="alert">
                  {errors.consent}
                </p>
              )}
              <input name="website" className="honeypot" tabIndex={-1} autoComplete="off" />
              <button className={`button primary submit-request ${status === "sending" ? "sending" : ""}`} disabled={status === "sending"}>
                {status === "sending" ? "Sending…" : "Send Request"} <span>↗</span>
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
      </section>

      <section className="contact-location section">
        <div>
          <p className="eyebrow">ERK DYNAMICS / İSTANBUL</p>
          <h2>Prefer a direct conversation?</h2>
          <dl>
            <div>
              <dt>PHONE</dt>
              <dd>
                <a href="tel:+905372574543">+90 537 257 45 43</a>
                <small>Call our team.</small>
              </dd>
            </div>
            <div>
              <dt>WHATSAPP</dt>
              <dd>
                <a href={whatsapp}>Start a WhatsApp conversation</a>
              </dd>
            </div>
            <div>
              <dt>EMAIL</dt>
              <dd>
                <a href="mailto:info@erkdynamics.com">info@erkdynamics.com</a>
              </dd>
            </div>
            <div>
              <dt>OFFICE</dt>
              <dd>Istanbul, Türkiye</dd>
            </div>
          </dl>
          <div>
            <a className="button contact-secondary" href="tel:+905372574543">
              Call Our Team
            </a>
            <a className="button primary" href={whatsapp}>
              Open WhatsApp
            </a>
          </div>
        </div>
        <div className="istanbul-map">
          <div className="map-label">
            <i />
            ERK DYNAMICS / ISTANBUL
          </div>
          <iframe
            src="https://www.google.com/maps?q=Istanbul%2C%20Turkey&z=11&output=embed"
            title="ERK Dynamics — Istanbul, Turkey"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="map-caption">
            <a href="https://www.google.com/maps/search/?api=1&query=Istanbul%2C+Turkey" target="_blank" rel="noopener noreferrer">
              Open in Google Maps ↗
            </a>
          </div>
        </div>
      </section>

    </main>
  );
}

function FloatingField({
  as = "input",
  name,
  label,
  type = "text",
  error,
  autoComplete,
  options,
  required = false,
}: {
  as?: "input" | "select" | "textarea";
  name: string;
  label: string;
  type?: string;
  error?: string;
  autoComplete?: string;
  options?: string[];
  required?: boolean;
}) {
  const describedBy = error ? `${name}-error` : undefined;
  return (
    <label className={`floating-field ${error ? "invalid" : ""}`}>
      <span>{label}</span>
      {as === "select" && (
        <select name={name} defaultValue="" required={required} aria-required={required} aria-invalid={!!error} aria-describedby={describedBy}>
          <option value="" disabled>
            Select an option
          </option>
          {options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      )}
      {as === "textarea" && (
        <textarea
          name={name}
          rows={5}
          placeholder="Describe your task, challenge, or what you would like to achieve…"
          required={required}
          aria-required={required}
          aria-invalid={!!error}
          aria-describedby={describedBy}
        />
      )}
      {as === "input" && (
        <input
          name={name}
          type={type}
          autoComplete={autoComplete}
          required={required}
          aria-required={required}
          aria-invalid={!!error}
          aria-describedby={describedBy}
        />
      )}
      <i />
      {error && (
        <p className="field-error" id={`${name}-error`} role="alert">
          {error}
        </p>
      )}
    </label>
  );
}

function ChoiceGroup({
  legend,
  name,
  options,
  defaultValue,
}: {
  legend: string;
  name: string;
  options: string[];
  defaultValue?: string;
}) {
  return (
    <fieldset className="radio-group">
      <legend>{legend}</legend>
      {options.map((option) => (
        <label key={option}>
          <input type="radio" name={name} value={option} defaultChecked={defaultValue === option} />
          <span>{option}</span>
        </label>
      ))}
    </fieldset>
  );
}
