"use client";

import { BRAND_LINKS } from "@/lib/brand";
import { trackEvent } from "@/lib/tracking";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ToolFooter({
  title = "¿Necesitas una solución más personalizada?",
  description = "Dev Studio desarrolla páginas web, aplicaciones, sistemas y automatizaciones para negocios.",
  ctaLabel = "Conocer Dev Studio",
  href = BRAND_LINKS.website,
  toolId,
}: {
  title?: string;
  description?: string;
  ctaLabel?: string;
  href?: string;
  toolId?: string;
}) {
  return (
    <section className="mt-12 rounded-2xl border border-border bg-white p-6 sm:p-8">
      <h2 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
        {title}
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackEvent("CTA_clicked", { toolId, cta: ctaLabel })}
        className={cn(
          buttonVariants(),
          "mt-5 h-11 cursor-pointer rounded-full px-5 text-sm font-semibold",
        )}
      >
        {ctaLabel}
      </a>
    </section>
  );
}
