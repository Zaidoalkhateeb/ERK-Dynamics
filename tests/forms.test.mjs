import assert from "node:assert/strict";
import { test, afterEach } from "node:test";
import {
  validateContact,
  enquiryIntent,
  createReference,
  submitEnquiry,
} from "../src/lib/forms.ts";

const originalFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = originalFetch;
});
const enquiry = () => {
  const form = new FormData();
  for (const [key, value] of Object.entries({
    name: "Client",
    email: "client@example.com",
    company: "Example",
    country: "Türkiye",
    interest: "Request a demonstration",
  }))
    form.set(key, value);
  return form;
};
test("contact validation rejects blanks and malformed email", () => {
  assert.deepEqual(validateContact(enquiry()), {});
  const form = enquiry();
  form.set("name", " ");
  form.set("email", "not-an-address");
  assert.deepEqual(Object.keys(validateContact(form)), ["name", "email"]);
});
test("routing and references distinguish enquiry types", () => {
  assert.equal(enquiryIntent("Request a demonstration"), "demo");
  assert.equal(enquiryIntent("Service and product support"), "support");
  assert.equal(enquiryIntent("General enquiry"), "general");
  assert.match(createReference(), /^ERK-\d{8}-[A-F\d]{8}$/);
  assert.notEqual(createReference(), createReference());
});
test("submission accepts explicit JSON acknowledgement", async () => {
  globalThis.fetch = async (url, options) => {
    assert.equal(url, "/send.php");
    assert.equal(options.method, "POST");
    assert.ok(options.body instanceof FormData);
    assert.ok(options.signal instanceof AbortSignal);
    return Response.json({ ok: true });
  };
  await submitEnquiry(enquiry());
});
test("submission rejects HTML, mail failures, malformed JSON and negative acknowledgements", async () => {
  for (const response of [
    new Response("<html>preview</html>", { headers: { "content-type": "text/html" } }),
    Response.json({ ok: false }),
    Response.json({ error: "mail failed" }, { status: 500 }),
    new Response("{", { headers: { "content-type": "application/json" } }),
  ]) {
    globalThis.fetch = async () => response;
    await assert.rejects(submitEnquiry(enquiry()));
  }
});
test("submission surfaces network failure", async () => {
  globalThis.fetch = async () => {
    throw new TypeError("offline");
  };
  await assert.rejects(submitEnquiry(enquiry()), /offline/);
});
