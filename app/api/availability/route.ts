import { cabins, getCabin } from "@/data/cabins";
import { getCalendar, getCombinedCalendar } from "@/lib/booking/service";

/**
 * GET /api/availability?slug=<cabin>   one cabin's calendar
 * GET /api/availability?type=forest     combined calendar for a cabin style
 * GET /api/availability                 combined calendar for every cabin
 */
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const slug = params.get("slug");
  const type = params.get("type");
  try {
    if (slug) {
      const cabin = getCabin(slug);
      if (!cabin) return Response.json({ error: "Unknown cabin." }, { status: 404 });
      return Response.json(await getCalendar(cabin));
    }
    const list = type === "forest" || type === "parkway" ? cabins.filter((c) => c.category === type) : cabins;
    return Response.json(await getCombinedCalendar(list, type ?? "all"));
  } catch (error) {
    console.error("[availability]", error);
    return Response.json({ error: "Availability is temporarily unavailable." }, { status: 503 });
  }
}
