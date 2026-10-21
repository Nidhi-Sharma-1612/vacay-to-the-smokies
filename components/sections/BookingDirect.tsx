import { Info, Phone, UserCheck } from "lucide-react";
import { site } from "@/data/site";
import { ButtonLink } from "@/components/ui/Button";
import { getPageSections, getSiteSettings, str } from "@/lib/cms";

/** Short note distinguishing direct bookings from third-party reservations (owner-approved copy). */
export async function BookingDirect() {
  const [sections, settings] = await Promise.all([getPageSections("home"), getSiteSettings()]);
  const b = sections.bookingDirect ?? {};
  const phone = settings?.phone || site.phone;
  const phoneHref = phone === site.phone ? site.phoneHref : `tel:${phone.replace(/[^\d+]/g, "")}`;
  return (
    <section aria-labelledby="booking-direct" className="px-4 pb-24 sm:px-6 sm:pb-28 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 rounded-[2rem] border border-linen-200 bg-linen-100 p-8 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-14">
        <div>
          <p className="flex items-center gap-2 text-sm font-bold tracking-wide text-ember-600 uppercase">
            <Info className="size-4" aria-hidden /> {str(b, "eyebrow", "Good to know")}
          </p>
          <h2 id="booking-direct" className="mt-2 font-serif text-3xl font-medium text-forest-900">
            {str(b, "heading", "Booking Direct?")}
          </h2>
          <p className="mt-4 max-w-3xl leading-relaxed text-ink-600">
            {str(
              b,
              "description",
              "Reservations completed on this website are direct bookings with Vacay To The Smokies. Reservations made through Airbnb, Vrbo, Booking.com, Expedia or another platform are subject to the terms associated with that reservation.",
            )}
          </p>
          <p className="mt-3 flex max-w-3xl items-start gap-2 leading-relaxed text-forest-800">
            <UserCheck className="mt-1 size-4 shrink-0 text-ember-500" aria-hidden />
            {str(b, "checkInNote", "All guests, regardless of booking channel, must complete our secure online check-in before arrival.")}
          </p>
          <p className="mt-3 flex items-center gap-2 text-forest-800">
            <Phone className="size-4 text-ember-500" aria-hidden />
            {str(b, "guestServicesLabel", "Guest Services:")}{" "}
            <a href={phoneHref} className="font-semibold text-forest-900 underline underline-offset-2">
              {phone}
            </a>
          </p>
        </div>
        <ButtonLink href="/policies" variant="outline-dark" size="lg" className="justify-self-start">
          {str(b, "buttonLabel", "View Direct Booking Policies & Good to Know")}
        </ButtonLink>
      </div>
    </section>
  );
}
