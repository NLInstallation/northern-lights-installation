import { supplyOptions } from "../../supply-options";

const emailPattern = /^[^\s@,<>]+@[^\s@,<>]+\.[^\s@,<>]+$/;

function customerThankYou(propertyZip: string) {
  const subject = "Your estimate request was received";
  const receipt = `Thanks for reaching out to Northern Lights Installation. We received your estimate request for the property in ZIP code ${propertyZip}.`;
  const nextStep = "We’ll review your project details and follow up about your estimate. You can reply here with any corrections or a photo of the property.";
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
          ...customerThankYou(location),
        },
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
