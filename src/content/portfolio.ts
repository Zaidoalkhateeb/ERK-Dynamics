export const categories = [
  { id: "exoskeletons", label: "Exoskeleton" },
  { id: "lidar", label: "LiDAR" },
  { id: "remote-power", label: "Power Supply" },
] as const;

export type CategoryId = (typeof categories)[number]["id"];

export const exoskeletons = [
  {
    id: "omnisuit",
    name: "OmniSuit",
    image: "/media/omnisuit-work.webp",
    detail: "/media/omnisuit-detail.webp",
    alt: "Worker using the Auxivo OmniSuit during an overhead task",
    focus: "Shoulders + lower back",
    description:
      "One passive system for work that moves between overhead activity, lifting, and forward-leaning positions.",
    tasks: ["Overhead work", "Lifting", "Mixed tasks"],
    href: "/products/auxivo-omnisuit",
    specLabel: "Sizes",
    specValue: "S/M · L/XL",
    cta: "Experience OmniSuit",
  },
  {
    id: "liftsuit",
    name: "LiftSuit",
    image: "/media/liftsuit-work.webp",
    detail: "/media/liftsuit-hero.webp",
    alt: "Worker using the Auxivo LiftSuit during industrial work",
    focus: "",
    description:
      "Lightweight passive support for repetitive lifting, low handling, and prolonged forward-leaning work.",
    tasks: ["Lifting", "Forward leaning", "Repetitive handling"],
    href: "/products/auxivo-liftsuit",
    specLabel: "Sizes",
    specValue: "S/M · L/XL",
    cta: "Experience LiftSuit",
  },
  {
    id: "deltasuit",
    name: "DeltaSuit",
    image: "/media/deltasuit-1.jpeg",
    detail: "/media/deltasuit-3.jpeg",
    alt: "Worker using the Auxivo DeltaSuit during overhead industrial work",
    focus: "Shoulders + neck",
    description:
      "Lightweight passive support for repetitive overhead work, arm elevation, and prolonged shoulder-intensive tasks.",
    tasks: ["Overhead work", "Arm support", "Shoulder relief"],
    href: "/products/auxivo-deltasuit",
    specLabel: "Sizes",
    specValue: "S/M · L/XL",
    cta: "Experience DeltaSuit",
  },
  {
    id: "carrysuit",
    name: "CarrySuit",
    image: "/media/carrysuit-1.jpeg",
    detail: "/media/carrysuit-3.jpeg",
    alt: "Worker using the Auxivo CarrySuit to carry an industrial load",
    focus: "Upper body + hips",
    description:
      "Passive load-transfer support for repetitive carrying, heavy material handling, and physically demanding transport tasks.",
    tasks: ["Load carrying", "Material handling", "Load transfer"],
    href: "/products/auxivo-carrysuit",
    specLabel: "Sizes",
    specValue: "S/M · L/XL",
    cta: "Experience CarrySuit",
  },
] as const;
