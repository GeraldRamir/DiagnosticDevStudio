"use client";

import {
  Building2,
  Dumbbell,
  Package,
  Scissors,
  ShoppingBag,
  Stethoscope,
} from "lucide-react";
import { BlurFade } from "@/components/ui/blur-fade";
import { SectionHeader } from "@/components/landing/section-header";
import { copy } from "@/lib/copy";

const INDUSTRY_ICONS = [
  Building2,
  Dumbbell,
  Stethoscope,
  Package,
  ShoppingBag,
  Scissors,
] as const;

export function IndustriesSection() {
  const industries = copy.landing.headerDropdown.industries;

  return (
    <section id="industrias" className="bg-white px-5 py-16 md:px-8 md:py-20 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <BlurFade>
          <SectionHeader
            eyebrow={copy.landing.industries.eyebrow}
            title={copy.landing.industries.title}
            subtitle={copy.landing.industries.subtitle}
          />
        </BlurFade>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((name, i) => {
            const Icon = INDUSTRY_ICONS[i] ?? Building2;
            return (
              <BlurFade key={name} delay={i * 0.05}>
                <article className="group flex items-center gap-4 rounded-2xl border border-black/[0.06] bg-[color:var(--landing-shell)] p-5 transition-colors hover:border-[#a855f7]/20 hover:bg-white">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-white text-[#a855f7] shadow-sm transition-transform group-hover:scale-105">
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-[color:var(--landing-text)]">
                      {name}
                    </h3>
                    <p className="text-xs text-[color:var(--landing-muted)]">
                      Diagnóstico adaptado a tu vertical
                    </p>
                  </div>
                </article>
              </BlurFade>
            );
          })}
        </div>
      </div>
    </section>
  );
}
