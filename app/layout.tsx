import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import { MotionProvider } from "@/components/ui/MotionProvider";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["SOFT", "opsz"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vacay To The Smokies | Romantic Hot Tub Cabins in Pigeon Forge & Gatlinburg",
  description:
    "Secluded, pet-friendly cabins for two in the Great Smoky Mountains, with private hot tubs, fireside Jacuzzis and forest views minutes from Gatlinburg, Pigeon Forge and Dollywood.",
  metadataBase: new URL("https://www.vacaytothesmokies.com"),
  openGraph: {
    title: "Vacay To The Smokies",
    description: "Hidden cabins for two in the Great Smoky Mountains.",
    images: ["/images/hero-smokies.jpg"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // data-scroll-behavior lets Next.js jump instantly on navigation while in-page anchors stay smooth.
    <html lang="en" data-scroll-behavior="smooth" className={`${fraunces.variable} ${manrope.variable} antialiased`}>
      <body className="min-h-full overflow-x-clip">
        <ScrollToTop />
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
