import { quoteStay } from "@/lib/booking/service";
import { readGuest, readStay } from "@/lib/booking/validate";

/**
 * Step 1 → 2 of checkout: validate the guest's details and re-price the stay on the server,
 * so the payment step always shows the current total.
 * The payment method is not chosen yet; when it is, this is where its payment session gets created.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const stay = readStay(body?.stay);
  const { guest, errors } = readGuest(body?.guest);
  if (!stay) return Response.json({ error: "Your stay details are incomplete." }, { status: 400 });
  if (!guest) return Response.json({ error: "Please check your details.", fieldErrors: errors }, { status: 400 });

  const result = await quoteStay(stay);
  if (!result.ok) return Response.json({ error: result.error }, { status: 422 });
  return Response.json({ quote: result.data.quote });
}
