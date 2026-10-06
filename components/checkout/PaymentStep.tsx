"use client";

import { useState, type FormEvent } from "react";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { Loader2, Lock } from "lucide-react";
import { usd } from "@/lib/booking/dates";

type Props = { total: number; onPaid: (paymentIntentId: string) => Promise<void> };

/** Stripe Payment Element rendered inside our checkout page; no redirect to a hosted payment page. */
export function PaymentStep({ total, onPaid }: Props) {
  const stripe = useStripe();
  const elements = useElements();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setBusy(true);
    setError(null);
    const { error: stripeError, paymentIntent } = await stripe.confirmPayment({ elements, redirect: "if_required" });
    if (stripeError) {
      setError(stripeError.message ?? "Your payment couldn't be processed.");
      setBusy(false);
      return;
    }
    if (paymentIntent?.status !== "succeeded") {
      setError("Your payment is still processing. We'll email you as soon as it completes.");
      setBusy(false);
      return;
    }
    try {
      await onPaid(paymentIntent.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "We couldn't complete your reservation.");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-6">
      <PaymentElement options={{ layout: "tabs" }} />
      {error && <p className="mt-4 rounded-xl bg-rose-500/10 px-4 py-3 text-sm text-rose-500">{error}</p>}
      <button
        type="submit"
        disabled={!stripe || busy}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-ember-500 px-6 py-4 font-semibold text-cream-50 hover:bg-ember-600 disabled:opacity-60"
      >
        {busy ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Lock className="size-4" aria-hidden />}
        Pay {usd(total)} and reserve
      </button>
    </form>
  );
}
