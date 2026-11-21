/** A single, public HTTPS origin for canonicals, schemas and deployment rules. */
export function canonicalOrigin(value: string): string {
  const url = new URL(value);
  if (
    url.protocol !== "https:" ||
    url.username ||
    url.password ||
    url.port ||
    url.pathname !== "/" ||
    url.search ||
    url.hash ||
    !/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(url.hostname)
  ) {
    throw new Error(
      "NEXT_PUBLIC_SITE_URL must be a public HTTPS origin without a path, port or credentials.",
    );
  }
  return url.origin;
}

export function canonicalPath(pathname: string): string {
  if (!pathname.startsWith("/") || pathname.startsWith("//") || /[?#\\]/.test(pathname)) {
    throw new Error("Canonical paths must be local paths without queries or fragments.");
  }
  return pathname === "/" ? "/" : `${pathname.replace(/\/+$/, "")}/`;
}
