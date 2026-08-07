"use client";

import { AlertTriangle, Clock, MessageCircle } from "lucide-react";
import { BlurFade } from "@/components/ui/blur-fade";
import { SectionHeader } from "@/components/landing/section-header";
import { copy } from "@/lib/copy";

const CASE_ICONS = [MessageCircle, Clock, AlertTriangle] as const;

export function CasesSection() {
  const cases = copy.landing.headerDropdown.cases;

  return (
    <section id="casos" className="bg-[color:var(--landing-shell)] px-5 py-16 md:px-8 md:py-20 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <BlurFade>
          <SectionHeader
            eyebrow={copy.landing.cases.eyebrow}
            title={copy.landing.cases.title}
            subtitle={copy.landing.cases.subtitle}
          />
        </BlurFade>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {cases.map((item, i) => {
            const Icon = CASE_ICONS[i] ?? MessageCircle;
            return (
              <BlurFade key={item.title} delay={i * 0.08}>
                <article className="h-full rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_8px_32px_rgba(15,23,42,0.06)]">
                  <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#a855f7]/10 to-[#fb923c]/10 text-[#a855f7]">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-bold text-[color:var(--landing-text)]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[color:var(--landing-muted)]">
                    {item.desc}
                  </p>
                </article>
              </BlurFade>
            );
          })}
        </div>
      </div>
    </section>
  );
}
