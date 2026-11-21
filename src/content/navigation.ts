export const nav = [
  ["", "Home"],
  ["products-services", "Products"],
  ["industries", "Industries"],
  ["partners", "Partners"],
  ["about", "About Us"],
  ["contact", "Contact Us"],
] as const;

export const productCategories = [
  {
    name: "Exoskeleton",
    href: "/products-services",
    external: false,
  },
  {
    name: "LiDAR",
    href: "https://think-metric.co/products/lidars",
    external: true,
  },
  {
    name: "Power Supply",
    href: "https://think-metric.co/products/remote-power-supply-systems",
    external: true,
  },
] as const;
