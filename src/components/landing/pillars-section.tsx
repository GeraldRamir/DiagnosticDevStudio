"use client";

import { Gauge } from "@/components/brand/gauge";
import { BlurFade } from "@/components/ui/blur-fade";
import { SectionHeader } from "@/components/landing/section-header";
import { copy } from "@/lib/copy";

const PILLAR_SCORES = [72, 45, 58, 38, 51] as const;

export function PillarsSection() {
  const pillars = copy.landing.headerDropdown.pillars;

  return (
    <section
      id="que-medimos"
      className="bg-[color:var(--landing-shell)] px-5 py-16 md:px-8 md:py-20 lg:px-10 lg:py-24"
    >
      <div className="mx-auto max-w-7xl">
        <BlurFade>
          <SectionHeader
            eyebrow={copy.landing.pillars.eyebrow}
            title={copy.landing.pillars.title}
            subtitle={copy.landing.pillars.subtitle}
          />
        </BlurFade>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {pillars.map((pillar, i) => (
            <BlurFade key={pillar.name} delay={i * 0.06}>
              <article className="flex h-full flex-col items-center rounded-2xl border border-black/[0.06] bg-white p-5 shadow-[0_8px_32px_rgba(15,23,42,0.06)] transition-transform hover:-translate-y-1">
                <Gauge
                  value={PILLAR_SCORES[i] ?? 50}
                  size={120}
                  animate={false}
                />
                <h3 className="mt-3 font-display text-base font-bold text-[color:var(--landing-text)]">
                  {pillar.name}
                </h3>
                <p className="mt-1 text-center text-xs leading-relaxed text-[color:var(--landing-muted)]">
                  {pillar.desc}
                </p>
              </article>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  );
}
