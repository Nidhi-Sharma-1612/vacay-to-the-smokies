import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { cabins } from "@/data/cabins";
import { site } from "@/data/site";
import { formatTime } from "@/lib/booking/dates";

export const metadata: Metadata = { title: "Booking policies | Vacay To The Smokies" };

export default function PoliciesPage() {
  const sample = cabins[0].details;
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 pt-32 pb-24 sm:px-6">
        <p className="eyebrow text-ember-500">Good to know</p>
        <h1 className="mt-3 font-serif text-4xl font-medium tracking-tight text-forest-900 sm:text-5xl">Booking policies</h1>

        <div className="mt-12 space-y-12 leading-relaxed text-ink-600">
          <section>
            <h2 className="font-serif text-2xl text-forest-900">Cancellation</h2>
            <p className="mt-3">{sample.cancellationPolicy}</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-forest-900">Check-in & checkout</h2>
            <p className="mt-3">
              Check-in is after {formatTime(sample.checkIn)} and checkout is by {formatTime(sample.checkOut)}. Most cabins have self check-in;
              instructions and the exact address are sent before arrival.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-forest-900">House rules</h2>
            <ul className="mt-3 list-disc space-y-1.5 pl-5">
              <li>No smoking, parties or events.</li>
              <li>The primary renter must be at least 18 years old.</li>
              <li>Pets are welcome with prior approval and a pet fee. Please crate pets if left unattended.</li>
              <li>Maximum occupancy is listed on each cabin and can&apos;t be exceeded.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-forest-900">Payments</h2>
            <p className="mt-3">
              Payment is taken securely on this website by Stripe at the time of booking. We never see or store your full card number.
              Prices shown at checkout include rent, cleaning fee, any pet fee and lodging taxes.
            </p>
          </section>

          {/* TODO: Replace with the owner's full privacy policy before launch. */}
          <section id="privacy" className="scroll-mt-28">
            <h2 className="font-serif text-2xl text-forest-900">Privacy</h2>
            <p className="mt-3">
              The details you enter at checkout (name, email, phone and notes) are used only to manage your reservation and
              communicate about your stay. Card details are handled by Stripe. For questions about your data, contact us at{" "}
              <a href={`mailto:${site.email}`} className="font-semibold text-forest-900 underline underline-offset-2">
                {site.email}
              </a>
              .
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
