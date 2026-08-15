"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

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
        <Image src="/media/erk-dragonfly.png" alt="" width={833} height={479} sizes="54px" />
      </span>
      <span>
        ERK <b>DYNAMICS</b>
      </span>
    </Link>
  );
}
export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isProduct = pathname.startsWith("/products/");
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
  return (
    <>
      <a href="#main" className="skip">
        Skip to content
      </a>
      <header
        className={`header ${pathname === "/" ? "home" : ""} ${onDark ? "on-dark" : ""} ${scrolled ? "scrolled" : ""} ${open ? "menu-open" : ""}`}
      >
        <Logo />
        <nav className="desktop-nav" aria-label="Primary">
          {nav.map(([href, label]) => href === "products-services" ? (
            <div className="nav-products" key={href}>
              <Link
                href={`/${href}`}
                className={pathname === `/${href}` || pathname.startsWith("/products/") ? "active" : ""}
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
                        <a href="/products/auxivo-liftsuit" className={pathname === "/products/auxivo-liftsuit" ? "is-active" : ""} aria-current={pathname === "/products/auxivo-liftsuit" ? "page" : undefined}>
                          <b>Auxivo LiftSuit</b>
                        </a>
                        <a href="/products/auxivo-omnisuit" className={pathname === "/products/auxivo-omnisuit" ? "is-active" : ""} aria-current={pathname === "/products/auxivo-omnisuit" ? "page" : undefined}>
                          <b>Auxivo OmniSuit</b>
                        </a>
                        <a href="/products/auxivo-deltasuit" className={pathname === "/products/auxivo-deltasuit" ? "is-active" : ""} aria-current={pathname === "/products/auxivo-deltasuit" ? "page" : undefined}>
                          <b>Auxivo DeltaSuit</b>
                        </a>
                        <a href="/products/auxivo-carrysuit" className={pathname === "/products/auxivo-carrysuit" ? "is-active" : ""} aria-current={pathname === "/products/auxivo-carrysuit" ? "page" : undefined}>
                          <b>Auxivo CarrySuit</b>
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
            <Link key={href} href={`/${href}`} className={pathname === `/${href}` ? "active" : ""}>
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
                        <a href="/products/auxivo-liftsuit" className={pathname === "/products/auxivo-liftsuit" ? "is-active" : ""} aria-current={pathname === "/products/auxivo-liftsuit" ? "page" : undefined}>
                          <span>Auxivo LiftSuit</span>
                        </a>
                        <a href="/products/auxivo-omnisuit" className={pathname === "/products/auxivo-omnisuit" ? "is-active" : ""} aria-current={pathname === "/products/auxivo-omnisuit" ? "page" : undefined}>
                          <span>Auxivo OmniSuit</span>
                        </a>
                        <a href="/products/auxivo-deltasuit" className={pathname === "/products/auxivo-deltasuit" ? "is-active" : ""} aria-current={pathname === "/products/auxivo-deltasuit" ? "page" : undefined}>
                          <span>Auxivo DeltaSuit</span>
                        </a>
                        <a href="/products/auxivo-carrysuit" className={pathname === "/products/auxivo-carrysuit" ? "is-active" : ""} aria-current={pathname === "/products/auxivo-carrysuit" ? "page" : undefined}>
                          <span>Auxivo CarrySuit</span>
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
            <Link href="/products/auxivo-liftsuit">
              LiftSuit <span className="site-arrow" aria-hidden="true" />
            </Link>
            <Link href="/products/auxivo-omnisuit">
              OmniSuit <span className="site-arrow" aria-hidden="true" />
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
    <aside className="contact-rail" aria-label="Direct contact">
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
      <svg className="footer-tech-motif footer-tech-motif--wearable" viewBox="0 0 160 220">
        <g className="footer-wearable-frame">
          <circle cx="80" cy="28" r="18" />
          <path d="M80 47v73M80 67 47 93M80 67l33 26M80 120l-24 75M80 120l28 75" />
          <path d="M58 70 47 128l18 8M102 70l12 58-19 8" />
        </g>
        <g className="footer-wearable-energy">
          <path d="M64 58 52 105l13 31M96 58l18 47-19 31M68 122l-12 73M92 122l16 73" />
        </g>
        <g className="footer-wearable-joints"><circle cx="52" cy="105" r="5"/><circle cx="65" cy="136" r="5"/><circle cx="114" cy="105" r="5"/><circle cx="95" cy="136" r="5"/></g>
      </svg>

      <svg className="footer-tech-motif footer-tech-motif--lidar" viewBox="0 0 220 220">
        <g className="footer-lidar-rings"><circle cx="110" cy="102" r="82"/><circle cx="110" cy="102" r="58"/><circle cx="110" cy="102" r="34"/></g>
        <g className="footer-lidar-scan"><path d="M110 162 177 65"/><circle cx="177" cy="65" r="5"/></g>
        <g className="footer-lidar-unit"><path d="m75 164 12-28h46l12 28-8 35H83Z"/><path d="M87 136h46l-8-20H95Z"/><circle cx="110" cy="127" r="5"/></g>
      </svg>

      <svg className="footer-tech-motif footer-tech-motif--power" viewBox="0 0 240 180">
        <g className="footer-power-cells"><path d="M18 30h30l9 16-9 16H18L9 46Z"/><path d="M61 30h30l9 16-9 16H61L52 46Z"/><path d="M18 70h30l9 16-9 16H18L9 86Z"/><path d="M182 70h30l9 16-9 16h-30l-9-16Z"/><path d="M182 110h30l9 16-9 16h-30l-9-16Z"/></g>
        <g className="footer-power-flow"><path d="M18 126h61l22-22h38l23-22h50"/><path d="M44 151h80l22-22h66"/></g>
        <g className="footer-power-core"><rect x="82" y="28" width="78" height="98" rx="8"/><rect x="95" y="42" width="52" height="49" rx="4"/><path d="m124 49-17 25h14l-7 13 22-27h-14Z"/><path d="M104 108h34"/></g>
        <g className="footer-power-pulses"><circle cx="18" cy="126" r="4"/><circle cx="212" cy="82" r="4"/><circle cx="212" cy="129" r="4"/></g>
      </svg>
    </div>
  );
}

function Footer() {
  return (
    <footer>
      <FooterTechnologyMotifs />
      <div className="footer-grid expanded">
        <div>
          <Logo />
          <p>
            Connecting global innovation
            <br />
            {" "}with Turkish industry.
          </p>
        </div>
        <div>
          <b>EXPLORE</b>
          <Link href="/industries">Industries</Link>
          <Link href="/partners">Partners</Link>
          <Link href="/about">About Us</Link>
          <Link href="/contact">Contact Us</Link>
        </div>
        <div>
          <b>PRODUCTS</b>
          <Link href="/products-services#exoskeletons">Exoskeleton</Link>
          <Link href="/products-services#lidar">Lidar</Link>
          <Link href="/products-services#remote-power">Power Supply</Link>
        </div>
        <div>
          <b>CONTACT</b>
          <a href="tel:+905372574543">Phone</a>
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
            WhatsApp
          </a>
          <a href="mailto:info@erkdynamics.com">Email</a>
          <a
            href="https://www.linkedin.com/company/erk-dynamics/"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
