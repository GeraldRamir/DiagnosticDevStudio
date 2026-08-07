"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Gauge } from "@/components/brand/gauge";
import { BlurFade } from "@/components/ui/blur-fade";
import { copy } from "@/lib/copy";

export function ReportHighlightSection() {
  const h = copy.landing.doodi.highlight;
  const m = copy.landing.report.mockup;

  return (
    <section id="reporte" className="doodi-section-alt">
      <BlurFade className="mx-auto w-full max-w-[100rem]">
        <div className="overflow-hidden rounded-[2rem] bg-[#f5f5f4] p-6 sm:rounded-[2.5rem] sm:p-10 lg:p-14">
          <div className="grid items-center gap-10 xl:grid-cols-2 xl:gap-20">
            <div className="max-w-lg">
              <div className="flex size-14 items-center justify-center rounded-full bg-[#fef08a] text-2xl font-bold text-[#0a0a0a]">
                $
              </div>
              <h2 className="doodi-heading mt-8">{h.title}</h2>
              <p className="doodi-body mt-5 text-base">{h.desc}</p>
              <Link
                href="/diagnostico"
                className="doodi-btn mt-8 inline-flex items-center gap-2 hover:bg-[#1a1a1a]"
              >
                {h.cta}
                <ArrowRight className="size-4" />
              </Link>
            </div>

            <div className="doodi-glass relative overflow-hidden p-6 sm:p-8">
              <div className="absolute inset-0 opacity-[0.035]" aria-hidden>
                <svg className="h-full w-full" viewBox="0 0 500 350">
                  <pattern id="hl-dots" width="24" height="24" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="1.2" fill="#0a0a0a" />
                  </pattern>
                  <rect width="500" height="350" fill="url(#hl-dots)" />
                </svg>
              </div>

              <div className="relative">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="doodi-label">Transferencia de datos</p>
                    <h3 className="doodi-subheading mt-1 text-lg">{m.business}</h3>
                    <p className="text-xs text-[#9ca3af]">{m.meta}</p>
                  </div>
                  <Gauge value={41} size={88} animate={false} />
                </div>

                <div className="mt-6 flex items-center gap-3 rounded-2xl bg-white/80 px-4 py-3">
                  <span className="text-sm font-semibold text-[#0a0a0a]">USD</span>
                  <span className="text-[#d1d5db]">→</span>
                  <span className="text-sm font-semibold text-[#0a0a0a]">Reporte</span>
                  <span className="ml-auto ds-mono-num font-mono text-xl font-bold text-[#0a0a0a]">
                    41<span className="text-sm text-[#9ca3af]">/100</span>
                  </span>
                </div>

                <p className="mt-5 text-sm font-semibold leading-snug text-[#0a0a0a]">
                  {m.headline}
                </p>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  {m.kpis.slice(0, 4).map((kpi) => (
                    <div
                      key={kpi.label}
                      className="rounded-2xl border border-black/[0.04] bg-white/75 px-3 py-2.5"
                    >
                      <p className="ds-mono-num font-mono text-lg font-bold text-[#0a0a0a]">
                        {kpi.value}
                        {kpi.suffix ? (
                          <span className="text-[10px] font-normal text-[#9ca3af]">
                            {kpi.suffix}
                          </span>
                        ) : null}
                      </p>
                      <p className="text-[10px] text-[#9ca3af]">{kpi.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </BlurFade>
    </section>
  );
}
