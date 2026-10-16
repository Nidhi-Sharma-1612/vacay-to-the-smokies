export type Attraction = {
  name: string;
  distance: string;
  description: string;
  image: string;
  /** Attribution for licensed photos; omitted for the owner's own images. */
  credit?: string;
  /** CSS object-position for the card crop (default centered). */
  focus?: string;
};

// Photos from Wikimedia Commons; credits are shown in the footer.
export const attractions: Attraction[] = [
  {
    name: "Great Smoky Mountains National Park",
    distance: "10 mi",
    description:
      "Misty ridgelines, waterfalls and 800+ miles of trails. Catch sunrise at Clingmans Dome or drive the Cades Cove loop.",
    image: "/images/explore/national-park.jpg",
    credit: "Clingmans Dome view · Wikimedia Commons, CC BY-SA 4.0",
  },
  {
    name: "Downtown Gatlinburg",
    distance: "5–11 mi",
    description:
      "Stroll the lantern-lit Parkway for mountain crafts, moonshine tastings, cozy dinners and the SkyBridge.",
    image: "/images/explore/gatlinburg.jpg",
    credit: "Gatlinburg Parkway at night · Wikimedia Commons, CC BY 4.0",
  },
  {
    name: "Pigeon Forge Parkway",
    distance: "Steps away",
    description:
      "Dinner shows, museums, go-karts and trolley stops, right outside the door of our Parkway bungalows.",
    image: "/images/explore/pigeon-forge.jpeg",
    // The photo has a "Pigeon Forge Parkway, US 441" label on its left; keep it in the tall card crop.
    focus: "left center",
  },
  {
    name: "Dollywood",
    distance: "5 mi",
    description:
      "Dolly Parton's award-winning theme park, home to roller coasters, Smoky Mountain music and seasonal festivals of lights.",
    image: "/images/explore/dollywood.jpg",
    credit: "Dollywood · Wikimedia Commons, CC0",
  },
];
