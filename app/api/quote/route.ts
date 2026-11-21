const emailPattern = /^[^\s@,<>]+@[^\s@,<>]+\.[^\s@,<>]+$/;

export async function POST(request: Request) {
  const fields: Record<string, unknown> | null = await request.json().catch(() => null);
  if (!fields || typeof fields !== "object" || Array.isArray(fields)) {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const { name, email, phone = "", service, message = "", website } = fields;
  if (website) {
    return Response.json({ ok: true });
  }

  if (
    typeof name !== "string" || !name.trim() || name.length > 120 ||
    typeof email !== "string" || email.length > 254 || !emailPattern.test(email) ||
    typeof phone !== "string" || phone.length > 50 ||
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
    const delivery = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: sender,
        to: [quoteInbox],
        reply_to: email,
        subject: "New estimate request | Northern Lights Installation",
        text: [
          `Name: ${name.trim()}`,
          `Email: ${email}`,
          `Phone: ${phone.trim() || "Not provided"}`,
          `Service: ${service.trim()}`,
          "",
          message.trim() || "No project details provided.",
        ].join("\n"),
      }),
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
