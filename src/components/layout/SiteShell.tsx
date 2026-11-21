import type { ReactNode } from "react";
import { SiteHeader } from "./SiteHeader";
import { ContactRail } from "./ContactRail";
import { Footer } from "./Footer";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      <div id="main" tabIndex={-1}>
        {children}
      </div>
      <ContactRail />
      <Footer />
    </>
  );
}
