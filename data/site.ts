export const site = {
  name: "Vacay To The Smokies",
  tagline: "Romantic hot-tub cabins in the Great Smoky Mountains",
  url: "https://www.vacaytothesmokies.com",
  phone: "(865) 375-8621",
  phoneHref: "tel:+18653758621",
  email: "reservations@vacaytothesmokies.com",
  location: "Pigeon Forge & Gatlinburg, Tennessee",
  rating: 4.93,
  reviewCount: 263,
  socials: {
    facebook: "https://www.facebook.com/vacaytothesmokies",
    instagram: "https://www.instagram.com/vacaytothesmokies",
  },
} as const;

export const navLinks = [
  { label: "Cabins", href: "/cabins" },
  { label: "Amenities", href: "/#amenities" },
  { label: "Explore", href: "/#explore" },
  { label: "Reviews", href: "/#reviews" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
] as const;
