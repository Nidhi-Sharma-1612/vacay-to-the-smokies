import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { Welcome } from "@/components/sections/Welcome";
import { FeaturedCabins } from "@/components/sections/FeaturedCabins";
import { Amenities } from "@/components/sections/Amenities";
import { TwoWays } from "@/components/sections/TwoWays";
import { Explore } from "@/components/sections/Explore";
import { Reviews } from "@/components/sections/Reviews";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { HiddenGems } from "@/components/sections/HiddenGems";
import { BookingDirect } from "@/components/sections/BookingDirect";
import { getCmsCabins } from "@/lib/cabin-cms";
import { accentStr, getPageSections, img, str } from "@/lib/cms";

export default async function Home() {
  const [cabins, sections] = await Promise.all([getCmsCabins(), getPageSections("home")]);
  const hero = sections.hero ?? {};
  const cabinsIntro = sections.cabinsIntro ?? {};
  return (
    <>
      <Navbar />
      <main>
        <Hero
          eyebrow={str(hero, "eyebrow", "Gatlinburg · Pigeon Forge · Smoky Mountains")}
          heading={accentStr(hero, "heading", "Find your *place* in the Great Smoky Mountains")}
          subheading={str(hero, "subheading", "Hidden in the woods or steps from the Parkway.")}
          description={str(
            hero,
            "description",
            "Private hot tubs, romantic retreats and unforgettable Smoky Mountain stays.",
          )}
          image={img(hero, "image", "/images/hero-smokies.jpg")}
          cabins={cabins}
        />
        <TrustStrip />
        <Welcome />
        <FeaturedCabins
          cabins={cabins}
          eyebrow={str(cabinsIntro, "eyebrow", "Our cabins")}
          heading={accentStr(cabinsIntro, "heading", "Find your *hideaway*")}
          description={str(
            cabinsIntro,
            "description",
            "A hand-picked collection of Smoky Mountain hideaways, each with its own private hot tub. Most are made just for two. Choose a secluded cabin beneath the trees or an in-town bungalow steps from the Pigeon Forge Parkway.",
          )}
        />
        <Amenities />
        <TwoWays />
        <Explore />
        <Reviews />
        <FinalCTA />
        <HiddenGems />
        <BookingDirect />
      </main>
      <Footer />
    </>
  );
}
