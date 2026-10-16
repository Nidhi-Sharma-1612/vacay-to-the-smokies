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

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TrustStrip />
        <Welcome />
        <FeaturedCabins />
        <HiddenGems />
        <Amenities />
        <TwoWays />
        <Explore />
        <Reviews />
        <FinalCTA />
        <BookingDirect />
      </main>
      <Footer />
    </>
  );
}
