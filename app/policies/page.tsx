import type { Metadata } from "next";
import { BadgeCheck, CalendarX2, Clock, CreditCard, Info, MessageSquareText, ScrollText, ShieldCheck, UserCheck } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { site } from "@/data/site";
import { getPageSections, getSiteSettings, str, strList } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Direct Booking Policies & Good to Know | Vacay To The Smokies",
  description:
    "Direct booking policies for Vacay To The Smokies: required online check-in, cancellation, check-in times, house rules, payments and privacy.",
};

// Each section's wording is admin-editable (see getPageSections("policies") below).
// Section ids/order/icons and the "On this page" nav stay fixed — only the text does.
const SECTIONS = [
  { id: "direct-vs-third-party", label: "Direct vs. third-party bookings" },
  { id: "online-check-in", label: "Required online check-in" },
  { id: "guest-services", label: "Guest services" },
  { id: "cancellation", label: "Cancellation policy" },
  { id: "check-in-checkout", label: "Check-in & checkout" },
  { id: "house-rules", label: "House rules" },
  { id: "payments", label: "Payments" },
  { id: "privacy", label: "Privacy" },
];

function Section({ id, icon: Icon, title, badge, children }: { id: string; icon: typeof Info; title: string; badge?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-28 border-t border-linen-200 py-10 first:border-t-0 first:pt-0">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-linen-100 text-ember-600">
          <Icon className="size-5" aria-hidden />
        </span>
        <h2 className="font-serif text-2xl text-forest-900 sm:text-[1.7rem]">{title}</h2>
        {badge && <span className="rounded-full bg-forest-900 px-3 py-1 text-xs font-bold text-cream-50">{badge}</span>}
      </div>
      <div className="mt-5 space-y-4 leading-relaxed text-ink-600">{children}</div>
    </section>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-ember-500" aria-hidden />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function PhoneLink({ phone, phoneHref }: { phone: string; phoneHref: string }) {
  return (
    <a href={phoneHref} className="font-semibold whitespace-nowrap text-forest-900 underline underline-offset-2">
      {phone}
    </a>
  );
}

export default async function PoliciesPage() {
  const [settings, sections] = await Promise.all([getSiteSettings(), getPageSections("policies")]);
  const phone = settings?.phone || site.phone;
  const phoneHref = phone === site.phone ? site.phoneHref : `tel:${phone.replace(/[^\d+]/g, "")}`;

  const hero = sections.hero ?? {};
  const intro = sections.intro ?? {};
  const onlineCheckIn = sections.onlineCheckIn ?? {};
  const guestServices = sections.guestServices ?? {};
  const cancellation = sections.cancellation ?? {};
  const checkInCheckout = sections.checkInCheckout ?? {};
  const houseRules = sections.houseRules ?? {};
  const payments = sections.payments ?? {};
  const privacy = sections.privacy ?? {};

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20">
        <section className="grain border-b border-linen-200 bg-linen-100">
          <div className="mx-auto max-w-6xl px-4 pt-14 pb-12 sm:px-6 lg:px-8">
            <p className="eyebrow text-ember-500">{str(hero, "eyebrow", "Good to know")}</p>
            <h1 className="mt-3 max-w-3xl font-serif text-4xl font-medium tracking-tight text-balance text-forest-900 sm:text-5xl">
              {str(hero, "heading", "Direct Booking Policies & Good to Know")}
            </h1>
          </div>
        </section>

        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-16 lg:px-8">
          <nav aria-label="On this page" className="hidden lg:sticky lg:top-28 lg:block lg:self-start">
            <p className="eyebrow text-ember-500">On this page</p>
            <ol className="mt-4 space-y-2.5 text-sm">
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="text-ink-600 transition-colors hover:text-forest-900">
                    {s.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <article className="max-w-3xl min-w-0">
            <section id="direct-vs-third-party" className="scroll-mt-28 rounded-3xl border border-ember-300/60 bg-ember-500/5 p-6 sm:p-8">
              <p className="flex items-center gap-2 text-sm font-bold tracking-wide text-ember-600 uppercase">
                <Info className="size-4" aria-hidden /> {str(intro, "badge", "Important")}
              </p>
              <h2 className="mt-2 font-serif text-2xl text-forest-900 sm:text-[1.7rem]">
                {str(intro, "title", "Direct Bookings vs. Third-Party Reservations")}
              </h2>
              <div className="mt-4 space-y-4 leading-relaxed text-forest-800">
                <p>
                  {str(
                    intro,
                    "p1",
                    "The direct-booking policies below apply only to reservations booked directly with Vacay To The Smokies, including reservations made through this website.",
                  )}
                </p>
                <p>
                  {str(
                    intro,
                    "p2",
                    "If you booked through Airbnb, Vrbo, Booking.com, Expedia, or another third-party booking platform, the policies, terms, cancellation rules, payment requirements, and refund conditions associated with your reservation on that platform apply. Please refer to your original booking confirmation and the terms displayed by the platform where you booked.",
                  )}
                </p>
                <p>
                  {str(
                    intro,
                    "p3",
                    "If there is a difference between the policies below and the policies associated with a reservation made through a third-party booking platform, the terms applicable to your reservation through that platform will govern.",
                  )}
                </p>
              </div>
            </section>

            <div className="mt-10">
              <Section
                id="online-check-in"
                icon={UserCheck}
                title={str(onlineCheckIn, "title", "Required Online Check-In")}
                badge={str(onlineCheckIn, "badge", "All reservations")}
              >
                <p className="font-semibold text-forest-900">
                  {str(onlineCheckIn, "p1", "This requirement applies to all guests, regardless of where the reservation was booked.")}
                </p>
                <p>
                  {str(
                    onlineCheckIn,
                    "p2",
                    "Before arrival, the primary guest is required to complete and sign our online check-in form. As part of the check-in and reservation verification process, guests will be required to provide:",
                  )}
                </p>
                <Bullets
                  items={strList(onlineCheckIn, "bullets", [
                    "A valid government-issued photo ID",
                    "A current selfie for identity verification",
                    "A valid payment method to be kept on file for incidentals",
                  ])}
                />
                <p className="rounded-2xl bg-linen-100 px-5 py-4 text-forest-800">
                  {str(
                    onlineCheckIn,
                    "note",
                    "Completion of the required online check-in process is a condition of check-in and must be completed before property access information is provided.",
                  )}
                </p>
                <p>
                  {str(
                    onlineCheckIn,
                    "p3",
                    "This requirement applies to reservations made directly with Vacay To The Smokies as well as reservations made through Airbnb, Vrbo, Booking.com, Expedia, and other third-party booking platforms.",
                  )}
                </p>
              </Section>

              <Section
                id="guest-services"
                icon={MessageSquareText}
                title={str(guestServices, "title", "Guest Services & Check-In Communications")}
              >
                <p>
                  Our official Guest Services number is <PhoneLink phone={phone} phoneHref={phoneHref} />.
                </p>
                <p>
                  {str(
                    guestServices,
                    "p2",
                    "Guests may receive text messages or other communications from this number regarding their reservation, required online check-in, arrival information, property access instructions, and other important information related to their stay.",
                  )}
                </p>
                <p>
                  {str(
                    guestServices,
                    "p3",
                    "Please make sure the phone number provided with your reservation is accurate and able to receive messages so that you do not miss important check-in information.",
                  )}
                </p>
              </Section>

              <Section
                id="cancellation"
                icon={CalendarX2}
                title={str(cancellation, "title", "Cancellation Policy")}
                badge={str(cancellation, "badge", "Direct bookings")}
              >
                <p>{str(cancellation, "p0", "For reservations booked directly with Vacay To The Smokies:")}</p>
                <dl className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-white p-5 ring-1 ring-forest-900/5">
                    <dt className="text-sm font-semibold text-ink-600">
                      {str(cancellation, "period1Label", "More than 30 days before arrival")}
                    </dt>
                    <dd className="mt-1 text-forest-900">
                      {str(cancellation, "period1Text", "Fifty percent (50%) of the total booking charges will be refunded.")}
                    </dd>
                  </div>
                  <div className="rounded-2xl bg-white p-5 ring-1 ring-forest-900/5">
                    <dt className="text-sm font-semibold text-ink-600">
                      {str(cancellation, "period2Label", "30 days or less before arrival")}
                    </dt>
                    <dd className="mt-1 text-forest-900">{str(cancellation, "period2Text", "No refund will be issued.")}</dd>
                  </div>
                </dl>
                <p>
                  {str(
                    cancellation,
                    "p1",
                    "Cancellation policies for reservations made through Airbnb, Vrbo, Booking.com, Expedia, or another third-party platform may be different. Guests who booked through one of these platforms should refer to the cancellation policy associated with their reservation before requesting a cancellation.",
                  )}
                </p>
              </Section>

              <Section id="check-in-checkout" icon={Clock} title={str(checkInCheckout, "title", "Check-In & Checkout")}>
                <p>
                  Check-in is after{" "}
                  <strong className="text-forest-900">{str(checkInCheckout, "checkInTime", "4:00 PM")}</strong>, and checkout is by{" "}
                  <strong className="text-forest-900">{str(checkInCheckout, "checkOutTime", "11:00 AM")}</strong>.
                </p>
                <p>
                  {str(
                    checkInCheckout,
                    "p1",
                    "Most cabins offer self check-in. Property access information, check-in instructions, and the exact property address are provided before arrival after completion of any required check-in and verification steps.",
                  )}
                </p>
                <p>
                  {str(checkInCheckout, "p2", "Guests who booked through a third-party platform should also review communications provided through that platform.")}
                </p>
              </Section>

              <Section id="house-rules" icon={ScrollText} title={str(houseRules, "title", "House Rules")}>
                <p>{str(houseRules, "intro", "Unless different or additional rules are specifically stated for your property or reservation:")}</p>
                <Bullets
                  items={strList(houseRules, "bullets", [
                    "No smoking, parties, or events.",
                    "The primary renter must be at least 18 years old.",
                    "Pets are welcome at designated pet-friendly properties with prior approval and payment of the applicable pet fee. Pets should be crated when left unattended.",
                    "Maximum occupancy is stated for each property and may not be exceeded.",
                    "Additional property-specific rules may apply and will be provided with your reservation.",
                  ])}
                />
              </Section>

              <Section
                id="payments"
                icon={CreditCard}
                title={str(payments, "title", "Payments")}
                badge={str(payments, "badge", "Direct bookings")}
              >
                <p>
                  {str(
                    payments,
                    "p1",
                    "For reservations booked directly with Vacay To The Smokies, Vacay To The Smokies is the merchant of record and charges associated with your reservation will be processed by Vacay To The Smokies.",
                  )}
                </p>
                <p>
                  {str(
                    payments,
                    "p2",
                    "Credit and debit card payments are securely processed through Authorize.net. Vacay To The Smokies does not store your full payment card number.",
                  )}
                </p>
                <p>
                  {str(
                    payments,
                    "p3",
                    "Prices displayed during direct booking checkout include the applicable rent, cleaning fee, approved pet fee, if any, and lodging taxes.",
                  )}
                </p>
                <p>
                  {str(
                    payments,
                    "p4",
                    "Reservations made through Airbnb, Vrbo, Booking.com, Expedia, or another third-party booking platform may have different payment schedules, fees, payment-processing arrangements, and terms. Please refer to the payment information associated with the platform through which you booked.",
                  )}
                </p>
              </Section>

              <Section id="privacy" icon={ShieldCheck} title={str(privacy, "title", "Privacy")}>
                <p>
                  {str(
                    privacy,
                    "p1",
                    "For direct reservations, the information you provide during booking and online check-in—including your name, email address, phone number, reservation information, identification and other required verification information—is used to manage and verify your reservation, facilitate check-in, provide your stay, and communicate with you regarding your booking.",
                  )}
                </p>
                <p>{str(privacy, "p2", "Payment card information is securely processed through Authorize.net.")}</p>
                <p>
                  {str(
                    privacy,
                    "p3",
                    "Guests who book through a third-party platform are also subject to that platform's privacy policy and data-handling practices.",
                  )}
                </p>
              </Section>
            </div>

            <div className="mt-4 flex gap-4 rounded-3xl bg-forest-900 p-6 text-cream-50 sm:p-8">
              <BadgeCheck className="mt-0.5 size-6 shrink-0 text-ember-300" aria-hidden />
              <p className="leading-relaxed text-mist-200/90">
                For questions regarding your reservation or information, please contact Vacay To The Smokies Guest Services at{" "}
                <a href={phoneHref} className="font-semibold whitespace-nowrap text-cream-50 underline underline-offset-2">
                  {phone}
                </a>{" "}
                or{" "}
                <a href={`mailto:${site.email}`} className="font-semibold [overflow-wrap:anywhere] text-cream-50 underline underline-offset-2">
                  {site.email}
                </a>
                .
              </p>
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
