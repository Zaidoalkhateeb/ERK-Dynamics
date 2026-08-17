"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const nav = [
  ["", "Home"],
  ["products-services", "Products"],
  ["industries", "Industries"],
  ["partners", "Partners"],
  ["about", "About Us"],
  ["contact", "Contact Us"],
] as const;

const productCategories = [
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
function Logo() {
  return (
    <Link href="/" className="logo" aria-label="ERK Dynamics home">
      <span className="company-logo-mark" aria-hidden="true">
        <img src="/media/erk-dragonfly.png" alt="" width="833" height="479" />
      </span>
      <span>
        ERK <b>DYNAMICS</b>
      </span>
    </Link>
  );
}
export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const currentPath = pathname.replace(/\/+$/, "") || "/";
  const isProduct = currentPath.startsWith("/products/");
  const [open, setOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [exoskeletonsOpen, setExoskeletonsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [onDark, setOnDark] = useState(isProduct);
  useEffect(() => {
    const fn = () => setScrolled(scrollY > 24);
    addEventListener("scroll", fn, { passive: true });
    return () => removeEventListener("scroll", fn);
  }, []);
  useEffect(() => {
    if (!isProduct) {
      setOnDark(false);
      return;
    }
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
  useEffect(() => {
    setOpen(false);
    setProductsOpen(false);
    setExoskeletonsOpen(false);
  }, [pathname]);

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
          {nav.map(([href, label]) => href === "products-services" ? (
            <div className="nav-products" key={href}>
              <Link
                href={`/${href}`}
                className={currentPath === `/${href}` || currentPath.startsWith("/products/") ? "active" : ""}
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
                  <Link href="/products-services">View all technologies <span className="site-arrow" aria-hidden="true" /></Link>
                </div>
                <div className="nav-products-grid">
                  {productCategories.map((category) => category.name === "Exoskeleton" ? (
                    <div key={category.name} className={`nav-product-category nav-product-category--exoskeletons ${isProduct ? "is-current" : ""}`}>
                      <strong>{category.name}</strong>
                      <div className="nav-exoskeleton-products">
                        <a href="/products/auxivo-omnisuit" className={currentPath === "/products/auxivo-omnisuit" ? "is-active" : ""} aria-current={currentPath === "/products/auxivo-omnisuit" ? "page" : undefined}>
                          <b>OmniSuit</b>
                        </a>
                        <a href="/products/auxivo-liftsuit" className={currentPath === "/products/auxivo-liftsuit" ? "is-active" : ""} aria-current={currentPath === "/products/auxivo-liftsuit" ? "page" : undefined}>
                          <b>LiftSuit</b>
                        </a>
                        <a href="/products/auxivo-deltasuit" className={currentPath === "/products/auxivo-deltasuit" ? "is-active" : ""} aria-current={currentPath === "/products/auxivo-deltasuit" ? "page" : undefined}>
                          <b>DeltaSuit</b>
                        </a>
                        <a href="/products/auxivo-carrysuit" className={currentPath === "/products/auxivo-carrysuit" ? "is-active" : ""} aria-current={currentPath === "/products/auxivo-carrysuit" ? "page" : undefined}>
                          <b>CarrySuit</b>
                        </a>
                      </div>
                    </div>
                  ) : (
                    <a key={category.name} className="nav-product-category" href={category.href} target="_blank" rel="noopener noreferrer">
                      <strong>{category.name}</strong>
                      <i>Visit Think Metric <span className="site-arrow" aria-hidden="true" /></i>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <Link key={href} href={`/${href}`} className={currentPath === `/${href}` ? "active" : ""}>
              {label}
            </Link>
          ))}
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
      >
        <div className="menu-grid">
          <div className="menu-links">
            {nav.map(([href, label], i) => href === "products-services" ? (
              <div className={`menu-product-group ${productsOpen ? "is-open" : ""}`} key={href}>
                <div className="menu-disclosure">
                  <Link className="menu-disclosure-link" href={`/${href}`} onClick={() => setOpen(false)}>
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
                <div id="mobile-product-categories" className="menu-product-categories" hidden={!productsOpen}>
                  {productCategories.map((category) => category.name === "Exoskeleton" ? (
                    <div key={category.name} className={`menu-exoskeleton-category ${exoskeletonsOpen ? "is-open" : ""}`}>
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
                      <div id="mobile-exoskeleton-products" className="menu-exoskeleton-products" hidden={!exoskeletonsOpen}>
                        <a href="/products/auxivo-omnisuit" className={currentPath === "/products/auxivo-omnisuit" ? "is-active" : ""} aria-current={currentPath === "/products/auxivo-omnisuit" ? "page" : undefined}>
                          <span>OmniSuit</span>
                        </a>
                        <a href="/products/auxivo-liftsuit" className={currentPath === "/products/auxivo-liftsuit" ? "is-active" : ""} aria-current={currentPath === "/products/auxivo-liftsuit" ? "page" : undefined}>
                          <span>LiftSuit</span>
                        </a>
                        <a href="/products/auxivo-deltasuit" className={currentPath === "/products/auxivo-deltasuit" ? "is-active" : ""} aria-current={currentPath === "/products/auxivo-deltasuit" ? "page" : undefined}>
                          <span>DeltaSuit</span>
                        </a>
                        <a href="/products/auxivo-carrysuit" className={currentPath === "/products/auxivo-carrysuit" ? "is-active" : ""} aria-current={currentPath === "/products/auxivo-carrysuit" ? "page" : undefined}>
                          <span>CarrySuit</span>
                        </a>
                      </div>
                    </div>
                  ) : (
                    <a key={category.name} href={category.href} target="_blank" rel="noopener noreferrer">
                      <strong>{category.name}</strong>
                    </a>
                  ))}
                </div>
              </div>
            ) : (
              <Link key={href} href={`/${href}`}>
                <small>0{i + 1}</small>
                {label}
              </Link>
            ))}
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
              <a href="tel:+905372574543">+90 537 257 45 43</a>
              <a href="mailto:info@erkdynamics.com">info@erkdynamics.com</a>
            </div>
          </aside>
        </div>
      </div>
      <div id="main">{children}</div>
      <ContactRail />
      <Footer />
    </>
  );
}

function ContactRail() {
  const railRef = useRef<HTMLElement>(null);
  const [onFooter, setOnFooter] = useState(false);

  // The rail sits on the teal footer once the page bottoms out; it inverts there
  // so it stays readable instead of blending into the footer.
  useEffect(() => {
    const sync = () => {
      const rail = railRef.current;
      const footer = document.querySelector("footer");
      if (!rail || !footer) return;
      const railBox = rail.getBoundingClientRect();
      const footerBox = footer.getBoundingClientRect();
      setOnFooter(footerBox.top < railBox.bottom && footerBox.bottom > railBox.top);
    };

    sync();
    addEventListener("scroll", sync, { passive: true });
    addEventListener("resize", sync);
    return () => {
      removeEventListener("scroll", sync);
      removeEventListener("resize", sync);
    };
  }, []);

  const items = [
    {
      label: "+90 537 257 45 43",
      href: "tel:+905372574543",
      icon: <PhoneIcon />,
    },
    {
      label: "WhatsApp",
      href: "https://wa.me/905372574543?text=Hello%20ERK%20Dynamics%2C%20I%20would%20like%20to%20discuss%20an%20industrial%20technology%20requirement.",
      icon: <WhatsAppIcon />,
      external: true,
    },
    {
      label: "info@erkdynamics.com",
      href: "mailto:info@erkdynamics.com",
      icon: <MailIcon />,
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/company/erk-dynamics/",
      icon: <LinkedInIcon />,
      external: true,
    },
  ];

  return (
    <aside
      ref={railRef}
      className={`contact-rail ${onFooter ? "contact-rail--on-footer" : ""}`}
      aria-label="Direct contact"
    >
      {items.map((item) => (
        <a
          key={item.label}
          href={item.href}
          aria-label={item.label}
          title={item.label}
          target={item.external ? "_blank" : undefined}
          rel={item.external ? "noopener noreferrer" : undefined}
        >
          <span className="contact-rail__label">{item.label}</span>
          <span className="contact-rail__icon" aria-hidden="true">{item.icon}</span>
        </a>
      ))}
    </aside>
  );
}

function PhoneIcon() {
  return <svg viewBox="0 0 24 24"><path d="M7.2 3.5 4.8 4.7c-.8.4-1.2 1.3-1 2.2 1.4 6.7 6.6 11.9 13.3 13.3.9.2 1.8-.2 2.2-1l1.2-2.4-4-2-1.4 2.1c-3.6-1.1-6.9-4.4-8-8l2.1-1.4-2-4Z" /></svg>;
}

function WhatsAppIcon() {
  return <svg viewBox="0 0 24 24"><path d="M20.5 11.7a8.4 8.4 0 0 1-12.4 7.4L3 20.5l1.4-4.9a8.4 8.4 0 1 1 16.1-3.9Z" /><path d="M8.4 7.5c.2-.5.4-.5.8-.5h.4c.2 0 .4.1.5.4l.8 2c.1.3.1.5-.1.7l-.6.8c-.2.2-.2.4 0 .7.7 1.3 1.7 2.3 3 3 .3.2.5.1.7-.1l.9-1.1c.2-.3.4-.3.7-.2l2 .9c.3.1.4.3.4.5 0 .6-.3 1.6-.8 2.1-.5.6-1.4.9-2.3.9-1.1 0-2.7-.5-4.6-2.1-2.2-1.9-3.7-4.2-3.8-5.8 0-.9.3-1.7.7-2.2.4-.4.8-.6 1.3-.6Z" /></svg>;
}

function MailIcon() {
  return <svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="1.5" /><path d="m4 7 8 6 8-6" /></svg>;
}

function LinkedInIcon() {
  return <svg viewBox="0 0 24 24"><path d="M6.5 8.5V19M6.5 5.2v.1M10.5 19v-6c0-2.1 1.3-3.5 3.3-3.5s3.7 1.3 3.7 4V19M10.5 9.8V19" /></svg>;
}

const whatsappLink =
  "https://wa.me/905372574543?text=Hello%20ERK%20Dynamics%2C%20I%20would%20like%20to%20discuss%20an%20industrial%20technology%20requirement.";

function FooterTechnologyMotifs() {
  return (
    <div className="footer-tech-motifs" aria-hidden="true">
      <svg className="footer-tech-motif footer-tech-motif--wearable" viewBox="0 0 220 260">
        <g className="footer-object-orbits">
          <circle cx="110" cy="132" r="92" />
          <circle cx="110" cy="132" r="70" />
          <circle cx="110" cy="132" r="48" />
        </g>
        <g className="footer-wearable-frame">
          <circle cx="110" cy="38" r="18" />
          <path d="M110 57v82M110 76 76 104M110 76l34 28M110 139l-31 86M110 139l33 86" />
          <path d="M89 77 76 146l20 11M131 77l13 69-20 11" />
        </g>
        <g className="footer-wearable-energy">
          <path d="M94 68 81 116l15 41M126 68l18 48-20 41M97 143l-18 82M123 143l20 82" />
        </g>
        <g className="footer-wearable-joints"><circle cx="81" cy="116" r="5"/><circle cx="96" cy="157" r="5"/><circle cx="144" cy="116" r="5"/><circle cx="124" cy="157" r="5"/></g>
      </svg>

      <svg className="footer-tech-motif footer-tech-motif--lidar" viewBox="0 0 260 230">
        <g className="footer-lidar-rings"><circle cx="126" cy="112" r="88"/><circle cx="126" cy="112" r="64"/><circle cx="126" cy="112" r="40"/></g>
        <g className="footer-lidar-unit"><path d="m78 108 14-25h55l14 25-14 25H92Z"/><path d="M104 133h43v25h-43Z"/><path d="m110 158-9 27h49l-9-27Z"/><circle cx="126" cy="108" r="13"/><path d="M113 108h26M126 95v26"/></g>
        <g className="footer-lidar-scan"><path d="M126 108 214 44M126 108l105-13M126 108l99 42"/><circle cx="214" cy="44" r="6"/><circle cx="225" cy="150" r="4"/></g>
      </svg>

      <svg className="footer-tech-motif footer-tech-motif--shared" viewBox="0 0 320 220">
        <path className="footer-shared-wire" d="M38 108h52M230 108h52" />
        <circle className="footer-shared-ring footer-shared-ring--left" cx="128" cy="108" r="58" />
        <circle className="footer-shared-ring footer-shared-ring--right" cx="192" cy="108" r="58" />
        <g className="footer-shared-core"><rect x="144" y="92" width="32" height="32" rx="4" transform="rotate(45 160 108)"/><circle cx="160" cy="108" r="6"/></g>
        <g className="footer-shared-points"><circle cx="32" cy="108" r="6"/><circle cx="288" cy="108" r="6"/><circle cx="80" cy="108" r="4"/><circle cx="240" cy="108" r="4"/></g>
        <text className="footer-shared-label" x="32" y="148" textAnchor="middle">GLOBAL</text>
        <text className="footer-shared-label" x="288" y="148" textAnchor="middle">LOCAL</text>
        <text className="footer-shared-label footer-shared-label--core" x="160" y="194" textAnchor="middle">SHARED VALUE</text>
      </svg>

    </div>
  );
}

function Footer() {
  return (
    <footer>
      <div className="footer-grid expanded">
        <div className="footer-brand">
          <Logo />
        </div>
        <FooterTechnologyMotifs />
        <div className="footer-links footer-links--explore">
          <b>EXPLORE</b>
          <Link href="/industries">Industries</Link>
          <Link href="/partners">Partners</Link>
          <Link href="/about">About Us</Link>
          <Link href="/contact">Contact Us</Link>
        </div>
        <div className="footer-links footer-links--products">
          <b>PRODUCTS</b>
          <Link href="/products-services#exoskeletons">Exoskeleton</Link>
          <Link href="/products-services#lidar">Lidar</Link>
          <Link href="/products-services#remote-power">Power Supply</Link>
        </div>
        <div className="footer-links footer-links--contact">
          <b>CONTACT</b>
          <a href="tel:+905372574543">+90 537 257 45 43</a>
          <a href="mailto:info@erkdynamics.com">info@erkdynamics.com</a>
          <a
            href="https://www.linkedin.com/company/erk-dynamics/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="ERK Dynamics on LinkedIn"
          >
            ERK Dynamics
          </a>
        </div>
      </div>
    </footer>
  );
}
