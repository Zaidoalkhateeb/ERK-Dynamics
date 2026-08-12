/** @type {import('next').NextConfig} */
const nextConfig = {
  // Produce a fully static site (the `out/` folder) for upload to static hosting (Vesta).
  output: "export",
  // Static hosting can't run Next's image optimizer, so serve images as-is.
  images: { unoptimized: true },
  // Emit each route as a folder with index.html (e.g. /about/index.html) so
  // Apache/Nginx serve clean URLs without extra rewrite rules.
  trailingSlash: true,
};

export default nextConfig;
