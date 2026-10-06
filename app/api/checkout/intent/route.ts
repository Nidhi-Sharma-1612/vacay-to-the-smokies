import { quoteStay } from "@/lib/booking/service";
import { readGuest, readStay } from "@/lib/booking/validate";
import { getStripe, toCents } from "@/lib/stripe";

/**
 * Step 2 of checkout: re-price the stay on the server and open a Stripe PaymentIntent for that exact amount.
 * The card is collected on our own page with the Payment Element, so guests never leave the site.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const stay = readStay(body?.stay);
  const { guest, errors } = readGuest(body?.guest);
  if (!stay) return Response.json({ error: "Your stay details are incomplete." }, { status: 400 });
  if (!guest) return Response.json({ error: "Please check your details.", fieldErrors: errors }, { status: 400 });

  const result = await quoteStay(stay);
  if (!result.ok) return Response.json({ error: result.error }, { status: 422 });
  const { cabin, quote } = result.data;

  const stripe = getStripe();
  if (!stripe) return Response.json({ mode: "demo", quote });

  try {
    const intent = await stripe.paymentIntents.create({
      amount: toCents(quote.total),
      currency: quote.currency.toLowerCase(),
      // Only payment methods that complete on this page (cards, wallets); 3-D Secure opens in a modal, so guests never leave the site.
      automatic_payment_methods: { enabled: true, allow_redirects: "never" },
      receipt_email: guest.email,
      description: `${cabin.name} · ${stay.checkin} → ${stay.checkout}`,
      metadata: {
        slug: stay.slug,
        checkin: stay.checkin,
        checkout: stay.checkout,
        adults: String(stay.adults),
        children: String(stay.children),
        pets: String(stay.pets),
        guest_email: guest.email,
      },
    });
    return Response.json({ mode: "stripe", quote, clientSecret: intent.client_secret, paymentIntentId: intent.id });
  } catch (error) {
    console.error("[checkout/intent]", error);
    return Response.json({ error: "We couldn't start a secure payment. Please try again." }, { status: 502 });
  }
}
