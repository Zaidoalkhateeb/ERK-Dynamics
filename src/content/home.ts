export const technologies = [
  {
    id: "exoskeletons",
    number: "01",
    name: "Exoskeletons",
    tagline: "Wearable robotics",
    description:
      "Passive wearable systems that support the back, shoulders, and hips during demanding physical work—without batteries or powered actuation.",
    href: "/products-services/#exoskeletons",
  },
  {
    id: "lidar",
    number: "02",
    name: "LiDAR",
    tagline: "Spatial sensing",
    description:
      "Measurement, mapping, and navigation systems that give machines and teams an accurate picture of the space they work in.",
    href: "https://think-metric.co/products/lidars",
    external: true,
  },
  {
    id: "power",
    number: "03",
    name: "Power Solutions",
    tagline: "Reliable energy",
    description:
      "Dependable power for equipment operating away from fixed infrastructure, across changing industrial conditions.",
    href: "https://think-metric.co/products/remote-power-supply-systems",
    external: true,
  },
] as const;

export const partners = [
  {
    id: "auxivo",
    name: "Auxivo",
    logo: "/media/partners/auxivo-logo.png",
    origin: "",
    description:
      "Swiss developer of passive industrial exoskeletons, engineered around freedom of movement and fast daily use.",
    tags: ["Wearable robotics", "Passive support"],
    website: "https://www.auxivo.com/",
  },
  {
    id: "leice",
    name: "LEICE",
    logo: "/media/partners/leice-logo.png",
    origin: "",
    description:
      "Sensing and measurement technologies supporting mapping, navigation, and spatial awareness in industrial settings.",
    tags: ["LiDAR systems", "Remote sensing"],
    website: "https://www.leice-lidar.com/en/",
  },
] as const;

export const productImages: Record<string, string> = {
  "auxivo-omnisuit": "/media/home/omnisuit-card.webp",
  "auxivo-liftsuit": "/media/home/liftsuit-card.webp",
  "auxivo-deltasuit": "/media/home/deltasuit-card.webp",
  "auxivo-carrysuit": "/media/home/carrysuit-card.webp",
};

export const figures = [
  { value: 3, label: "Global technology partners", suffix: "" },
  { value: 4, label: "Exoskeleton solutions", suffix: "" },
  { value: 3, label: "Core technology areas", suffix: "" },
  { value: 5, label: "Industrial sectors", suffix: "+" },
] as const;
