"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CookieControls } from "./CookieControls";

const nav = [
  ["products-services", "Products & Services"],
  ["solutions", "Solutions"],
  ["industries", "Industries"],
  ["about", "About Us"],
  ["partners", "Partners"],
  ["contact", "Contact Us"],
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
          {nav.map(([href, label]) => (
            <Link
              key={href}
              href={`/${href}`}
              className={pathname === `/${href}` ? "active" : ""}
            >
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
            {nav.map(([href, label], i) => (
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
      <Footer />
      <CookieControls />
    </>
  );
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
          <Link href="/products-services">Products & Services</Link>
          <Link href="/solutions">Solutions</Link>
          <Link href="/industries">Industries</Link>
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
          <a href="tel:+905372574543">+90 537 257 45 43</a>
          <a href="https://wa.me/905372574543">WhatsApp</a>
          <a href="mailto:info@erkdynamics.com">info@erkdynamics.com</a>
          <a href="https://www.linkedin.com/company/erk-dynamics/">LinkedIn</a>
        </div>
      </div>
    </footer>
  );
}
