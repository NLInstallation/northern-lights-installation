import { supplyOptions } from "../../supply-options";

const emailPattern = /^[^\s@,<>]+@[^\s@,<>]+\.[^\s@,<>]+$/;

function customerThankYou() {
  const heading = "Thanks for requesting a quote!";
  const nextStep = "We’ve received your holiday lighting or décor request. We’ll review the details you shared and follow up with you about your estimate.";
  const photoTip = "If you have a photo of your property or a holiday display you love, reply to this email with it. It’ll help us picture what you have in mind.";
  const brand = "Northern Lights Installation";

  return {
    subject: "Thanks for requesting a quote from Northern Lights Installation",
    text: [heading, nextStep, photoTip, brand].join("\n\n"),
    html: `<!doctype html>
      <html lang="en"><head><meta name="viewport" content="width=device-width,initial-scale=1"></head>
      <body style="margin:0;background:#f3f0e8;color:#203b32;font-family:Arial,Helvetica,sans-serif">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f0e8">
        <tr><td align="center" style="padding:24px 12px">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fffdf7;text-align:left">
            <tr><td bgcolor="#153c32" style="padding:32px 28px;background:#153c32;border-top:4px solid #c4a465">
              <p style="margin:0 0 6px;color:#f2dab0;font:30px Georgia,serif">Northern Lights</p>
              <p style="margin:0;color:#fffaf0;font:12px Arial,sans-serif;letter-spacing:3px">INSTALLATION</p>
            </td></tr>
            <tr><td style="padding:32px 28px 20px">
              <h1 style="margin:0 0 16px;color:#153c32;font:32px/1.15 Georgia,serif">${heading}</h1>
              <p style="margin:0;color:#30463d;font:16px/1.6 Arial,sans-serif">${nextStep}</p>
            </td></tr>
            <tr><td style="padding:0 28px 32px">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
                <td bgcolor="#f2eee3" style="padding:18px 20px;border-left:3px solid #b69a60;color:#30463d;font:15px/1.6 Arial,sans-serif">${photoTip}</td>
              </tr></table>
            </td></tr>
            <tr><td style="border-top:1px solid #ded8c8;padding:18px 28px;color:#4c5f54;font:13px/1.6 Arial,sans-serif">
              <a href="https://www.northernlightsinstallation.com/" style="color:#28513e">${brand}</a><br>Kansas City and surrounding communities
            </td></tr>
          </table>
        </td></tr>
      </table></body></html>`,
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
          ...customerThankYou(),
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
