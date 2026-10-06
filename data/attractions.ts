export type Attraction = {
  name: string;
  distance: string;
  description: string;
  image: string;
  credit: string;
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
    image: "/images/explore/pigeon-forge.jpg",
    credit: "Pigeon Forge Parkway · Wikimedia Commons, CC BY-SA 4.0",
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
