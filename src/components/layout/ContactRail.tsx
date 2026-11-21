"use client";
import { site } from "@/content/site";
import { useEffect, useRef, useState } from "react";
import { PhoneIcon, WhatsAppIcon, MailIcon, LinkedInIcon } from "@/components/ui/ContactIcons";
export function ContactRail() {
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
      label: site.phone,
      href: site.phoneHref,
      icon: <PhoneIcon />,
    },
    {
      label: "WhatsApp",
      href: site.whatsapp,
      icon: <WhatsAppIcon />,
      external: true,
    },
    {
      label: site.email,
      href: `mailto:${site.email}`,
      icon: <MailIcon />,
    },
    {
      label: "LinkedIn",
      href: site.linkedIn,
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
          <span className="contact-rail__icon" aria-hidden="true">
            {item.icon}
          </span>
        </a>
      ))}
    </aside>
  );
}
