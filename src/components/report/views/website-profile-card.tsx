"use client";

import {
  ExternalLink,
  Gauge,
  Globe,
  MessageCircle,
  Search,
  Shield,
  Zap,
} from "lucide-react";
import { Card, CardHead, Chip, Counter, StaticPill } from "@/components/report/report-ui";
import type { WebsiteDashboardSummary } from "@/lib/analysis/website-dashboard";
import { cn } from "@/lib/utils";

const STATUS_STYLES = {
  ok: "border-[#d1fae5] bg-[#ecfdf5] text-[#166534]",
  warn: "border-[#fde68a] bg-[#fffbeb] text-[#92400e]",
  fail: "border-[#fecaca] bg-[#fef2f2] text-[#991b1b]",
} as const;

function Stat({
  label,
  value,
  suffix,
  display,
  delay,
}: {
  label: string;
  value: number | null;
  suffix?: string;
  display?: string | null;
  delay?: number;
}) {
  return (
    <div className="rounded-[1rem] bg-[#f7f7f7] p-3">
      <p className="text-[0.6875rem] text-[#a3a3a3]">{label}</p>
      <p className="mt-1 text-lg font-bold leading-none text-[#131313]">
        {display ? (
          display
        ) : value != null ? (
          <>
            <Counter value={value} delay={delay ?? 0.5} />
            {suffix ? <span className="text-sm font-semibold text-[#c9c9c9]">{suffix}</span> : null}
          </>
        ) : (
          <span className="text-sm text-[#c9c9c9]">—</span>
        )}
      </p>
    </div>
  );
}

function displayUrl(url: string) {
  try {
    const parsed = new URL(url.startsWith("http") ? url : `https://${url}`);
    return parsed.hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function WebsiteProfileCard({
  summary,
  delay = 0.68,
}: {
  summary: WebsiteDashboardSummary;
  delay?: number;
}) {
  const improvements = summary.improvements;
  const strengths = summary.strengths;

  return (
    <Card className="md:col-span-2 xl:col-span-12" delay={delay}>
      <CardHead
        title="Sitio web"
        right={
          <div className="flex flex-wrap items-center gap-2">
            <StaticPill label={displayUrl(summary.url)} />
            {summary.reachable ? (
              <Chip tone="accent">Análisis PageSpeed</Chip>
            ) : (
              <Chip tone="neutral">No responde</Chip>
            )}
          </div>
        }
      />

      {!summary.reachable ? (
        <div className="mt-4 rounded-[1rem] border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm leading-relaxed text-[#991b1b]">
          No pudimos cargar la URL declarada. Revisa que el enlace sea correcto y esté publicado.
        </div>
      ) : summary.pagespeedFailed ? (
        <div className="mt-4 rounded-[1rem] border border-[#fde68a] bg-[#fffbeb] px-4 py-3 text-sm leading-relaxed text-[#92400e]">
          PageSpeed no respondió a tiempo; el resto del sitio sí se analizó.
        </div>
      ) : null}

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
        <Stat label="Velocidad móvil" value={summary.performanceScore} suffix="/100" delay={0.55} />
        <Stat label="SEO" value={summary.seoScore} suffix="/100" delay={0.58} />
        <Stat
          label="LCP"
          value={summary.lcpSeconds}
          display={summary.lcpSeconds != null ? `${summary.lcpSeconds}s` : null}
          delay={0.61}
        />
        <Stat label="Accesibilidad" value={summary.accessibilityScore} suffix="/100" delay={0.64} />
        <Stat label="Buenas prácticas" value={summary.bestPracticesScore} suffix="/100" delay={0.67} />
        {summary.cls != null ? (
          <Stat
            label="CLS"
            value={Math.round(summary.cls * 1000) / 1000}
            display={String(summary.cls)}
            delay={0.7}
          />
        ) : null}
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <div className="rounded-[1.125rem] border border-[#ececec] bg-white p-4">
          <div className="flex items-start gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#fdeeeb] text-[#ee5b45]">
              <Globe className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-[#131313]">URL analizada</p>
              <a
                href={summary.url.startsWith("http") ? summary.url : `https://${summary.url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1.5 break-all text-sm font-medium text-[#ee5b45] hover:underline"
              >
                {summary.url}
                <ExternalLink className="size-3.5 shrink-0" />
              </a>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold",
                summary.isHttps
                  ? "border-[#bbf7d0] bg-[#ecfdf5] text-[#166534]"
                  : "border-[#fecaca] bg-[#fef2f2] text-[#991b1b]",
              )}
            >
              <Shield className="size-3.5" />
              {summary.isHttps ? "HTTPS activo" : "Sin HTTPS"}
            </span>
            {summary.isOwnDomain ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#ececec] bg-[#f7f7f7] px-3 py-1 text-xs font-semibold text-[#5c5c5c]">
                <Globe className="size-3.5" />
                Dominio propio
              </span>
            ) : null}
            {summary.hasWhatsAppLink ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#bbf7d0] bg-[#ecfdf5] px-3 py-1 text-xs font-semibold text-[#166534]">
                <MessageCircle className="size-3.5" />
                WhatsApp en sitio
              </span>
            ) : null}
            {summary.hasContactForm ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#ececec] bg-[#f7f7f7] px-3 py-1 text-xs font-semibold text-[#5c5c5c]">
                Formulario de contacto
              </span>
            ) : null}
            {summary.hasTitle && summary.hasMetaDescription ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#bbf7d0] bg-[#ecfdf5] px-3 py-1 text-xs font-semibold text-[#166534]">
                <Search className="size-3.5" />
                Meta SEO básica
              </span>
            ) : null}
          </div>
        </div>

        <div className="rounded-[1.125rem] bg-[#f7f7f7] p-4">
          <div className="flex items-center gap-2">
            <Zap className="size-4 text-[#ee5b45]" />
            <p className="text-xs font-semibold text-[#131313]">Qué mejorar en tu sitio</p>
          </div>
          {improvements.length ? (
            <ul className="mt-3 space-y-2.5">
              {improvements.map((item) => (
                <li
                  key={item.id + item.label}
                  className={cn(
                    "rounded-xl border px-3 py-2.5 text-xs leading-relaxed",
                    STATUS_STYLES[item.status],
                  )}
                >
                  <p className="font-semibold">{item.label}</p>
                  <p className="mt-1 opacity-90">{item.detail}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-[#5c5c5c]">
              No detectamos problemas críticos en las métricas medidas.
            </p>
          )}
          {strengths.length ? (
            <div className="mt-4 border-t border-[#ececec] pt-3">
              <p className="text-[0.6875rem] font-semibold uppercase tracking-wide text-[#a3a3a3]">
                Lo que ya funciona
              </p>
              <ul className="mt-2 space-y-1.5">
                {strengths.map((item) => (
                  <li key={item.id} className="flex items-start gap-2 text-xs text-[#5c5c5c]">
                    <Gauge className="mt-0.5 size-3.5 shrink-0 text-[#1f9d6b]" />
                    <span>{item.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
