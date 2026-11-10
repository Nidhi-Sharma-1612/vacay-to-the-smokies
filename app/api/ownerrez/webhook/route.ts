import { revalidateTag } from "next/cache";
import { LISTINGS_TAG } from "@/lib/ownerrez-listings";

/**
 * OwnerRez webhook (configured on the owner's OwnerRez OAuth app, basic auth). When a property
 * changes in OwnerRez — e.g. its description is edited — the cached listing copy is dropped so the
 * next page view shows the update. Any 2xx tells OwnerRez the delivery succeeded.
 */
export async function POST(request: Request) {
  const user = process.env.OWNERREZ_WEBHOOK_USER;
  const password = process.env.OWNERREZ_WEBHOOK_PASSWORD;
  const expected = user && password ? `Basic ${Buffer.from(`${user}:${password}`).toString("base64")}` : null;
  if (!expected || request.headers.get("authorization") !== expected) {
    return new Response("Unauthorized", { status: 401 });
  }

  const event = (await request.json().catch(() => null)) as { action?: string; entity_type?: string } | null;
  if (event?.entity_type === "property" || event?.action === "webhook_test") {
    // Expire right away so the owner sees their edit on the next page load.
    revalidateTag(LISTINGS_TAG, { expire: 0 });
  }
  return Response.json({ ok: true });
}
