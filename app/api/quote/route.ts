import { supplyOptions } from "../../supply-options";

import zipCoverage from "./zip-coverage.json";

// 2025 Census Gazetteer ZCTA representative points, classified by great-circle
// distance from 66102 (75 miles inclusive). Each ZIP3 row is indexed by ZIP2.
// I = inside, O = outside, and missing or ? = manual review.
const coverageByPrefix: Record<string, string> = zipCoverage;

const emailPattern = /^[^\s@,<>]+@[^\s@,<>]+\.[^\s@,<>]+$/;

function customerThankYou(propertyZip: string, outside: boolean) {
  const subject = "Thank you for your estimate request";
  const receipt = `Thank you for requesting an estimate from Northern Lights Installation. We received your estimate request for the property in ZIP code ${propertyZip}.`;
  const nextStep = outside ? "You’ll also receive a note about service availability for this ZIP code." : "We’ll review your project details and follow up about your estimate. You can reply here with any corrections or a photo of the property.";
  const signature = "Northern Lights Installation";

  return {
    subject,
    text: [receipt, nextStep, signature].join("\n\n"),
    html: `<!doctype html>
      <html lang="en"><body style="margin:0;padding:24px;color:#203b32;font:16px/1.6 Arial,Helvetica,sans-serif">
        <div style="max-width:560px;border-top:3px solid #c4a465">
          <p>${receipt}</p>
          <p>${nextStep}</p>
          <p style="color:#153c32;font-family:Georgia,serif">${signature}</p>
        </div>
      </body></html>`,
  };
}

export async function POST(request: Request) {
  const fields: Record<string, unknown> | null = await request.json().catch(() => null);
  if (!fields || typeof fields !== "object" || Array.isArray(fields)) {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const { name, email, phone = "", location, service, supplies = "", message = "", website } = fields;
  if (website) {
    return Response.json({ ok: true });
  }

  if (
    typeof name !== "string" || !name.trim() || name.length > 120 ||
    typeof email !== "string" || email.length > 254 || !emailPattern.test(email) ||
    typeof phone !== "string" || phone.length > 50 ||
    typeof location !== "string" || !/^\d{5}(-\d{4})?$/.test(location) || /\s/.test(location) ||
    typeof supplies !== "string" || (supplies !== "" && !supplyOptions.includes(supplies)) ||
    typeof service !== "string" || !service.trim() || service.length > 100 ||
    typeof message !== "string" || message.length > 3000
  ) {
    return Response.json({ error: "Invalid quote request." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const sender = process.env.RESEND_FROM_EMAIL;
  const quoteInbox = process.env.QUOTE_INBOX;
  if (!apiKey || !sender || !quoteInbox) {
    console.error("Quote email configuration is missing.");
    return Response.json({ error: "Quote delivery is unavailable." }, { status: 503 });
  }

  const zip = location.slice(0, 5);
  const coverage = coverageByPrefix[zip.slice(0, 3)]?.[Number(zip.slice(3))];
  const outside = coverage === "O";

  try {
    const delivery = await fetch("https://api.resend.com/emails/batch", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        {
          from: sender,
          to: [quoteInbox],
          reply_to: email,
          subject: "New estimate request | Northern Lights Installation",
          text: [
            `Name: ${name.trim()}`,
            `Email: ${email}`,
            `Phone: ${phone.trim() || "Not provided"}`,
            `Property ZIP code: ${location}`,
            `Service area: ${outside ? "Outside the 75-mile radius" : coverage === "I" ? "Within the 75-mile radius" : "ZIP not located — please review"}`,
            `Service: ${service.trim()}`,
            ...(fields.veteranDiscount === "requested" ? ["Veteran discount requested: Yes"] : []),
            `Lights and décor supplied by: ${supplies || "Not specified"}`,
            "",
            message.trim() || "No project details provided.",
          ].join("\n"),
        },
        {
          from: sender,
          to: [email],
          reply_to: quoteInbox,
          ...customerThankYou(location, outside),
        },
        ...(outside ? [{
          from: sender,
          to: [email],
          reply_to: quoteInbox,
          subject: "Service availability for your property",
          text: [
            "Thanks for considering Northern Lights Installation.",
            `We currently install within 75 miles of Kansas City, Kansas (66102). Based on the ZIP code you entered (${zip}), your property appears to be outside our service area, so we’re unable to schedule an installation there at this time.`,
            "If the ZIP code was entered incorrectly or your property is near the boundary, reply with the property location and we’ll double-check it for you.",
            "Christopher Gray\nNorthern Lights Installation",
          ].join("\n\n"),
        }] : []),
      ]),
      signal: AbortSignal.timeout(10000),
    });

    if (delivery.ok) {
      return Response.json({ ok: true });
    }
    console.error("Resend rejected quote delivery.", delivery.status);
  } catch {
    console.error("The quote delivery request failed.");
  }

  return Response.json({ error: "Could not send quote request." }, { status: 502 });
}