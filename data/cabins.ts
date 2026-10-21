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
  /** Card's bottom-left tag (e.g. "Secluded forest"); defaults from `category` when unset. */
  categoryLabel?: string;
  badge?: { label: string; tone: "rose" | "ember" | "cream" };
  /** Three short features shown as chips on cabin cards. */
  highlights: string[];
  /** Card summary (homepage and search results). */
  description: string;
  /** Owner-approved copy for the cabin page (headline, subtitle line, story and highlight list). */
  page: { headline: string; subtitle: string; story: string[]; highlights: string[] };
  /** Path of this cabin's page on the old OwnerRez-hosted site; redirected to the new page. */
  legacyPath: string;
  /** Travel times quoted in each cabin's own OwnerRez listing. */
  nearby: { place: string; time: string }[];
};

export type CabinWithDetails = Cabin & { details: CabinDetails };

const cabinList: Omit<Cabin, "href">[] = [
  {
    slug: "emerald-forest",
    legacyPath: "/emerald-forest-hidden-gem-for-two-orp5b685a0x",
    name: "Emerald Forest",
    tagline: "The Original Hidden Gem",
    category: "forest",
    image: "/images/cabins/emerald-forest.jpg",
    size: "Studio",
    baths: 1,
    sleeps: 2,
    badge: { label: "Guest Favorite", tone: "rose" },
    highlights: ["Private hot tub", "Fireside double Jacuzzi", "Floating king bed"],
    description:
      "A romantic studio for two with a floating king Stearns & Foster bed, fireside double Jacuzzi and covered deck with private hot tub. Airbnb Guest Favorite · Top 10%.",
    page: {
      headline: "The Original Hidden Gem",
      subtitle: "Romantic studio for two · Private hot tub · Fireside double Jacuzzi · King Stearns & Foster bed",
      story: [
        "Emerald Forest is the original cabin in our Hidden Gem Cabin Series—an intimate Smoky Mountain retreat created especially for two.",
        "At the heart of the studio is a floating king bed with a premium Stearns & Foster mattress. Nearby, a freestanding double Jacuzzi sits beside the fireplace, while a fully equipped kitchen gives you every reason to stay in when you want to.",
        "Step outside to the covered back deck and your private hot tub beneath the trees. The wrap-around deck gives you even more room for morning coffee, quiet evenings and listening to the forest around you.",
        "It feels wonderfully removed while keeping Gatlinburg and Pigeon Forge within easy reach.",
      ],
      highlights: [
        "Floating King Stearns & Foster Bed",
        "Fireside Freestanding Double Jacuzzi",
        "Private Hot Tub",
        "Covered Back Deck + Wrap-Around Deck",
        "Full Kitchen",
        "Fireplace",
        "Airbnb Guest Favorite · Top 10% of Eligible Homes",
      ],
    },
    nearby: [
      { place: "Gatlinburg", time: "10–15 min" },
      { place: "Pigeon Forge", time: "10–15 min" },
      { place: "Dollywood", time: "10–15 min" },
      { place: "Knoxville airport (TYS)", time: "~1 hr" },
    ],
  },
  {
    slug: "golden-forest",
    legacyPath: "/just-opened-luxury-cabin-w-hot-tub-orp5b75c7ax",
    name: "Golden Forest",
    tagline: "Warmth & Glow",
    category: "forest",
    image: "/images/cabins/just-opened.jpg",
    size: "Studio",
    baths: 1,
    sleeps: 2,
    badge: { label: "Just Opened", tone: "ember" },
    highlights: ["Private hot tub", "Fireside double Jacuzzi", "Three-sided deck"],
    description:
      "Golden details, a king Stearns & Foster bed, fireside double Jacuzzi, private hot tub and a deck wrapping around three sides of the cabin.",
    page: {
      headline: "Golden Hours. Quiet Mornings. Just the Two of You.",
      subtitle: "Romantic studio for two · Private hot tub · Double Jacuzzi · Three-sided deck",
      story: [
        "Golden Forest brings warmth and glow to our Hidden Gem Cabin Series.",
        "Inside, golden details and thoughtfully selected finishes surround a king Stearns & Foster bed, fireside double Jacuzzi, gas fireplace with carved bear mantle and fully equipped kitchen.",
        "Outside, the deck wraps around three sides of the cabin, giving you different views of the forest as the light changes throughout the day. Your private hot tub waits beneath the trees.",
        "Fall may put on the most obvious golden show, but summer greenery, winter evenings by the fire and fresh spring mornings make this a retreat for every season.",
      ],
      highlights: [
        "King Stearns & Foster Bed",
        "Fireside Double Jacuzzi",
        "Private Hot Tub",
        "Three-Sided Wrap-Around Deck",
        "Gas Fireplace + Carved Bear Mantle",
        "Full Kitchen",
      ],
    },
    nearby: [
      { place: "Gatlinburg", time: "10–15 min" },
      { place: "Pigeon Forge", time: "10–15 min" },
      { place: "Dollywood", time: "10–15 min" },
      { place: "Knoxville airport (TYS)", time: "~1 hr" },
    ],
  },
  {
    slug: "ladyslipper",
    legacyPath: "/ladyslipper-timeless-romance-mins-to-town-hottub-secluded-orp5b5b460x",
    name: "Ladyslipper",
    tagline: "A Storybook A-Frame",
    category: "forest",
    image: "/images/cabins/ladyslipper.jpg",
    size: "Studio A-Frame",
    baths: 1,
    sleeps: 2,
    badge: { label: "A-Frame", tone: "cream" },
    highlights: ["Private hot tub", "Seven wooded acres", "Wood-burning fireplace"],
    description:
      "Seven wooded acres, a king bed, real wood-burning fireplace, double Jacuzzi, wrap-around porch and private hot tub—all within five miles of Gatlinburg and Pigeon Forge.",
    page: {
      headline: "A Storybook A-Frame Hidden in the Woods",
      subtitle: "Romantic cabin for two · Seven wooded acres · Private hot tub · Wood-burning fireplace",
      story: [
        "Ladyslipper gives you the classic Smoky Mountain cabin experience: an intimate A-frame tucked among seven wooded acres, yet within five miles of both Gatlinburg and Pigeon Forge.",
        "Inside, settle into the king-size bed, build a fire in the real wood-burning fireplace, or soak together in the double Jacuzzi. A full kitchen makes breakfast in pajamas or dinner at the cabin easy.",
        "Outside, a wrap-around porch, porch swing and private hot tub invite you to slow down and enjoy the forest. Soft robes, cozy blankets and a classic radio add to the feeling that there's really no reason to rush anywhere.",
      ],
      highlights: [
        "Classic A-Frame",
        "Seven Wooded Acres",
        "King Bed",
        "Real Wood-Burning Fireplace",
        "Double Jacuzzi",
        "Private Hot Tub",
        "Wrap-Around Porch + Porch Swing",
        "Full Kitchen",
      ],
    },
    nearby: [
      { place: "Gatlinburg", time: "10–15 min" },
      { place: "Pigeon Forge", time: "10–15 min" },
      { place: "Dollywood", time: "15 min" },
      { place: "Knoxville airport (TYS)", time: "~1 hr" },
    ],
  },
  {
    slug: "wild-columbine",
    legacyPath: "/romantic-and-secluded-hottub-cabin-wild-columbine-orp5b5b4bfx",
    name: "Wild Columbine",
    tagline: "Secluded, Yet Close to It All",
    category: "forest",
    image: "/images/cabins/wild-columbine.jpg",
    size: "Studio",
    baths: 1,
    sleeps: 2,
    highlights: ["Private hot tub", "Double Jacuzzi", "Wood-burning fireplace"],
    description:
      "A romantic forest cabin for two with a king bed, wood-burning fireplace, double Jacuzzi, wrap-around porch and private hot tub.",
    page: {
      headline: "Feel Miles From Everything. Be Minutes From Both Towns.",
      subtitle: "Romantic forest cabin for two · Private hot tub · Wood-burning fireplace · Double Jacuzzi",
      story: [
        "Wild Columbine is for couples who want the woods to actually feel like the woods.",
        "This intimate cabin surrounds you with the Smoky Mountain forest while keeping Gatlinburg and Pigeon Forge close enough for dinner, attractions and days exploring the National Park.",
        "Inside, a king-size bed, real wood-burning fireplace, double Jacuzzi and equipped kitchen make staying in just as appealing as going out.",
        "Outside, the wrap-around porch and private hot tub beneath the trees give you a place to slow down and listen to the forest. Spend the day doing everything—or decide to do absolutely nothing.",
      ],
      highlights: [
        "King Bed",
        "Real Wood-Burning Fireplace",
        "Double Jacuzzi",
        "Private Hot Tub",
        "Wrap-Around Porch",
        "Equipped Kitchen",
        "Forest Setting",
      ],
    },
    nearby: [
      { place: "Gatlinburg", time: "5 mi" },
      { place: "Pigeon Forge", time: "5 mi" },
      { place: "Knoxville airport (TYS)", time: "~1 hr" },
    ],
  },
  {
    slug: "firefly-bungalow-2",
    legacyPath: "/steps-from-pigeon-forge-parkway-hottub-firepit-orp5b5b4e9x",
    name: "Firefly Bungalow #2",
    tagline: "Stay Close to the Fun",
    category: "parkway",
    image: "/images/cabins/steps-from-parkway.jpg",
    size: "2 Bedrooms",
    baths: 1,
    sleeps: 6,
    badge: { label: "Sleeps 6", tone: "cream" },
    highlights: ["Private hot tub", "One-story layout", "Family games"],
    description:
      "A one-story Pigeon Forge bungalow with family-friendly comforts and a private hot tub, steps from the Parkway.",
    page: {
      headline: "Your Own Place, Steps From the Parkway",
      subtitle: "In-town Pigeon Forge · Private hot tub · Family-friendly · One-story",
      story: [
        "Firefly Bungalow #2 combines the convenience of an in-town Pigeon Forge stay with the comfort of having a place of your own.",
        "The one-story bungalow features reclaimed barn-wood walls, family games, television, an electric wood stove and flexible sleeping space. Two AC units and supplemental space heaters help keep the bungalow comfortable through changing seasons.",
        "Best of all, you're steps from the Pigeon Forge Parkway and have your own private hot tub waiting after Dollywood, hiking, sightseeing or a full day of attractions.",
      ],
      highlights: [
        "Steps From the Parkway",
        "Private Hot Tub",
        "One-Story Layout",
        "Family Games",
        "Reclaimed Barn-Wood Character",
        "Flexible Sleeping Space",
        "Electric Wood Stove",
      ],
    },
    nearby: [
      { place: "Pigeon Forge Parkway", time: "Walkable" },
      { place: "Dollywood", time: "5 mi" },
      { place: "Great Smoky Mountains NP", time: "10 mi" },
      { place: "Gatlinburg", time: "11 mi" },
    ],
  },
  {
    slug: "firefly-bungalow-1",
    legacyPath: "/stylish-bungalow-steps-from-the-pigeon-forge-parkway-orp5b5b413x",
    name: "Firefly Bungalow #1",
    tagline: "Steps From the Parkway",
    category: "parkway",
    image: "/images/cabins/stylish-bungalow.jpg",
    size: "1 Bedroom",
    baths: 1,
    sleeps: 3,
    badge: { label: "Remodeled", tone: "cream" },
    highlights: ["Private hot tub", "Steps from the Parkway", "String lights"],
    description:
      "An in-town Pigeon Forge home base with your own private hot tub and an exceptionally convenient location for exploring.",
    page: {
      headline: "Steps From the Pigeon Forge Parkway",
      subtitle: "In-town Pigeon Forge · Private hot tub · Convenient to attractions",
      story: [
        "Firefly Bungalow #1 is for travelers who would rather spend their vacation exploring than driving back and forth to town.",
        "Located steps from the Pigeon Forge Parkway on the side of the property closest to the mountains, it gives you an exceptionally convenient home base with your own private hot tub waiting when the day is done.",
        "Walk to nearby attractions and restaurants, explore Pigeon Forge, head into Gatlinburg or spend the day in Great Smoky Mountains National Park—then come back and unwind beneath the string lights.",
        "Because of its central in-town location, guests may occasionally hear normal road or town noise.",
      ],
      highlights: [
        "Steps From the Parkway",
        "Private Hot Tub",
        "In-Town Pigeon Forge Location",
        "Outdoor Space + String Lights",
        "Easy Access to Attractions & Restaurants",
      ],
    },
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
