"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { BlurFade } from "@/components/ui/blur-fade";
import { copy } from "@/lib/copy";
import { cn } from "@/lib/utils";

function GrowthChart() {
  const points = "0,75 45,65 90,70 135,50 180,55 225,35 270,40 315,22 360,28";
  const area = `${points} 360,110 0,110`;

  return (
    <svg viewBox="0 0 360 110" className="h-36 w-full sm:h-44" aria-hidden>
      <defs>
        <linearGradient id="faq-chart-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22c55e" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill="url(#faq-chart-grad)" />
      <polyline
        points={points}
        fill="none"
        stroke="#22c55e"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function FaqAnalyticsSection() {
  const [open, setOpen] = useState(0);
  const chart = copy.landing.doodi.faqChart;
  const faqHead = copy.landing.doodi.faqSection;

  return (
    <section id="faq" className="doodi-section pb-20 lg:pb-28">
      <div className="mx-auto w-full max-w-[100rem]">
        <BlurFade className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <h2 className="doodi-heading max-w-2xl">{faqHead.title}</h2>
          <Link href="#faq" className="doodi-btn-ghost shrink-0">
            {faqHead.cta}
            <ArrowUpRight className="size-4" />
          </Link>
        </BlurFade>

        <div className="mt-12 grid w-full items-start gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          <BlurFade delay={0.08}>
            <div className="doodi-glass p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="doodi-label">{chart.title}</p>
                  <p className="ds-mono-num mt-2 font-mono text-4xl font-bold tracking-tight text-[#0a0a0a]">
                    {chart.users}
                  </p>
                  <p className="doodi-body text-sm">{chart.usersLabel}</p>
                </div>
                <div className="flex rounded-full bg-white/80 p-1 text-xs shadow-sm">
                  <span className="rounded-full bg-[#0a0a0a] px-3 py-1.5 font-semibold text-white">
                    1S
                  </span>
                  <span className="px-3 py-1.5 font-medium text-[#9ca3af]">1M</span>
                  <span className="px-3 py-1.5 font-medium text-[#9ca3af]">1A</span>
                </div>
              </div>
              <div className="mt-6">
                <GrowthChart />
              </div>
              <div className="mt-5 flex flex-wrap gap-8">
                {copy.landing.headerDropdown.stats.map((s) => (
                  <div key={s.label}>
                    <p className="ds-mono-num font-mono text-xl font-bold text-[#0a0a0a]">
                      {s.value}
                    </p>
                    <p className="text-[11px] text-[#9ca3af]">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </BlurFade>

          <BlurFade delay={0.12}>
            <div id="industrias">
              {copy.landing.faq.items.map((item, i) => {
                const isOpen = open === i;
                const num = String(i + 1).padStart(2, "0");
                return (
                  <div key={item.q} className="border-b border-black/[0.08]">
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? -1 : i)}
                      className="flex w-full items-start gap-5 py-6 text-left"
                    >
                      <span className="mt-0.5 shrink-0 font-mono text-sm font-medium text-[#9ca3af]">
                        {num}.
                      </span>
                      <span className="flex-1 text-lg font-semibold tracking-tight text-[#0a0a0a]">
                        {item.q}
                      </span>
                      <ChevronDown
                        className={cn(
                          "size-5 shrink-0 text-[#9ca3af] transition-transform duration-200",
                          isOpen && "rotate-180",
                        )}
                      />
                    </button>
                    <div
                      className={cn(
                        "grid transition-all duration-300 ease-out",
                        isOpen ? "grid-rows-[1fr] pb-6 opacity-100" : "grid-rows-[0fr] opacity-0",
                      )}
                    >
                      <div className="overflow-hidden pl-10">
                        <p className="doodi-body">{item.a}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div id="casos" className="mt-10 grid gap-3 sm:grid-cols-3">
              {copy.landing.headerDropdown.cases.map((c) => (
                <div key={c.title} className="doodi-glass px-4 py-3.5">
                  <p className="text-sm font-semibold text-[#0a0a0a]">{c.title}</p>
                  <p className="mt-0.5 text-xs text-[#9ca3af]">{c.desc}</p>
                </div>
              ))}
            </div>
          </BlurFade>
        </div>
      </div>
    </section>
  );
}
