import type { MetadataRoute } from "next";
import { products } from "@/content/products";
export default function sitemap(): MetadataRoute.Sitemap { const base=process.env.NEXT_PUBLIC_SITE_URL||"https://www.erkdynamics.com"; const routes=["","/products-services","/about","/industries","/solutions","/partners","/contact","/become-a-partner",...products.filter(p=>p.status==="published").map(p=>`/products/${p.slug}`)]; return routes.map(route=>({url:`${base}${route}`,lastModified:new Date(),changeFrequency:"monthly",priority:route===""?1:.7})); }
