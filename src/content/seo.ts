/** Search copy must describe visible, approved content. No fabricated ratings or offers. */
export const pageSeo = {
  "/": {
    title: "ERK Dynamics | Exoskeletons & Industrial Technology",
    label: "Home",
    description:
      "Explore Auxivo industrial exoskeletons, LiDAR and power solutions with ERK Dynamics in Türkiye. Discuss your application or request a demonstration.",
    type: "WebPage",
  },
  "/products-services": {
    title: "Industrial Exoskeletons, LiDAR & Power Solutions",
    label: "Products & Services",
    description:
      "Compare Auxivo exoskeletons and explore LiDAR and remote power solutions for industrial work in Türkiye, with evaluation and deployment support.",
    type: "CollectionPage",
  },
  "/industries": {
    title: "Industrial Applications & Workplace Technology",
    label: "Industries",
    description:
      "Explore technology applications for manufacturing, logistics, construction, automotive and shipbuilding with ERK Dynamics in Türkiye.",
    type: "CollectionPage",
  },
  "/partners": {
    title: "Technology Partners: Auxivo & LEICE",
    label: "Partners",
    description:
      "Meet ERK Dynamics technology partners Auxivo and LEICE. Explore passive exoskeletons and LiDAR technologies for industrial applications in Türkiye.",
    type: "CollectionPage",
  },
  "/about": {
    title: "About ERK Dynamics | Industrial Technology in Türkiye",
    label: "About Us",
    description:
      "ERK Dynamics connects global industrial technology manufacturers with businesses in Türkiye through product expertise, local support and evaluation.",
    type: "AboutPage",
  },
  "/contact": {
    title: "Contact Us | Demonstrations & Product Enquiries",
    label: "Contact Us",
    description:
      "Contact ERK Dynamics in Istanbul, Türkiye for exoskeleton demonstrations, industrial technology quotations, product support and partnership enquiries.",
    type: "ContactPage",
  },
  "/become-a-partner": {
    title: "Become an Industrial Technology Partner",
    label: "Become a Partner",
    description:
      "Discuss a partnership with ERK Dynamics to introduce industrial technology to Türkiye. Share your products, organization and market opportunity.",
    type: "WebPage",
  },
} as const;

export const productSeoDescriptions: Record<string, string> = {
  "auxivo-omnisuit":
    "Explore the Auxivo OmniSuit passive exoskeleton for overhead, lifting and mixed tasks. Request a demonstration from ERK Dynamics in Türkiye.",
  "auxivo-liftsuit":
    "Explore the Auxivo LiftSuit passive exoskeleton for lifting and forward-leaning work. Contact ERK Dynamics in Türkiye for a demonstration or quote.",
  "auxivo-deltasuit":
    "Explore the Auxivo DeltaSuit shoulder exoskeleton for overhead industrial work. Request a demonstration or quote from ERK Dynamics in Türkiye.",
  "auxivo-carrysuit":
    "Explore the Auxivo CarrySuit passive exoskeleton for carrying and material handling. Discuss your application with ERK Dynamics in Türkiye.",
};
