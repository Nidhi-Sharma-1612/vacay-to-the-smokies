export type Review = {
  quote: string;
  author: string;
  cabin: string;
  date: string;
};

// TODO: Replace with real guest reviews from https://www.vacaytothesmokies.com/reviews.
// The reviews on that page load client-side, so they could not be pulled in automatically.
export const reviews: Review[] = [
  {
    quote:
      "The most romantic getaway we've ever had. Soaking in the hot tub with the leaves falling around us felt like a dream, and the cabin was spotless.",
    author: "Placeholder guest",
    cabin: "Emerald Forest",
    date: "October 2025",
  },
  {
    quote:
      "The fireplace, the jacuzzi, the porch swing. Every detail was thought of. Secluded enough to feel like the only people on the mountain, yet minutes from town.",
    author: "Placeholder guest",
    cabin: "Ladyslipper",
    date: "September 2025",
  },
  {
    quote:
      "We walked to dinner on the Parkway and came back to string lights, the firepit and the hot tub. Perfect location and super responsive hosts.",
    author: "Placeholder guest",
    cabin: "Firefly Bungalow #2",
    date: "August 2025",
  },
  {
    quote:
      "Rustic charm with every comfort. We brought our pup, built a fire and didn't want to leave. Already planning our anniversary trip back.",
    author: "Placeholder guest",
    cabin: "Wild Columbine",
    date: "July 2025",
  },
];
