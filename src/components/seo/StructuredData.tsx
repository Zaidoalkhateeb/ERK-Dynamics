import { site } from "@/content/site";
import { pageSeo } from "@/content/seo";
import { publishedProducts, type Product } from "@/content/products";
import { productMedia } from "@/content/product-media";
import { serializeJsonLd } from "@/lib/json-ld";
import { canonicalPath } from "@/lib/site-url";

function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}

export function OrganizationSchema() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": `${site.url}/#organization`,
        name: site.name,
        url: `${site.url}/`,
        description: site.description,
        logo: { "@type": "ImageObject", url: `${site.url}${site.logo}`, width: 833, height: 479 },
        email: site.email,
        telephone: site.phone,
        sameAs: [site.linkedIn],
        address: { "@type": "PostalAddress", addressLocality: "Istanbul", addressCountry: "TR" },
        areaServed: { "@type": "Country", name: "Türkiye" },
      }}
    />
  );
}

export function PageSchema({ pathname, product }: { pathname: string; product?: Product }) {
  const page = pageSeo[pathname as keyof typeof pageSeo];
  const url = `${site.url}${canonicalPath(pathname)}`;
  const name = product ? `${product.manufacturer} ${product.name}` : page.label;
  const ancestors = [{ name: "Home", item: `${site.url}/` }];
  if (product)
    ancestors.push({ name: "Products & Services", item: `${site.url}/products-services/` });
  if (pathname !== "/") ancestors.push({ name, item: url });
  const graph: Record<string, unknown>[] = [
    {
      "@type": product ? "ItemPage" : page.type,
      "@id": `${url}#webpage`,
      url,
      name,
      description: product?.summary ?? page.description,
      inLanguage: "en",
      isPartOf: { "@id": `${site.url}/#website` },
      about: { "@id": `${site.url}/#organization` },
      ...(pathname !== "/" ? { breadcrumb: { "@id": `${url}#breadcrumb` } } : {}),
      ...(product ? { mainEntity: { "@id": `${url}#product` } } : {}),
    },
  ];
  if (pathname === "/")
    graph.push({
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      url: `${site.url}/`,
      name: site.name,
      alternateName: "ERK Dynamics Türkiye",
      inLanguage: "en",
      publisher: { "@id": `${site.url}/#organization` },
    });
  else
    graph.push({
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: ancestors.map((entry, index) => ({
        "@type": "ListItem",
        position: index + 1,
        ...entry,
      })),
    });
  if (pathname === "/products-services")
    graph.push({
      "@type": "ItemList",
      name: "Auxivo industrial exoskeletons",
      itemListElement: publishedProducts.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: `${item.manufacturer} ${item.name}`,
        url: `${site.url}/products/${item.slug}/`,
      })),
    });
  if (product)
    graph.push({
      "@type": "Product",
      "@id": `${url}#product`,
      name,
      description: product.summary,
      category: product.category,
      brand: { "@type": "Brand", name: product.manufacturer },
      image: [`${site.url}${productMedia[product.slug as keyof typeof productMedia].hero}`],
      url,
      mainEntityOfPage: { "@id": `${url}#webpage` },
      // Quote-only products have no public price, ratings or stock claim to mark up.
    });
  return <JsonLd data={{ "@context": "https://schema.org", "@graph": graph }} />;
}
