import { quoteStay } from "@/lib/booking/service";
import { readStay } from "@/lib/booking/validate";

export async function POST(request: Request) {
  const stay = readStay(await request.json().catch(() => null));
  if (!stay) return Response.json({ error: "Choose your dates and guests." }, { status: 400 });
  const result = await quoteStay(stay);
  return result.ok
    ? Response.json({ quote: result.data.quote })
    : Response.json({ error: result.error }, { status: 422 });
}
