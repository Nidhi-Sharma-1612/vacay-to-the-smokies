import type { Metadata } from "next";
import Link from "next/link";
import { CalendarX2 } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { CheckoutFlow } from "@/components/checkout/CheckoutFlow";
import { parseStay, searchQuery } from "@/lib/booking/search-params";
import { quoteStay } from "@/lib/booking/service";

export const metadata: Metadata = {
  title: "Checkout | Vacay To The Smokies",
  robots: { index: false },
};

export default async function CheckoutPage({ searchParams }: PageProps<"/checkout">) {
  const stay = parseStay(await searchParams);
  const result = stay ? await quoteStay(stay) : null;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-linen-100/50 pt-20">
        {stay && result?.ok ? (
          <CheckoutFlow
            stay={stay}
            initialQuote={result.data.quote}
            cabin={{
              slug: result.data.cabin.slug,
              name: result.data.cabin.name,
              tagline: result.data.cabin.tagline,
              image: result.data.cabin.image,
              rating: result.data.cabin.details.rating,
              reviewCount: result.data.cabin.details.reviewCount,
              cancellationPolicy: result.data.cabin.details.cancellationPolicy,
              houseRules: result.data.cabin.details.houseRules,
            }}
            stripePublishableKey={process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? null}
          />
        ) : (
          <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-28 text-center">
            <CalendarX2 className="size-12 text-ember-500" aria-hidden />
            <h1 className="mt-6 font-serif text-3xl text-forest-900">
              {stay ? "Those dates just became unavailable" : "Let's pick your stay first"}
            </h1>
            <p className="mt-3 text-ink-600">
              {result && !result.ok ? result.error : "Choose a cabin and dates to start your reservation."}
            </p>
            <Link
              href={stay ? `/cabins/${stay.slug}${searchQuery({ adults: stay.adults, children: stay.children, pets: stay.pets })}#book` : "/cabins"}
              className="mt-8 rounded-full bg-forest-900 px-6 py-3 font-semibold text-cream-50 hover:bg-ember-500"
            >
              {stay ? "Choose new dates" : "Browse cabins"}
            </Link>
          </div>
        )}
      </main>
    </>
  );
}
