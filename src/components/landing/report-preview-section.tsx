"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Gauge } from "@/components/brand/gauge";
import { BlurFade } from "@/components/ui/blur-fade";
import { SectionHeader } from "@/components/landing/section-header";
import { copy } from "@/lib/copy";
import { cn } from "@/lib/utils";

const SEVERITY_STYLES = {
  critical: "border-[#fecaca] bg-[#fef2f2] text-[#dc2626]",
  warn: "border-[#fde68a] bg-[#fffbeb] text-[#d97706]",
  good: "border-[#bbf7d0] bg-[#f0fdf4] text-[#059669]",
} as const;

function ReportMockup() {
  const m = copy.landing.report.mockup;

  return (
    <div className="overflow-hidden rounded-2xl border border-black/[0.08] bg-[#f5f7fa] shadow-[0_32px_80px_rgba(15,23,42,0.12)]">
      <div className="flex items-center gap-2 border-b border-black/[0.06] bg-white px-4 py-3">
        <span className="size-2.5 rounded-full bg-[#fb923c]" />
        <span className="size-2.5 rounded-full bg-[#fbbf24]" />
        <span className="size-2.5 rounded-full bg-[#34d399]" />
        <span className="ml-2 truncate text-xs text-[color:var(--landing-muted)]">
          devstudio.app/reporte/restaurante-la-esquina
        </span>
      </div>

      <div className="p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="font-display text-lg font-bold text-[color:var(--landing-text)]">
              {m.business}
            </h3>
            <p className="text-sm text-[color:var(--landing-muted)]">{m.meta}</p>
          </div>
          <div className="shrink-0">
            <Gauge value={41} size={100} animate={false} />
          </div>
        </div>

        <p className="mt-5 font-display text-xl font-bold leading-snug text-[color:var(--landing-text)] sm:text-2xl">
          &ldquo;{m.headline}&rdquo;
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {m.kpis.map((kpi) => (
            <div
              key={kpi.label}
              className="rounded-xl border border-black/[0.06] bg-white p-3"
            >
              <p className="ds-mono-num font-mono text-2xl font-medium text-[color:var(--landing-text)]">
                {kpi.value}
                {kpi.suffix ? (
                  <span className="text-sm text-[color:var(--landing-muted)]">
                    {kpi.suffix}
                  </span>
                ) : null}
              </p>
              <p className="mt-0.5 text-xs text-[color:var(--landing-muted)]">
                {kpi.label}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-[color:var(--landing-muted)]">
            Hallazgos clave
          </p>
          {m.findings.map((f) => (
            <div
              key={f.title}
              className={cn(
                "rounded-xl border px-4 py-3",
                SEVERITY_STYLES[f.severity as keyof typeof SEVERITY_STYLES],
              )}
            >
              <p className="text-sm font-semibold">{f.title}</p>
              <p className="mt-0.5 text-xs opacity-80">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ReportPreviewSection() {
  return (
    <section id="reporte" className="bg-white px-5 py-16 md:px-8 md:py-20 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <BlurFade>
          <SectionHeader
            eyebrow={copy.landing.report.eyebrow}
            title={copy.landing.report.title}
            subtitle={copy.landing.report.subtitle}
          />
        </BlurFade>

        <BlurFade delay={0.15} className="mt-14">
          <ReportMockup />
        </BlurFade>

        <BlurFade delay={0.25} className="mt-8 text-center">
          <Link
            href="/diagnostico"
            className="ds-glass-btn-outline inline-flex h-11 items-center gap-2 px-6 text-sm"
          >
            {copy.landing.report.cta}
            <ArrowRight className="size-4" />
          </Link>
        </BlurFade>
      </div>
    </section>
  );
}
