"use client";

import { BlurFade } from "@/components/ui/blur-fade";
import { copy } from "@/lib/copy";

export function ImpactStatsSection() {
  return (
    <section className="doodi-section">
      <div className="mx-auto grid w-full max-w-[100rem] gap-12 md:grid-cols-3 md:gap-8 lg:gap-16">
        {copy.landing.doodi.stats.map((stat, i) => (
          <BlurFade key={stat.title} delay={i * 0.06}>
            <p className="text-[clamp(3.5rem,8vw,5.5rem)] font-extrabold leading-none tracking-tighter text-[#0a0a0a]">
              {stat.value}
              {stat.unit ? (
                <span className="text-[clamp(1.5rem,3vw,2.5rem)] font-bold text-[#9ca3af]">
                  {stat.unit}
                </span>
              ) : null}
            </p>
            <h3 className="doodi-subheading mt-4 text-lg">{stat.title}</h3>
            <p className="doodi-body mt-2 max-w-xs">{stat.desc}</p>
          </BlurFade>
        ))}
      </div>
    </section>
  );
}
