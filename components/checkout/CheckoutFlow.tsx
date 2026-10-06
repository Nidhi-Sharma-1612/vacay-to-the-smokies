"use client";

import { useMemo, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { ArrowLeft, Check, Loader2, Lock, Star } from "lucide-react";
import { PriceBreakdown } from "@/components/booking/PriceBreakdown";
import { formatLongDate, usd } from "@/lib/booking/dates";
import { guestLabel, searchQuery } from "@/lib/booking/search-params";
import type { GuestDetails, Quote, Stay } from "@/lib/booking/types";
import { PaymentStep } from "./PaymentStep";

export type CheckoutCabin = {
  slug: string;
  name: string;
  tagline: string;
  image: string;
  rating: number;
  reviewCount: number;
  cancellationPolicy: string | null;
  houseRules: string[];
};

type Props = { stay: Stay; cabin: CheckoutCabin; initialQuote: Quote; stripePublishableKey: string | null };

type Payment = { mode: "demo" } | { mode: "stripe"; clientSecret: string; paymentIntentId: string };

type FieldErrors = Partial<Record<keyof GuestDetails | "agree", string>>;

const STEPS = ["Your details", "Payment", "Confirmed"];

const input =
  "mt-1.5 w-full rounded-xl border border-linen-200 bg-white px-4 py-3 text-forest-900 outline-none transition-colors placeholder:text-ink-600/50 focus:border-forest-800 aria-[invalid=true]:border-rose-500";

function Field({ label, error, children, optional }: { label: string; error?: string; children: React.ReactNode; optional?: boolean }) {
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

export function CheckoutFlow({ stay, cabin, initialQuote, stripePublishableKey }: Props) {
  const router = useRouter();
  const [step, setStep] = useState<0 | 1>(0);
  const [quote, setQuote] = useState(initialQuote);
  const [guest, setGuest] = useState<GuestDetails>({ firstName: "", lastName: "", email: "", phone: "", arrivalTime: "", notes: "" });
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [payment, setPayment] = useState<Payment | null>(null);
  const stripePromise = useMemo(() => (stripePublishableKey ? loadStripe(stripePublishableKey) : null), [stripePublishableKey]);

  const update = (key: keyof GuestDetails) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setGuest((g) => ({ ...g, [key]: e.target.value }));

  async function continueToPayment(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (!agree) return setErrors({ agree: "Please agree to the house rules and cancellation policy." });
    setBusy(true);
    try {
      const res = await fetch("/api/checkout/intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stay, guest }),
      });
      const body = await res.json();
      if (!res.ok) {
        setErrors(body.fieldErrors ?? {});
        setFormError(body.error);
        return;
      }
      setErrors({});
      setQuote(body.quote);
      setPayment(body.mode === "stripe" ? { mode: "stripe", clientSecret: body.clientSecret, paymentIntentId: body.paymentIntentId } : { mode: "demo" });
      setStep(1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setFormError("We couldn't reach the booking service. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  /** Called once payment succeeds (or immediately in demo mode). */
  async function finalize(paymentIntentId?: string) {
    const res = await fetch("/api/checkout/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stay, guest, paymentIntentId }),
    });
    const body = await res.json();
    if (!res.ok) throw new Error(body.error ?? "We couldn't complete your reservation.");
    const q = new URLSearchParams({ ref: body.reference, name: guest.firstName, total: String(quote.total) });
    router.push(`/booking/confirmed${searchQuery({ ...stay, cabin: stay.slug })}&${q.toString()}`);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <Link
        href={`/cabins/${stay.slug}${searchQuery(stay)}`}
        className="inline-flex items-center gap-2 text-sm font-semibold text-forest-800 hover:text-ember-600"
      >
        <ArrowLeft className="size-4" aria-hidden /> Back to {cabin.name}
      </Link>
      <h1 className="mt-4 font-serif text-4xl font-medium tracking-tight text-forest-900">Confirm and pay</h1>

      <ol className="mt-6 flex flex-wrap items-center gap-3 text-sm font-semibold" aria-label="Checkout progress">
        {STEPS.map((label, i) => (
          <li key={label} className="flex items-center gap-3">
            <span
              className={`flex items-center gap-2 rounded-full px-3 py-1.5 ${
                i === step ? "bg-forest-900 text-cream-50" : i < step ? "bg-pine-600/15 text-pine-600" : "bg-white text-ink-600 ring-1 ring-linen-200"
              }`}
              aria-current={i === step ? "step" : undefined}
            >
              {i < step ? <Check className="size-4" aria-hidden /> : <span className="tabular-nums">{i + 1}</span>}
              {label}
            </span>
            {i < STEPS.length - 1 && <span className="h-px w-6 bg-linen-200" aria-hidden />}
          </li>
        ))}
      </ol>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_24rem] lg:gap-14">
        <div className="min-w-0">
          {step === 0 ? (
            <form onSubmit={continueToPayment} noValidate className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-forest-900/5 sm:p-8">
              <h2 className="font-serif text-2xl text-forest-900">Who&apos;s checking in?</h2>
              <p className="mt-1 text-ink-600">We&apos;ll send your confirmation and check-in instructions here.</p>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <Field label="First name" error={errors.firstName}>
                  <input className={input} value={guest.firstName} onChange={update("firstName")} autoComplete="given-name" aria-invalid={!!errors.firstName} />
                </Field>
                <Field label="Last name" error={errors.lastName}>
                  <input className={input} value={guest.lastName} onChange={update("lastName")} autoComplete="family-name" aria-invalid={!!errors.lastName} />
                </Field>
                <Field label="Email" error={errors.email}>
                  <input type="email" className={input} value={guest.email} onChange={update("email")} autoComplete="email" aria-invalid={!!errors.email} />
                </Field>
                <Field label="Mobile phone" error={errors.phone}>
                  <input type="tel" className={input} value={guest.phone} onChange={update("phone")} autoComplete="tel" aria-invalid={!!errors.phone} />
                </Field>
                <Field label="Estimated arrival" optional>
                  <select className={input} value={guest.arrivalTime} onChange={update("arrivalTime")}>
                    <option value="">Not sure yet</option>
                    {["4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM", "After 9:00 PM"].map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Anything we should know?" optional>
                    <textarea
                      rows={3}
                      className={input}
                      value={guest.notes}
                      onChange={update("notes")}
                      placeholder="Celebrating an anniversary? Bringing a pup? Let us know."
                    />
                  </Field>
                </div>
              </div>

              <label className="mt-6 flex items-start gap-3 rounded-2xl bg-linen-100/70 p-4 text-sm text-forest-800">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => {
                    setAgree(e.target.checked);
                    setErrors((er) => ({ ...er, agree: undefined }));
                  }}
                  className="mt-0.5 size-4 accent-forest-900"
                />
                <span>
                  I agree to the house rules and the cancellation policy below, and confirm the primary guest is 18 or older.
                </span>
              </label>
              {errors.agree && <p className="mt-2 text-sm text-rose-500">{errors.agree}</p>}
              {formError && <p className="mt-4 rounded-xl bg-rose-500/10 px-4 py-3 text-sm text-rose-500">{formError}</p>}

              <button
                type="submit"
                disabled={busy}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-ember-500 px-6 py-4 font-semibold text-cream-50 hover:bg-ember-600 disabled:opacity-60 sm:w-auto"
              >
                {busy && <Loader2 className="size-4 animate-spin" aria-hidden />}
                Continue to payment
              </button>
            </form>
          ) : (
            <div className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-forest-900/5 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-serif text-2xl text-forest-900">Payment</h2>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-600">
                    <Lock className="size-4 text-pine-600" aria-hidden /> Encrypted and processed securely on this page.
                  </p>
                </div>
                <button type="button" onClick={() => setStep(0)} className="text-sm font-semibold text-forest-800 underline underline-offset-4">
                  Edit details
                </button>
              </div>
              <p className="mt-4 rounded-xl bg-linen-100/70 px-4 py-3 text-sm text-forest-800">
                {guest.firstName} {guest.lastName} · {guest.email} · {guest.phone}
              </p>

              {payment?.mode === "stripe" && stripePromise ? (
                <Elements
                  stripe={stripePromise}
                  options={{
                    clientSecret: payment.clientSecret,
                    appearance: {
                      theme: "stripe",
                      variables: {
                        colorPrimary: "#24372d",
                        colorText: "#1e1e1c",
                        colorDanger: "#e0566c",
                        borderRadius: "12px",
                        fontFamily: "Manrope, system-ui, sans-serif",
                      },
                    },
                  }}
                >
                  <PaymentStep total={quote.total} onPaid={(id) => finalize(id)} />
                </Elements>
              ) : (
                <DemoPayment total={quote.total} onConfirm={() => finalize()} />
              )}
            </div>
          )}
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-forest-900/5">
            <div className="flex gap-4 border-b border-linen-200 p-5">
              <div className="relative size-24 shrink-0 overflow-hidden rounded-2xl">
                <Image src={cabin.image} alt={cabin.name} fill sizes="96px" className="object-cover" />
              </div>
              <div>
                <p className="text-sm text-ember-600">{cabin.tagline}</p>
                <p className="font-serif text-xl text-forest-900">{cabin.name}</p>
                <p className="mt-1 flex items-center gap-1 text-sm text-ink-600">
                  <Star className="size-3.5 fill-ember-500 text-ember-500" aria-hidden />
                  {cabin.rating.toFixed(2)} ({cabin.reviewCount})
                </p>
              </div>
            </div>
            <dl className="grid grid-cols-2 gap-4 border-b border-linen-200 p-5 text-sm">
              <div>
                <dt className="text-ink-600">Check-in</dt>
                <dd className="font-semibold text-forest-900">{formatLongDate(stay.checkin)}</dd>
              </div>
              <div>
                <dt className="text-ink-600">Checkout</dt>
                <dd className="font-semibold text-forest-900">{formatLongDate(stay.checkout)}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-ink-600">Guests</dt>
                <dd className="font-semibold text-forest-900">{guestLabel(stay)}</dd>
              </div>
            </dl>
            <div className="p-5">
              <PriceBreakdown quote={quote} compact />
            </div>
          </div>
          {cabin.cancellationPolicy && (
            <div className="mt-5 rounded-3xl bg-white p-5 text-sm ring-1 ring-forest-900/5">
              <p className="font-semibold text-forest-900">Cancellation policy</p>
              <p className="mt-2 leading-relaxed text-ink-600">{cabin.cancellationPolicy}</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

function DemoPayment({ total, onConfirm }: { total: number; onConfirm: () => Promise<void> }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  return (
    <div className="mt-6">
      <div className="rounded-2xl border border-dashed border-ember-300 bg-ember-500/5 p-5 text-sm text-forest-800">
        <p className="font-semibold">Demo mode: no card will be charged</p>
        <p className="mt-1 text-ink-600">
          Add your Stripe keys to <code className="rounded bg-linen-100 px-1">.env.local</code> to collect payment here with Stripe&apos;s secure card form.
        </p>
      </div>
      {error && <p className="mt-4 rounded-xl bg-rose-500/10 px-4 py-3 text-sm text-rose-500">{error}</p>}
      <button
        type="button"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          setError(null);
          try {
            await onConfirm();
          } catch (e) {
            setError(e instanceof Error ? e.message : "Something went wrong.");
            setBusy(false);
          }
        }}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-ember-500 px-6 py-4 font-semibold text-cream-50 hover:bg-ember-600 disabled:opacity-60"
      >
        {busy && <Loader2 className="size-4 animate-spin" aria-hidden />}
        Confirm reservation · {usd(total)}
      </button>
    </div>
  );
}
