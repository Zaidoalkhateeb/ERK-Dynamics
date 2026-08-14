"use client";

import { FormEvent, useState } from "react";
import { countryOptions } from "./ContactExperience";

export function InquiryForm() {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setState("sending");
    const form = event.currentTarget;
    const data = new FormData(form);
    data.set("type", "partner");
    data.set("_subject", `Partnership application — ${String(data.get("company") || data.get("name") || "ERK Dynamics")}`);

    try {
      const response = await fetch("/send.php", { method: "POST", body: data });
      if (!response.ok) throw new Error();
      setState("sent");
      form.reset();
      window.dispatchEvent(new CustomEvent("erk:analytics", { detail: { event: "partner_application_submit" } }));
    } catch {
      setState("error");
    }
  };

  if (state === "sent") {
    return (
      <div className="form-success" role="status">
        <span>✓</span>
        <h2>Thank you.</h2>
        <p>Your request has been received. Our team will respond using the details you provided.</p>
        <button className="text-link" onClick={() => setState("idle")}>Send another request →</button>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={submit}>
      <div className="field-row">
        <label>Full name *<input name="name" required autoComplete="name" /></label>
        <label>Work email *<input name="email" type="email" required autoComplete="email" /></label>
      </div>
      <div className="field-row">
        <label>Company *<input name="company" required autoComplete="organization" /></label>
        <label>Phone<input name="phone" type="tel" autoComplete="tel" /></label>
      </div>
      <div className="field-row">
        <label>
          Country / region *
          <select name="region" required defaultValue="" autoComplete="country-name">
            <option value="" disabled>Select a country</option>
            {countryOptions.map((country) => <option key={country} value={country}>{country}</option>)}
          </select>
        </label>
        <label>
          Organization type *
          <select name="organizationType" required defaultValue="">
            <option value="" disabled>Select type</option>
            <option>Technology manufacturer</option>
            <option>Distributor</option>
            <option>System integrator</option>
            <option>Consultancy</option>
            <option>Research organization</option>
          </select>
        </label>
      </div>
      <label>Partnership proposal<textarea name="message" rows={5} /></label>
      <input className="honeypot" name="website" tabIndex={-1} autoComplete="off" />
      <button className="button primary" disabled={state === "sending"}>
        {state === "sending" ? "Sending…" : "Submit application"} <span className="site-arrow" aria-hidden="true" />
      </button>
      {state === "error" && <p className="form-error" role="alert">Something went wrong. Please email info@erkdynamics.com.</p>}
    </form>
  );
}
