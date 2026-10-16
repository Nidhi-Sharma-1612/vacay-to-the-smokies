export type CabinCategory = "forest" | "parkway";

export type Guests = { adults: number; children: number; pets: number };

/** What a visitor searched for. Every field is optional except guest counts. */
export type StaySearch = Guests & {
  checkin?: string; // yyyy-MM-dd
  checkout?: string; // yyyy-MM-dd
  type?: CabinCategory;
};

/** A concrete stay at one cabin. */
export type Stay = Guests & { slug: string; checkin: string; checkout: string };

/**
 * Availability for the date picker. Dates are yyyy-MM-dd nights:
 * a blocked night cannot be part of a stay, but a guest can still check out that morning.
 */
export type AvailabilityCalendar = {
  slug: string;
  currency: string;
  blocked: string[];
  noArrival: string[];
  noDeparture: string[];
  minStay: Record<string, number>;
  rates: Record<string, number>;
  defaultMinStay: number;
};

export type QuoteLine = { label: string; amount: number; kind: "rent" | "fee" | "tax" | "discount" };

export type Quote = {
  slug: string;
  checkin: string;
  checkout: string;
  nights: number;
  currency: string;
  lines: QuoteLine[];
  total: number;
};

export type DescriptionBlock = { type: "h" | "p" | "li"; text: string };

export type CabinDetails = {
  ownerRezKey: string;
  photos: string[];
  rating: number;
  reviewCount: number;
  sqft: number | null;
  checkIn: string | null;
  checkOut: string | null;
  coords: [number, number] | number[] | null;
  locality: string | null;
  rateRange: { min: number; max: number };
  maxGuests: number;
  childrenAllowed: boolean;
  petsAllowed: boolean;
  checkInMethod: string | null;
  cancellationPolicy: string | null;
  notes: string[];
  description: DescriptionBlock[];
  sleeping: { summary: string; rooms: string[]; note: string | null };
  bathrooms: { rooms: string[]; note: string | null };
  houseRules: string[];
  expectations: string[];
  amenityGroups: { name: string; items: string[] }[];
};

export type Result<T> = { ok: true; data: T } | { ok: false; error: string };
