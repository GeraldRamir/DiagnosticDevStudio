"use client";

import { BlurFade } from "@/components/ui/blur-fade";
import { SectionHeader } from "@/components/landing/section-header";
import { copy } from "@/lib/copy";

export function HowItWorksSection() {
  return (
    <section
      id="como-funciona"
      className="bg-[color:var(--landing-shell)] px-5 py-16 md:px-8 md:py-20 lg:px-10 lg:py-24"
    >
      <div className="mx-auto max-w-7xl">
        <BlurFade>
          <SectionHeader
            eyebrow={copy.landing.howItWorks.eyebrow}
            title={copy.landing.howItWorks.title}
            subtitle={copy.landing.howItWorks.subtitle}
          />
        </BlurFade>

        <div className="relative mt-14 grid gap-8 md:grid-cols-3">
          <div
            className="absolute top-12 hidden h-px bg-gradient-to-r from-transparent via-[#a855f7]/30 to-transparent md:block md:w-full"
            aria-hidden
          />

          {copy.landing.howItWorks.steps.map((step, i) => (
            <BlurFade key={step.num} delay={i * 0.08}>
              <article className="relative text-center md:text-left">
                <span className="ds-mono-num inline-flex font-mono text-4xl font-medium text-[#a855f7]/40">
                  {step.num}
                </span>
                <h3 className="mt-3 font-display text-xl font-bold text-[color:var(--landing-text)]">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[color:var(--landing-muted)]">
                  {step.desc}
                </p>
              </article>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  );
}
