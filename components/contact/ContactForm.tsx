"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { cabins } from "@/data/cabins";
import { site } from "@/data/site";

const TOPICS = ["Booking question", "Pets & special requests", "Celebrating an occasion", "Current reservation", "Something else"];

type FieldName = "name" | "email" | "phone" | "topic" | "cabin" | "dates" | "message";
type Errors = Partial<Record<FieldName, string>>;

const input =
  "mt-1.5 w-full rounded-xl border border-linen-200 bg-white px-4 py-3 text-forest-900 outline-none transition-colors placeholder:text-ink-600/50 focus:border-forest-800 aria-[invalid=true]:border-rose-500";

function Field({ label, error, optional, children }: { label: string; error?: string; optional?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-forest-900">
        {label} {optional && <span className="font-normal text-ink-600">(optional)</span>}
      </span>
      {children}
      {error && <span className="mt-1 block text-sm text-rose-500">{error}</span>}
    </label>
  );
}

export function ContactForm() {
  const [values, setValues] = useState<Record<FieldName, string>>({ name: "", email: "", phone: "", topic: TOPICS[0], cabin: "", dates: "", message: "" });
  const [company, setCompany] = useState(""); // honeypot
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "demo">("idle");

  const set = (k: FieldName) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    setErrors((er) => ({ ...er, [k]: undefined }));
  };

  async function submit(e: FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setFormError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, company }),
      });
      const body = await res.json();
      if (!res.ok) {
        setErrors(body.fieldErrors ?? {});
        setFormError(body.error);
        setStatus("idle");
        return;
      }
      setStatus(body.mode === "demo" ? "demo" : "sent");
    } catch {
      setFormError(`We couldn't send your message. Please call us at ${site.phone}.`);
      setStatus("idle");
    }
  }

  if (status === "sent" || status === "demo") {
    return (
      <div className="flex flex-col items-center rounded-3xl bg-white p-8 text-center shadow-soft ring-1 ring-forest-900/5 sm:p-12" role="status">
        <span className="grid size-14 place-items-center rounded-full bg-pine-600/15 text-pine-600">
          <CheckCircle2 className="size-7" aria-hidden />
        </span>
        <h2 className="mt-5 font-serif text-3xl text-forest-900">Thanks, {values.name.split(" ")[0]}!</h2>
        <p className="mt-3 max-w-md text-ink-600">
          Your message is on its way to your hosts. We&apos;ll reply to <span className="font-semibold text-forest-900 [overflow-wrap:anywhere]">{values.email}</span>.
          For anything urgent, call{" "}
          <a href={site.phoneHref} className="font-semibold text-forest-900 underline underline-offset-2">
            {site.phone}
          </a>
          .
        </p>
        {status === "demo" && (
          <p className="mt-5 rounded-xl bg-linen-100 px-4 py-2 text-xs text-ink-600">
            Demo mode: add RESEND_API_KEY to .env.local to deliver messages by email.
          </p>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-forest-900/5 sm:p-8">
      <h2 className="font-serif text-2xl text-forest-900 sm:text-3xl">Send us a message</h2>
      <p className="mt-1 text-ink-600">Questions about a cabin, pets, or planning a special trip? We&apos;re happy to help.</p>

      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <Field label="Your name" error={errors.name}>
          <input className={input} value={values.name} onChange={set("name")} autoComplete="name" aria-invalid={!!errors.name} />
        </Field>
        <Field label="Email" error={errors.email}>
          <input type="email" className={input} value={values.email} onChange={set("email")} autoComplete="email" aria-invalid={!!errors.email} />
        </Field>
        <Field label="Phone" optional>
          <input type="tel" className={input} value={values.phone} onChange={set("phone")} autoComplete="tel" />
        </Field>
        <Field label="What's it about?">
          <select className={input} value={values.topic} onChange={set("topic")}>
            {TOPICS.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </Field>
        <Field label="Cabin" optional>
          <select className={input} value={values.cabin} onChange={set("cabin")}>
            <option value="">Not sure yet</option>
            {cabins.map((c) => (
              <option key={c.slug}>{c.name}</option>
            ))}
          </select>
        </Field>
        <Field label="Travel dates" optional>
          <input className={input} value={values.dates} onChange={set("dates")} placeholder="e.g. Oct 10–13" />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Message" error={errors.message}>
            <textarea
              rows={5}
              className={input}
              value={values.message}
              onChange={set("message")}
              aria-invalid={!!errors.message}
              placeholder="Tell us what you're planning…"
            />
          </Field>
        </div>
        {/* Honeypot for bots; hidden from people and screen readers. */}
        <input
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="absolute -left-[9999px] size-px opacity-0"
        />
      </div>

      {formError && <p className="mt-5 rounded-xl bg-rose-500/10 px-4 py-3 text-sm text-rose-500">{formError}</p>}

      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-ember-500 px-7 py-4 font-semibold text-cream-50 transition-colors hover:bg-ember-600 disabled:opacity-60 sm:w-auto"
      >
        {status === "sending" ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Send className="size-4" aria-hidden />}
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
