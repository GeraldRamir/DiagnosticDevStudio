import Link from "next/link";
import { SiteShell } from "@/components/layout/site-shell";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <SiteShell>
      <section className="dst-section">
        <div className="dst-container max-w-xl text-center">
          <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
            404
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">No encontramos esa página</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Revisa el enlace o vuelve al catálogo de herramientas.
          </p>
          <Link
            href="/tools"
            className={cn(buttonVariants(), "mt-6 h-11 inline-flex rounded-full px-5 font-semibold")}
          >
            Ver herramientas
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
