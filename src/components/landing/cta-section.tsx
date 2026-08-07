"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Gauge } from "@/components/brand/gauge";
import { BlurFade } from "@/components/ui/blur-fade";
import { copy } from "@/lib/copy";

export function CtaSection() {
  return (
    <section className="relative overflow-hidden bg-[color:var(--landing-shell)] px-5 py-20 md:px-8 md:py-24 lg:px-10 lg:py-28">
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.07]"
        aria-hidden
      >
        <Gauge value={72} size={420} animate={false} />
      </div>

      <div className="relative mx-auto max-w-2xl text-center">
        <BlurFade>
          <h2 className="font-display text-balance text-3xl font-extrabold tracking-tight text-[color:var(--landing-text)] sm:text-4xl">
            {copy.landing.cta.title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[color:var(--landing-muted)] sm:text-lg">
            {copy.landing.cta.subtitle}
          </p>
          <Link
            href="/diagnostico"
            className="ds-glass-btn mt-8 inline-flex h-12 items-center gap-3 px-8 text-sm hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="flex size-7 items-center justify-center rounded-full bg-white/25">
              <ArrowRight className="size-3.5" />
            </span>
            {copy.landing.cta.button}
          </Link>
        </BlurFade>
      </div>
    </section>
  );
}
