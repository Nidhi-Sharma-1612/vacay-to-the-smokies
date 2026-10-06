import { site } from "@/data/site";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Fields = { name: string; email: string; phone: string; topic: string; cabin: string; dates: string; message: string };

const escape = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/**
 * Contact form submissions. Emails the hosts through Resend when RESEND_API_KEY is set;
 * otherwise runs in demo mode (validates and logs, nothing is sent).
 */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return Response.json({ error: "Something went wrong. Please try again." }, { status: 400 });

  // Honeypot: real visitors never see or fill this field.
  if (typeof body.company === "string" && body.company) return Response.json({ ok: true, mode: "sent" });

  const str = (k: keyof Fields, max: number) => (typeof body[k] === "string" ? (body[k] as string).trim().slice(0, max) : "");
  const f: Fields = {
    name: str("name", 100),
    email: str("email", 160),
    phone: str("phone", 40),
    topic: str("topic", 60),
    cabin: str("cabin", 80),
    dates: str("dates", 80),
    message: str("message", 3000),
  };

  const fieldErrors: Partial<Record<keyof Fields, string>> = {};
  if (!f.name) fieldErrors.name = "Please enter your name.";
  if (!EMAIL.test(f.email)) fieldErrors.email = "Please enter a valid email address.";
  if (f.message.length < 10) fieldErrors.message = "Please tell us a little more (at least 10 characters).";
  if (Object.keys(fieldErrors).length) return Response.json({ error: "Please check the highlighted fields.", fieldErrors }, { status: 400 });

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.info("[contact] demo mode, message not sent:", { ...f, message: f.message.slice(0, 200) });
    return Response.json({ ok: true, mode: "demo" });
  }

  const rows = [
    ["Name", f.name],
    ["Email", f.email],
    ["Phone", f.phone],
    ["Topic", f.topic],
    ["Cabin", f.cabin],
    ["Dates", f.dates],
  ].filter(([, v]) => v);
  const html = `<h2>New message from vacaytothesmokies.com</h2>
<table cellpadding="6">${rows.map(([k, v]) => `<tr><td><strong>${k}</strong></td><td>${escape(v)}</td></tr>`).join("")}</table>
<p style="white-space:pre-wrap">${escape(f.message)}</p>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL || "Vacay To The Smokies <onboarding@resend.dev>",
      to: [process.env.CONTACT_TO_EMAIL || site.email],
      reply_to: f.email,
      subject: `${f.topic || "Website enquiry"} from ${f.name}`,
      html,
    }),
  });
  if (!res.ok) {
    console.error("[contact] Resend error", res.status, await res.text().catch(() => ""));
    return Response.json({ error: `We couldn't send your message. Please call us at ${site.phone} or email ${site.email}.` }, { status: 502 });
  }
  return Response.json({ ok: true, mode: "sent" });
}
