export const siteConfig = {
  name: "Rebuilding in Public",
  tagline: "A podcast about building businesses in the open — the wins, the wreckage, and everything in between.",
  description:
    "Rebuilding in Public is a podcast following founders and operators who share what's actually happening as they rebuild, pivot, and grow — in public, warts and all.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  links: {
    apple: "#",
    spotify: "#",
    youtube: "#",
  },
  nav: [
    { href: "/", label: "Home" },
    { href: "/blog", label: "Blog" },
    { href: "/store", label: "Store" },
    { href: "/about", label: "About" },
  ],
};
