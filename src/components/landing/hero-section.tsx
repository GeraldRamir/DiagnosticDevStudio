"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HeroVisual } from "@/components/landing/hero-visual";
import { copy } from "@/lib/copy";

export function HeroSection() {
  return (
    <section className="mx-auto grid w-full max-w-7xl items-start gap-6 px-5 pb-2 pt-3 md:grid-cols-2 md:gap-8 md:px-8 md:pb-4 md:pt-4 lg:gap-10 lg:px-10 lg:pt-5">
      {/* Copy — alineado arriba con el visual */}
      <div className="max-w-xl md:pt-1 lg:pt-2">
        <h1 className="font-display text-balance text-[2rem] font-extrabold leading-[1.08] tracking-tight text-[color:var(--landing-text)] sm:text-[2.75rem] lg:text-[3.25rem]">
          <span className="ds-gradient-text">{copy.landing.heroGradient}</span>
          <br />
          {copy.landing.heroTitle}
        </h1>
        <p className="mt-4 max-w-md text-base leading-relaxed text-[color:var(--landing-muted)] sm:text-[0.95rem]">
          {copy.landing.heroDescription}
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href="/diagnostico"
            className="ds-glass-btn inline-flex h-12 items-center justify-center gap-3 px-6 text-sm hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="flex size-7 items-center justify-center rounded-full bg-white/25">
              <ArrowRight className="size-3.5" />
            </span>
            {copy.landing.ctaPrimary}
          </Link>
          <Link
            href="#reporte"
            className="ds-glass-btn-outline inline-flex h-12 items-center justify-center px-6 text-sm hover:scale-[1.02] active:scale-[0.98]"
          >
            {copy.landing.ctaSecondary}
          </Link>
        </div>

        <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-[color:var(--landing-muted)]">
          {copy.landing.bullets.map((item) => (
            <li key={item} className="flex items-center gap-2">
              <span className="size-1 rounded-full bg-[color:var(--landing-muted)]" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <HeroVisual />
    </section>
  );
}
