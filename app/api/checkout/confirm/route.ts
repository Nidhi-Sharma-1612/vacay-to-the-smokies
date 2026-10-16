import { site } from "@/data/site";
import { bookingSource, createReservation, quoteStay } from "@/lib/booking/service";
import { readGuest, readStay } from "@/lib/booking/validate";

/**
 * Final step: create the reservation.
 * No payment method is connected yet, so this only completes demo reservations. With live OwnerRez
 * data it refuses rather than creating real bookings that haven't been paid for.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const stay = readStay(body?.stay);
  const { guest } = readGuest(body?.guest);
  if (!stay || !guest) return Response.json({ error: "Your booking details are incomplete." }, { status: 400 });

  if (bookingSource() === "live") {
    return Response.json(
      { error: `Online payment isn't available yet. Please call us at ${site.phone} to complete your reservation.` },
      { status: 503 },
    );
  }

  const quote = await quoteStay(stay);
  if (!quote.ok) return Response.json({ error: quote.error }, { status: 422 });
  const reservation = await createReservation(stay, guest, { processor: "none", amount: quote.data.quote.total });
  return reservation.ok
    ? Response.json({ reference: reservation.data.reference })
    : Response.json({ error: reservation.error }, { status: 502 });
}
