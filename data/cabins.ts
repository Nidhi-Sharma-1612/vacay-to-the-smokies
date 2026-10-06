import { cabinDetails } from "./cabin-details";
import type { CabinCategory, CabinDetails } from "@/lib/booking/types";

export type { CabinCategory };

export type Cabin = {
  slug: string;
  name: string;
  tagline: string;
  category: CabinCategory;
  image: string;
  href: string;
  size: string;
  baths: number;
  sleeps: number;
  badge?: { label: string; tone: "rose" | "ember" | "cream" };
  highlights: string[];
  description: string;
  /** Used by the demo pricing engine; OwnerRez supplies real fees when connected. */
  cleaningFee: number;
  /** Travel times quoted in each cabin's own OwnerRez listing. */
  nearby: { place: string; time: string }[];
};

export type CabinWithDetails = Cabin & { details: CabinDetails };

const cabinList: Omit<Cabin, "href">[] = [
  {
    slug: "emerald-forest",
    name: "Emerald Forest",
    tagline: "Hidden gem for two",
    category: "forest",
    image: "/images/cabins/emerald-forest.jpg",
    size: "Studio",
    baths: 1,
    sleeps: 2,
    badge: { label: "Guest Favorite", tone: "rose" },
    highlights: ["Private hot tub", "Fireside double jacuzzi", "King floating bed"],
    description:
      "The original Hidden Gem retreat, an Airbnb Guest Favorite and Top 10% home tucked among autumn trees, 10–15 minutes from Gatlinburg, Pigeon Forge and Dollywood.",
    cleaningFee: 95,
    nearby: [
      { place: "Gatlinburg", time: "10–15 min" },
      { place: "Pigeon Forge", time: "10–15 min" },
      { place: "Dollywood", time: "10–15 min" },
      { place: "Knoxville airport (TYS)", time: "~1 hr" },
    ],
  },
  {
    slug: "golden-forest",
    name: "Golden Forest",
    tagline: "Just opened · built for two",
    category: "forest",
    image: "/images/cabins/just-opened.jpg",
    size: "Studio",
    baths: 1,
    sleeps: 2,
    badge: { label: "Just Opened", tone: "ember" },
    highlights: ["Wrap-around hot tub deck", "Jacuzzi by the fireplace", "Stearns & Foster king"],
    description:
      "The second cabin in our Hidden Gem series. Golden fixtures and character beams, a double jacuzzi beside the gas fireplace, and a private hot tub under the trees.",
    cleaningFee: 95,
    nearby: [
      { place: "Gatlinburg", time: "10–15 min" },
      { place: "Pigeon Forge", time: "10–15 min" },
      { place: "Dollywood", time: "10–15 min" },
      { place: "Knoxville airport (TYS)", time: "~1 hr" },
    ],
  },
  {
    slug: "ladyslipper",
    name: "Ladyslipper",
    tagline: "Timeless romance",
    category: "forest",
    image: "/images/cabins/ladyslipper.jpg",
    size: "Studio A-Frame",
    baths: 1,
    sleeps: 2,
    badge: { label: "A-Frame", tone: "cream" },
    highlights: ["Hot tub over 7 acres", "Jacuzzi by the fire", "Porch swing"],
    description:
      "A secluded A-frame with a hot tub overlooking seven acres of forest, a wrap-around porch swing and a double jacuzzi in front of a wood-burning fireplace.",
    cleaningFee: 90,
    nearby: [
      { place: "Gatlinburg", time: "10–15 min" },
      { place: "Pigeon Forge", time: "10–15 min" },
      { place: "Dollywood", time: "15 min" },
      { place: "Knoxville airport (TYS)", time: "~1 hr" },
    ],
  },
  {
    slug: "wild-columbine",
    name: "Wild Columbine",
    tagline: "Romantic & secluded",
    category: "forest",
    image: "/images/cabins/wild-columbine.jpg",
    size: "Studio",
    baths: 1,
    sleeps: 2,
    highlights: ["Hot tub on the deck", "Double jacuzzi", "Wood-burning fireplace"],
    description:
      "Rustic charm hidden in the forest, with a king bed, a double jacuzzi inside and a hot tub out back. Still just 5 miles to Gatlinburg and Pigeon Forge.",
    cleaningFee: 90,
    nearby: [
      { place: "Gatlinburg", time: "5 mi" },
      { place: "Pigeon Forge", time: "5 mi" },
      { place: "Knoxville airport (TYS)", time: "~1 hr" },
    ],
  },
  {
    slug: "firefly-bungalow-2",
    name: "Firefly Bungalow #2",
    tagline: "Steps from the Parkway",
    category: "parkway",
    image: "/images/cabins/steps-from-parkway.jpg",
    size: "2 Bedrooms",
    baths: 1,
    sleeps: 6,
    badge: { label: "Sleeps 6", tone: "cream" },
    highlights: ["Outdoor hot tub", "Firepit & string lights", "2 king beds"],
    description:
      "A one-story bungalow with old-time charm, private and tucked away yet walkable to the heart of Pigeon Forge. Dollywood is 5 miles away.",
    cleaningFee: 135,
    nearby: [
      { place: "Pigeon Forge Parkway", time: "Walkable" },
      { place: "Dollywood", time: "5 mi" },
      { place: "Great Smoky Mountains NP", time: "10 mi" },
      { place: "Gatlinburg", time: "11 mi" },
    ],
  },
  {
    slug: "firefly-bungalow-1",
    name: "Firefly Bungalow #1",
    tagline: "Rustic-chic & remodeled",
    category: "parkway",
    image: "/images/cabins/stylish-bungalow.jpg",
    size: "1 Bedroom",
    baths: 1,
    sleeps: 3,
    badge: { label: "Remodeled", tone: "cream" },
    highlights: ["Hot tub patio", "Ensuite jacuzzi", "Firepit & BBQ"],
    description:
      "Freshly remodeled with a brand-new kitchen, a king bed with ensuite jacuzzi and a string-lit backyard patio with a hot tub, all steps from the Parkway.",
    cleaningFee: 115,
    nearby: [
      { place: "Pigeon Forge Parkway", time: "Walkable" },
      { place: "Dollywood", time: "5 mi" },
      { place: "Great Smoky Mountains NP", time: "10 mi" },
      { place: "Gatlinburg", time: "11 mi" },
    ],
  },
];

export const cabins: CabinWithDetails[] = cabinList.map((c) => ({
  ...c,
  href: `/cabins/${c.slug}`,
  details: cabinDetails[c.slug],
}));

export function getCabin(slug: string): CabinWithDetails | undefined {
  return cabins.find((c) => c.slug === slug);
}

/** Photos are stored as "<id>-<size>" exactly as OwnerRez serves them. */
export const photoUrl = (photo: string, thumb = false) =>
  `https://uc.orez.io/i/${thumb ? photo.replace(/-(Large|Medium)$/, "-Thumb") : photo}`;

export const cabinFilters: { id: "all" | CabinCategory; label: string }[] = [
  { id: "all", label: "All cabins" },
  { id: "forest", label: "Secluded forest" },
  { id: "parkway", label: "Walk to the Parkway" },
];
