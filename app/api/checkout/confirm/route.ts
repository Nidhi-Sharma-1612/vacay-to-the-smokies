import { site } from "@/data/site";
import { createReservation, quoteStay } from "@/lib/booking/service";
import { readGuest, readStay } from "@/lib/booking/validate";
import { getStripe } from "@/lib/stripe";

/**
 * Final step: verify the payment on the server, then create the reservation in the booking system.
 * In demo mode (no Stripe key) the reservation is created without payment.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const stay = readStay(body?.stay);
  const { guest } = readGuest(body?.guest);
  if (!stay || !guest) return Response.json({ error: "Your booking details are incomplete." }, { status: 400 });

  const stripe = getStripe();
  if (!stripe) {
    const quote = await quoteStay(stay);
    if (!quote.ok) return Response.json({ error: quote.error }, { status: 422 });
    const reservation = await createReservation(stay, guest, { processor: "none", amount: quote.data.quote.total });
    return reservation.ok
      ? Response.json({ reference: reservation.data.reference })
      : Response.json({ error: reservation.error }, { status: 502 });
  }

  const paymentIntentId = typeof body?.paymentIntentId === "string" ? body.paymentIntentId : "";
  if (!paymentIntentId) return Response.json({ error: "Missing payment." }, { status: 400 });

  const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
  const m = intent.metadata;
  const matches =
    m.slug === stay.slug &&
    m.checkin === stay.checkin &&
    m.checkout === stay.checkout &&
    m.adults === String(stay.adults) &&
    m.children === String(stay.children) &&
    m.pets === String(stay.pets);
  if (!matches) return Response.json({ error: "Payment doesn't match this stay." }, { status: 400 });
  if (intent.status !== "succeeded") return Response.json({ error: "Your payment hasn't completed yet." }, { status: 402 });

  // Safe to retry: a reservation already created for this payment is returned as-is.
  if (m.reservation) return Response.json({ reference: m.reservation });

  const reservation = await createReservation(stay, guest, {
    processor: "stripe",
    reference: intent.id,
    amount: intent.amount_received / 100,
  });
  if (!reservation.ok) {
    console.error("[checkout/confirm] paid but reservation failed", intent.id, reservation.error);
    return Response.json(
      {
        error: `Your payment went through, but we couldn't finish the reservation automatically. We've been notified and will confirm by email shortly, or call us at ${site.phone}.`,
      },
      { status: 502 },
    );
  }
  await stripe.paymentIntents.update(intent.id, { metadata: { reservation: reservation.data.reference } });
  return Response.json({ reference: reservation.data.reference });
}
