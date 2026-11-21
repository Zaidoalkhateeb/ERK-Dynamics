import { site } from "@/content/site";
import Link from "next/link";
import { Logo } from "./Logo";
import { FooterTechnologyMotifs } from "./FooterTechnologyMotifs";
import { PhoneIcon, MailIcon, LinkedInIcon } from "@/components/ui/ContactIcons";
export function Footer() {
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
          <a href={site.phoneHref}>
            <span className="footer-contact-icon" aria-hidden="true">
              <PhoneIcon />
            </span>
            {site.phone}
          </a>
          <a href={`mailto:${site.email}`}>
            <span className="footer-contact-icon" aria-hidden="true">
              <MailIcon />
            </span>
            {site.email}
          </a>
          <a
            href={site.linkedIn}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="ERK Dynamics on LinkedIn"
          >
            <span className="footer-contact-icon" aria-hidden="true">
              <LinkedInIcon />
            </span>
            ERK Dynamics
          </a>
        </div>
      </div>
    </footer>
  );
}
