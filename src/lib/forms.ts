export type FormErrors = Record<string, string>;

export function validateContact(data: FormData): FormErrors {
  const errors: FormErrors = {};
  const value = (key: string) => String(data.get(key) || "").trim();
  if (!value("name")) errors.name = "Enter your full name.";
  if (!/^\S+@\S+\.\S+$/.test(value("email"))) errors.email = "Enter a valid email address.";
  if (!value("company")) errors.company = "Enter your company name.";
  if (!value("country")) errors.country = "Select your country.";
  if (!value("interest")) errors.interest = "Select how we can help.";
  return errors;
}

export function enquiryIntent(interest: string): string {
  const intents: [string, string][] = [
    ["demonstration", "demo"],
    ["quotation", "quote"],
    ["technical", "technical"],
    ["support", "support"],
    ["partnership", "partnership"],
  ];
  return intents.find(([keyword]) => interest.toLowerCase().includes(keyword))?.[1] ?? "general";
}

export function createReference(): string {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  return `ERK-${date}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
}

/** A 200 HTML response (for example on a static preview) is not a delivered enquiry. */
export async function submitEnquiry(data: FormData): Promise<void> {
  const response = await fetch("/send.php", {
    method: "POST",
    body: data,
    signal: AbortSignal.timeout(15_000),
    headers: { Accept: "application/json" },
  });
  if (!response.ok || !response.headers.get("content-type")?.includes("application/json")) {
    throw new Error("The mail endpoint did not accept the enquiry.");
  }
  const result: unknown = await response.json();
  if (!result || typeof result !== "object" || !("ok" in result) || result.ok !== true) {
    throw new Error("The mail endpoint did not confirm delivery.");
  }
}
