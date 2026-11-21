import { canonicalOrigin } from "@/lib/site-url";
/** Shared company details. Keep page copy in the other content modules. */
export const site = {
  name: "ERK Dynamics",
  url: canonicalOrigin(process.env.NEXT_PUBLIC_SITE_URL || "https://www.erkdynamics.com"),
  description:
    "Industrial exoskeletons, LiDAR and power solutions with local expertise in Türkiye.",
  logo: "/media/erk-dragonfly.png",
  socialImage: "/seo/erk-dynamics.png",
  email: "info@erkdynamics.com",
  phone: "+90 537 257 45 43",
  phoneHref: "tel:+905372574543",
  whatsapp:
    "https://wa.me/905372574543?text=Hello%20ERK%20Dynamics%2C%20I%20would%20like%20to%20discuss%20an%20industrial%20technology%20requirement.",
  linkedIn: "https://www.linkedin.com/company/erkdynamics/",
  location: "Istanbul, Türkiye",
} as const;
