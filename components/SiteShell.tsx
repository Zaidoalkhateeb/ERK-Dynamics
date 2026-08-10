"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CookieControls } from "./CookieControls";

const nav = [
  ["products-services", "Products"],
  ["about", "About Us"],
  ["partners", "Partners"],
  ["contact", "Contact Us"],
] as const;

const productCategories = [
  {
    name: "Exoskeletons",
    description: "Wearable robotics for safer industrial work.",
    href: "/products-services",
    external: false,
  },
  {
    name: "LiDAR",
    description: "From Think Metric, an ERK group company.",
    href: "https://think-metric.co/products/lidars",
    external: true,
  },
  {
    name: "Power Supply",
    description: "From Think Metric, an ERK group company.",
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
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(scrollY > 24);
    addEventListener("scroll", fn, { passive: true });
    return () => removeEventListener("scroll", fn);
  }, []);
  useEffect(() => setOpen(false), [pathname]);
  return (
    <>
      <a href="#main" className="skip">
        Skip to content
      </a>
      <header
        className={`header ${pathname === "/" ? "home" : ""} ${pathname.startsWith("/products/") ? "on-dark" : ""} ${scrolled ? "scrolled" : ""}`}
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
                <span className="nav-products-eyebrow">Product categories</span>
                <div className="nav-products-grid">
                  {productCategories.map((category) => category.name === "Exoskeletons" ? (
                    <div key={category.name} className="nav-product-category nav-product-category--exoskeletons">
                      <strong>{category.name}</strong>
                      <span>{category.description}</span>
                      <div className="nav-exoskeleton-products">
                        <Link href="/products/auxivo-liftsuit">
                          <b>Auxivo LiftSuit</b>
                          <em>S/M · L/XL</em>
                        </Link>
                        <Link href="/products/auxivo-omnisuit">
                          <b>Auxivo OmniSuit</b>
                          <em>S/M · L/XL</em>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <a key={category.name} className="nav-product-category" href={category.href} target="_blank" rel="noopener noreferrer">
                      <strong>{category.name}</strong>
                      <span>{category.description}</span>
                      <i>Visit Think Metric ↗</i>
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
            onClick={() => setOpen(!open)}
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
              <div className="menu-product-group" key={href}>
                <Link href={`/${href}`}>
                  <small>0{i + 1}</small>
                  {label}
                </Link>
                <div className="menu-product-categories">
                  {productCategories.map((category) => category.name === "Exoskeletons" ? (
                    <div key={category.name} className="menu-exoskeleton-category">
                      <strong>{category.name}</strong>
                      <Link href="/products/auxivo-liftsuit">
                        <span>Auxivo LiftSuit</span>
                        <small>S/M · L/XL</small>
                      </Link>
                      <Link href="/products/auxivo-omnisuit">
                        <span>Auxivo OmniSuit</span>
                        <small>S/M · L/XL</small>
                      </Link>
                    </div>
                  ) : (
                    <a key={category.name} href={category.href} target="_blank" rel="noopener noreferrer">
                      <strong>{category.name}</strong>
                      <span>ERK group company · Think Metric ↗</span>
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
              LiftSuit <span>↗</span>
            </Link>
            <Link href="/products/auxivo-omnisuit">
              OmniSuit <span>↗</span>
            </Link>
            <Link href="/become-a-partner">
              Become a partner <span>↗</span>
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
      <CookieControls />
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

function Footer() {
  return (
    <footer>
      <div className="footer-grid expanded">
        <div>
          <Logo />
          <p>
            Connecting global innovation
            <br />
            with Turkish industry.
          </p>
        </div>
        <div>
          <b>EXPLORE</b>
          <Link href="/about">About Us</Link>
          <Link href="/partners">Partners</Link>
          <Link href="/become-a-partner">Become a Partner</Link>
        </div>
        <div>
          <b>PRODUCTS</b>
          <Link href="/products/auxivo-liftsuit">Auxivo LiftSuit</Link>
          <Link href="/products/auxivo-omnisuit">Auxivo OmniSuit</Link>
          <Link href="/products-services#compare">Compare Products</Link>
        </div>
        <div>
          <b>CONNECT</b>
          <a href="tel:+905372574543">Phone</a>
          <a href="https://wa.me/905372574543">WhatsApp</a>
          <a href="mailto:info@erkdynamics.com">Email</a>
          <a href="https://www.linkedin.com/company/erk-dynamics/">LinkedIn</a>
        </div>
      </div>
    </footer>
  );
}
