import type { ReactNode } from "react";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";

export function SiteShell({
  children,
  footer = true,
}: {
  children: ReactNode;
  footer?: boolean;
}) {
  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-primary focus:px-3 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-foreground"
      >
        Saltar al contenido
      </a>
      <Navbar />
      <main id="contenido" className="flex-1">
        {children}
      </main>
      {footer ? <Footer /> : null}
    </div>
  );
}
