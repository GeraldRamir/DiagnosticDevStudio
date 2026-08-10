"use client";

import { Database, Layers, ShieldCheck, Target } from "lucide-react";
import { LpSection, Reveal, SectionTitle } from "@/components/landing/lp-ui";
import { lp } from "@/lib/landing-copy";

const ICONS = [Target, Layers, Database, ShieldCheck] as const;
const TINTS = [
  { bg: "#ffe7e1", fg: "#ee5b45" },
  { bg: "#fff3cc", fg: "#a8741a" },
  { bg: "#ede4ff", fg: "#5b3fa8" },
  { bg: "#e9f6f0", fg: "#1f9d6b" },
] as const;

export function BenchmarksSection() {
  const b = lp.benchmarks;

  return (
    <LpSection className="bg-[#faf8fd]">
      <SectionTitle
        badge={b.badge}
        title={b.title}
        accent={b.titleAccent}
        subtitle={b.subtitle}
      />

      <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {b.stats.map((stat, i) => {
          const Icon = ICONS[i];
          const tint = TINTS[i];
          return (
            <Reveal key={stat.label} delay={i * 0.08}>
              <div className="lp-card-hover h-full rounded-[1.375rem] border border-[#f0edf6] bg-white p-5">
                <span
                  className="flex size-9 items-center justify-center rounded-full"
                  style={{ backgroundColor: tint.bg, color: tint.fg }}
                >
                  <Icon className="size-4" />
                </span>
                <p className="lp-font mt-5 text-[2rem] font-semibold leading-none tracking-tight text-[#131316]">
                  {stat.value}
                </p>
                <p className="mt-2 text-[0.8125rem] leading-relaxed text-[#7b7b87]">{stat.label}</p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </LpSection>
  );
}
