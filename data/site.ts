export const site = {
  name: "Vacay To The Smokies",
  tagline: "Romantic cabins with private hot tubs in the Great Smoky Mountains",
  url: "https://www.vacaytothesmokies.com",
  phone: "(865) 375-8621",
  phoneHref: "tel:+18653758621",
  email: "reservations@vacaytothesmokies.com",
  location: "Pigeon Forge & Gatlinburg, Tennessee",
  rating: 4.93,
  reviewCount: 263,
  /** OwnerRez embeddable widgets (Settings > Widgets in OwnerRez). */
  ownerRez: {
    bookingWidgetId: "8b3dab90c59248d19140b8338a8fd37c",
    searchWidgetId: "be107abb24d74b659d17b466d38f8bc5",
  },
  socials: {
    facebook: "https://www.facebook.com/vacaytothesmokies",
    instagram: "https://www.instagram.com/vacaytothesmokies",
  },
} as const;

export const navLinks = [
  { label: "Cabins", href: "/cabins" },
  { label: "Hidden Gems", href: "/hidden-gems" },
  { label: "Amenities", href: "/#amenities" },
  { label: "Explore", href: "/#explore" },
  { label: "Reviews", href: "/#reviews" },
  { label: "Smoky Mountain Guide", href: "/smoky-mountain-guide" },
  { label: "Contact", href: "/contact" },
] as const;
