// Hidden Gem Cabin Series: owner-approved copy. Keep wording as supplied.

export type GemStatus = "open" | "coming-soon";

export type HiddenGem = {
  key: "emerald" | "golden" | "jade" | "diamond";
  gem: string; // "EMERALD"
  name: string; // "Emerald Forest"
  theme: string; // "Forest & Nature"
  /** One line for the homepage section. */
  short: string;
  /** Description for the Hidden Gems collection page. */
  long: string;
  status: GemStatus;
  href: string;
  /** Cabin photo for open cabins. */
  image?: string;
  /** Architectural rendering for coming-soon cabins, once supplied. Always shown with the rendering label. */
  rendering?: string;
  /** Gradient used until a photo or rendering is available. */
  swatch: [string, string];
};

export const hiddenGems: HiddenGem[] = [
  {
    key: "emerald",
    gem: "EMERALD",
    name: "Emerald Forest",
    theme: "Forest & Nature",
    short: "Deep greens, forest views and the original Hidden Gem.",
    long: "Deep greens, forest views and the cabin where our Hidden Gem story began.",
    status: "open",
    href: "/cabins/emerald-forest",
    image: "/images/cabins/emerald-forest.jpg",
    swatch: ["#24543c", "#16211c"],
  },
  {
    key: "golden",
    gem: "GOLDEN",
    name: "Golden Forest",
    theme: "Warmth & Glow",
    short: "Warm finishes, golden details and changing light through the trees.",
    long: "Golden details, warm finishes and changing light through the forest.",
    status: "open",
    href: "/cabins/golden-forest",
    image: "/images/cabins/just-opened.jpg",
    swatch: ["#b07a2e", "#3b2a14"],
  },
  {
    key: "jade",
    gem: "JADE",
    name: "Jade Forest",
    theme: "Wellness & Spa",
    short: "Sauna, cold plunge, vitamin C shower, hot tub and fireside Jacuzzi create your own private spa in the Smokies.",
    long: "Your own private spa in the Smokies, with a sauna, cold plunge, vitamin C shower, hot tub and fireside double Jacuzzi, surrounded by jade and natural earth tones.",
    status: "coming-soon",
    href: "/hidden-gems/jade-forest",
    rendering: "/images/hidden-gems/jade-forest-rendering.jpg",
    swatch: ["#5f8f7b", "#1f3a30"],
  },
  {
    key: "diamond",
    gem: "DIAMOND",
    name: "Diamond Forest",
    theme: "Light & Contrast",
    short: "Cool whites and soft greys meet the warmth and character of authentic log walls.",
    long: "A cooler, lighter personality with soft whites and greys contrasted against authentic log walls.",
    status: "coming-soon",
    href: "/hidden-gems/diamond-forest",
    rendering: "/images/hidden-gems/diamond-forest-rendering.jpg",
    swatch: ["#c9ccce", "#5b5f62"],
  },
];

export const getGem = (key: string) => hiddenGems.find((g) => g.key === key);

/** Coming Soon page copy, keyed by gem. */
export const comingSoon = {
  jade: {
    title: "Jade Forest — Coming Soon",
    headline: "Your Private Spa in the Smokies",
    paragraphs: [
      "The third cabin in our Hidden Gem Series is being created around an entirely new experience: wellness in the woods.",
      "Jade Forest will pair the warmth of an intimate Smoky Mountain cabin with the restorative feeling of a private spa retreat—all designed exclusively for two. Rich jade and natural earth tones will flow throughout the cabin, connecting the interior to the forest just outside.",
    ],
    featuresLabel: "Planned highlights",
    features: ["Private Sauna", "Cold Plunge", "Vitamin C Shower", "Private Hot Tub", "Fireside Double Jacuzzi", "King Stearns & Foster Bed", "Full Kitchen", "Fireplace", "Wrap-Around Deck"],
    status: "Jade Forest is currently under construction and is not yet accepting reservations.",
  },
  diamond: {
    title: "Diamond Forest — Coming Soon",
    headline: "A Brighter Side of the Smokies",
    paragraphs: [
      "Diamond Forest will complete our original collection of four Hidden Gems and is taking shape in a lighter, cooler direction.",
      "We are currently envisioning soft whites and greys layered against authentic log walls, allowing the natural character of a Smoky Mountain cabin to meet a cleaner, more refined palette.",
    ],
    featuresLabel: "Planned signature Hidden Gem features",
    features: ["King Stearns & Foster Bed", "Fireside Double Jacuzzi", "Private Hot Tub", "Fireplace", "Full Kitchen", "Wrap-Around Deck"],
    status: "Diamond Forest is not yet accepting reservations. Final finishes are still being selected.",
  },
} as const;

export const RENDERING_LABEL = "ARCHITECTURAL RENDERING · COMING SOON";
export const RENDERING_DISCLAIMER = "Architectural rendering depicting the planned cabin. Final construction, finishes and landscaping may vary.";
