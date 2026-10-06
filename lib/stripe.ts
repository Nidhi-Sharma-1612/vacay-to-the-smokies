import "server-only";
import Stripe from "stripe";

let client: Stripe | null = null;

/** Returns a Stripe client when STRIPE_SECRET_KEY is set, otherwise null (demo checkout). */
export function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) return null;
  client ??= new Stripe(process.env.STRIPE_SECRET_KEY);
  return client;
}

export const toCents = (amount: number) => Math.round(amount * 100);
