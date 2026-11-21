"use client";
import { site } from "@/content/site";
import { Logo } from "./Logo";
import { nav, productCategories } from "@/content/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
export function SiteHeader() {
  const pathname = usePathname();
  return <HeaderForPath key={pathname} pathname={pathname} />;
}

function HeaderForPath({ pathname }: { pathname: string }) {
  const currentPath = pathname.replace(/\/+$/, "") || "/";
  const isProduct = currentPath.startsWith("/products/");
  const [open, setOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [exoskeletonsOpen, setExoskeletonsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [onDark, setOnDark] = useState(isProduct);
  useEffect(() => {
    const fn = () => setScrolled(scrollY > 24);
    fn();
    addEventListener("scroll", fn, { passive: true });
    return () => removeEventListener("scroll", fn);
  }, []);
  useEffect(() => {
    if (!isProduct) return;
    const probeY = 40;
    const fn = () => {
      const lights = document.querySelectorAll<HTMLElement>("[data-header-light]");
      let overLight = false;
      lights.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top <= probeY && r.bottom >= probeY) overLight = true;
      });
      setOnDark(!overLight);
    };
    fn();
    addEventListener("scroll", fn, { passive: true });
    addEventListener("resize", fn);
    return () => {
      removeEventListener("scroll", fn);
      removeEventListener("resize", fn);
    };
  }, [isProduct, pathname]);

  // Clicking a link to the page you are already on reloads it instead of doing
  // nothing. One document-level handler covers the header, the mobile menu, the
  // footer and the logo without wiring every link individually.
  useEffect(() => {
    const stripSlash = (value: string) => value.replace(/\/+$/, "");

    const reloadOnSamePage = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as Element | null)?.closest?.("a");
      if (!anchor || anchor.hasAttribute("download")) return;
      if (anchor.target && anchor.target !== "_self") return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) return;

      const url = new URL(href, window.location.href);
      // Leave other origins, in-page anchors and mailto/tel links alone.
      if (url.origin !== window.location.origin || url.hash) return;
      if (stripSlash(url.pathname) !== stripSlash(window.location.pathname)) return;

      event.preventDefault();
      // Stop next/link's own handler, which would swallow the click as a no-op.
      event.stopPropagation();
      // Land at the top rather than wherever the reader had scrolled to.
      if ("scrollRestoration" in history) history.scrollRestoration = "manual";
      window.location.reload();
    };

    // Capture phase: React attaches its listeners to the root container, so a
    // bubbling listener would arrive after next/link had already cancelled the
    // event and marked it handled.
    document.addEventListener("click", reloadOnSamePage, true);
    return () => document.removeEventListener("click", reloadOnSamePage, true);
  }, []);
  return (
    <>
      <a href="#main" className="skip">
        Skip to content
      </a>
      <header
        className={`header ${onDark ? "on-dark" : ""} ${scrolled ? "scrolled" : ""} ${open ? "menu-open" : ""}`}
      >
        <Logo />
        <nav className="desktop-nav" aria-label="Primary">
          {nav.map(([href, label]) =>
            href === "products-services" ? (
              <div className="nav-products" key={href}>
                <Link
                  href={`/${href}`}
                  className={
                    currentPath === `/${href}` || currentPath.startsWith("/products/")
                      ? "active"
                      : ""
                  }
                  aria-haspopup="true"
                >
                  {label}
                </Link>
                <div className="nav-products-dropdown">
                  <div className="nav-products-dropdown-head">
                    <div>
                      <span className="nav-products-eyebrow">Product categories</span>
                      <strong></strong>
                    </div>
                    <Link href="/products-services">
                      View all technologies <span className="site-arrow" aria-hidden="true" />
                    </Link>
                  </div>
                  <div className="nav-products-grid">
                    {productCategories.map((category) =>
                      category.name === "Exoskeleton" ? (
                        <div
                          key={category.name}
                          className={`nav-product-category nav-product-category--exoskeletons ${isProduct ? "is-current" : ""}`}
                        >
                          <strong>{category.name}</strong>
                          <div className="nav-exoskeleton-products">
                            <Link
                              href="/products/auxivo-omnisuit"
                              className={
                                currentPath === "/products/auxivo-omnisuit" ? "is-active" : ""
                              }
                              aria-current={
                                currentPath === "/products/auxivo-omnisuit" ? "page" : undefined
                              }
                            >
                              <b>OmniSuit</b>
                            </Link>
                            <Link
                              href="/products/auxivo-liftsuit"
                              className={
                                currentPath === "/products/auxivo-liftsuit" ? "is-active" : ""
                              }
                              aria-current={
                                currentPath === "/products/auxivo-liftsuit" ? "page" : undefined
                              }
                            >
                              <b>LiftSuit</b>
                            </Link>
                            <Link
                              href="/products/auxivo-deltasuit"
                              className={
                                currentPath === "/products/auxivo-deltasuit" ? "is-active" : ""
                              }
                              aria-current={
                                currentPath === "/products/auxivo-deltasuit" ? "page" : undefined
                              }
                            >
                              <b>DeltaSuit</b>
                            </Link>
                            <Link
                              href="/products/auxivo-carrysuit"
                              className={
                                currentPath === "/products/auxivo-carrysuit" ? "is-active" : ""
                              }
                              aria-current={
                                currentPath === "/products/auxivo-carrysuit" ? "page" : undefined
                              }
                            >
                              <b>CarrySuit</b>
                            </Link>
                          </div>
                        </div>
                      ) : (
                        <a
                          key={category.name}
                          className="nav-product-category"
                          href={category.href}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <strong>{category.name}</strong>
                          <i>
                            Visit Think Metric <span className="site-arrow" aria-hidden="true" />
                          </i>
                        </a>
                      ),
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={href}
                href={`/${href}`}
                className={currentPath === `/${href}` ? "active" : ""}
              >
                {label}
              </Link>
            ),
          )}
        </nav>
        <div className="header-actions">
          <button
            className="menu-button"
            onClick={() => {
              const nextOpen = !open;
              setOpen(nextOpen);
              if (nextOpen) {
                setProductsOpen(isProduct);
                setExoskeletonsOpen(isProduct);
              }
            }}
            aria-expanded={open}
            aria-controls="site-menu"
          >
            <span>{open ? "Close" : "Menu"}</span>
            <i />
            <i />
          </button>
        </div>
      </header>
      <div
        id="site-menu"
        className={`menu-panel ${open ? "open" : ""}`}
        aria-hidden={!open}
        inert={!open}
      >
        <div className="menu-grid">
          <div className="menu-links">
            {nav.map(([href, label], i) =>
              href === "products-services" ? (
                <div className={`menu-product-group ${productsOpen ? "is-open" : ""}`} key={href}>
                  <div className="menu-disclosure">
                    <Link
                      className="menu-disclosure-link"
                      href={`/${href}`}
                      onClick={() => setOpen(false)}
                    >
                      <small>0{i + 1}</small>
                      <span>{label}</span>
                    </Link>
                    <button
                      className="menu-disclosure-toggle"
                      type="button"
                      aria-expanded={productsOpen}
                      aria-controls="mobile-product-categories"
                      aria-label={`${productsOpen ? "Hide" : "Show"} product categories`}
                      onClick={() => {
                        setProductsOpen((current) => !current);
                        if (productsOpen) setExoskeletonsOpen(false);
                      }}
                    >
                      <i className="menu-chevron" aria-hidden="true" />
                    </button>
                  </div>
                  <div
                    id="mobile-product-categories"
                    className="menu-product-categories"
                    hidden={!productsOpen}
                  >
                    {productCategories.map((category) =>
                      category.name === "Exoskeleton" ? (
                        <div
                          key={category.name}
                          className={`menu-exoskeleton-category ${exoskeletonsOpen ? "is-open" : ""}`}
                        >
                          <button
                            className="menu-category-disclosure"
                            type="button"
                            aria-expanded={exoskeletonsOpen}
                            aria-controls="mobile-exoskeleton-products"
                            onClick={() => setExoskeletonsOpen((current) => !current)}
                          >
                            <strong>{category.name}</strong>
                            <i className="menu-chevron" aria-hidden="true" />
                          </button>
                          <div
                            id="mobile-exoskeleton-products"
                            className="menu-exoskeleton-products"
                            hidden={!exoskeletonsOpen}
                          >
                            <Link
                              href="/products/auxivo-omnisuit"
                              className={
                                currentPath === "/products/auxivo-omnisuit" ? "is-active" : ""
                              }
                              aria-current={
                                currentPath === "/products/auxivo-omnisuit" ? "page" : undefined
                              }
                            >
                              <span>OmniSuit</span>
                            </Link>
                            <Link
                              href="/products/auxivo-liftsuit"
                              className={
                                currentPath === "/products/auxivo-liftsuit" ? "is-active" : ""
                              }
                              aria-current={
                                currentPath === "/products/auxivo-liftsuit" ? "page" : undefined
                              }
                            >
                              <span>LiftSuit</span>
                            </Link>
                            <Link
                              href="/products/auxivo-deltasuit"
                              className={
                                currentPath === "/products/auxivo-deltasuit" ? "is-active" : ""
                              }
                              aria-current={
                                currentPath === "/products/auxivo-deltasuit" ? "page" : undefined
                              }
                            >
                              <span>DeltaSuit</span>
                            </Link>
                            <Link
                              href="/products/auxivo-carrysuit"
                              className={
                                currentPath === "/products/auxivo-carrysuit" ? "is-active" : ""
                              }
                              aria-current={
                                currentPath === "/products/auxivo-carrysuit" ? "page" : undefined
                              }
                            >
                              <span>CarrySuit</span>
                            </Link>
                          </div>
                        </div>
                      ) : (
                        <a
                          key={category.name}
                          href={category.href}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <strong>{category.name}</strong>
                        </a>
                      ),
                    )}
                  </div>
                </div>
              ) : (
                <Link key={href} href={`/${href}`}>
                  <small>0{i + 1}</small>
                  {label}
                </Link>
              ),
            )}
          </div>
          <aside>
            <p className="eyebrow">DIRECT ACCESS</p>
            <Link href="/products/auxivo-omnisuit">
              OmniSuit <span className="site-arrow" aria-hidden="true" />
            </Link>
            <Link href="/products/auxivo-liftsuit">
              LiftSuit <span className="site-arrow" aria-hidden="true" />
            </Link>
            <Link href="/products/auxivo-deltasuit">
              DeltaSuit <span className="site-arrow" aria-hidden="true" />
            </Link>
            <Link href="/products/auxivo-carrysuit">
              CarrySuit <span className="site-arrow" aria-hidden="true" />
            </Link>
            <Link href="/become-a-partner">
              Become a partner <span className="site-arrow" aria-hidden="true" />
            </Link>
            <div className="menu-contact">
              <a href={site.phoneHref}>{site.phone}</a>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
