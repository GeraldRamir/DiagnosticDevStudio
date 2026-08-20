"use client";

import {
  AtSign,
  ExternalLink,
  Globe,
  Link2,
  MessageCircle,
  TrendingUp,
  Users,
} from "lucide-react";
import { Card, CardHead, Chip, Counter, StaticPill } from "@/components/report/report-ui";
import type { InstagramDashboardSummary } from "@/lib/analysis/instagram-bio";
import { cn } from "@/lib/utils";

const STATUS_STYLES = {
  ok: "border-[#d1fae5] bg-[#ecfdf5] text-[#166534]",
  warn: "border-[#fde68a] bg-[#fffbeb] text-[#92400e]",
  fail: "border-[#fecaca] bg-[#fef2f2] text-[#991b1b]",
} as const;

const LINK_LABELS = {
  website: "Sitio web",
  whatsapp: "WhatsApp",
  instagram: "Instagram",
  other: "Enlace",
  none: "Sin enlace",
} as const;

function Stat({
  label,
  value,
  suffix,
  delay,
}: {
  label: string;
  value: number | null;
  suffix?: string;
  delay?: number;
}) {
  return (
    <div className="rounded-[1rem] bg-[#f7f7f7] p-3">
      <p className="text-[0.6875rem] text-[#a3a3a3]">{label}</p>
      <p className="mt-1 text-lg font-bold leading-none text-[#131313]">
        {value != null ? (
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

export function InstagramProfileCard({
  summary,
  delay = 0.68,
}: {
  summary: InstagramDashboardSummary;
  delay?: number;
}) {
  const improvements = summary.bioImprovements.filter((i) => i.status !== "ok");
  const strengths = summary.bioImprovements.filter((i) => i.status === "ok");

  return (
    <Card className="md:col-span-2 xl:col-span-12" delay={delay}>
      <CardHead
        title="Perfil de Instagram"
        right={
          <div className="flex flex-wrap items-center gap-2">
            <StaticPill label={`@${summary.username}`} />
            {summary.oauthConnected ? (
              <Chip tone="accent">Insights reales</Chip>
            ) : (
              <Chip tone="neutral">Datos públicos</Chip>
            )}
          </div>
        }
      />

      {summary.dataUnavailable ? (
        <div className="mt-4 rounded-[1rem] border border-[#fde68a] bg-[#fffbeb] px-4 py-3 text-sm leading-relaxed text-[#92400e]">
          {summary.unavailableReason ??
            "No pudimos leer seguidores ni bio de forma pública. Conecta Instagram al hacer el diagnóstico para ver métricas reales."}
        </div>
      ) : null}

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
        <Stat label="Seguidores" value={summary.followers} delay={0.55} />
        <Stat label="Publicaciones" value={summary.posts} delay={0.58} />
        <Stat label="Siguiendo" value={summary.following} delay={0.61} />
        <div className="rounded-[1rem] bg-[#f7f7f7] p-3">
          <p className="text-[0.6875rem] text-[#a3a3a3]">Engagement</p>
          <p className="mt-1 text-lg font-bold leading-none text-[#131313]">
            {summary.engagementRate != null ? (
              <>{summary.engagementRate}%</>
            ) : (
              <span className="text-sm text-[#c9c9c9]">—</span>
            )}
          </p>
        </div>
        {summary.reach7d != null ? (
          <Stat label="Alcance reciente" value={summary.reach7d} delay={0.67} />
        ) : null}
        {summary.profileViews7d != null ? (
          <Stat label="Visitas al perfil" value={summary.profileViews7d} delay={0.7} />
        ) : null}
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <div className="rounded-[1.125rem] border border-[#ececec] bg-white p-4">
          <div className="flex items-start gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#fdeeeb] text-[#ee5b45]">
              <AtSign className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-[#131313]">Biografía</p>
              <p className="mt-2 text-sm leading-relaxed text-[#5c5c5c]">
                {summary.biography?.trim() || "Sin biografía detectada."}
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold",
                summary.hasWebsiteInBio
                  ? "border-[#bbf7d0] bg-[#ecfdf5] text-[#166534]"
                  : summary.bioLinkType === "whatsapp"
                    ? "border-[#fde68a] bg-[#fffbeb] text-[#92400e]"
                    : "border-[#fecaca] bg-[#fef2f2] text-[#991b1b]",
              )}
            >
              {summary.hasWebsiteInBio ? (
                <Globe className="size-3.5" />
              ) : summary.bioLinkType === "whatsapp" ? (
                <MessageCircle className="size-3.5" />
              ) : (
                <Link2 className="size-3.5" />
              )}
              {summary.hasWebsiteInBio
                ? "Sitio web en bio"
                : LINK_LABELS[summary.bioLinkType]}
            </span>
            {summary.isBusiness ? (
              <span className="inline-flex rounded-full border border-[#ececec] bg-[#f7f7f7] px-3 py-1 text-xs font-semibold text-[#5c5c5c]">
                Cuenta comercial
              </span>
            ) : null}
            {summary.isPrivate ? (
              <span className="inline-flex rounded-full border border-[#fde68a] bg-[#fffbeb] px-3 py-1 text-xs font-semibold text-[#92400e]">
                Privada
              </span>
            ) : null}
            {summary.daysSinceLastPost != null ? (
              <span className="inline-flex rounded-full border border-[#ececec] bg-[#f7f7f7] px-3 py-1 text-xs font-semibold text-[#5c5c5c]">
                Último post hace {summary.daysSinceLastPost} d
              </span>
            ) : null}
          </div>

          {summary.externalUrl ? (
            <a
              href={summary.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#ee5b45] hover:underline"
            >
              <ExternalLink className="size-3.5" />
              {summary.externalUrl}
            </a>
          ) : null}
        </div>

        <div className="rounded-[1.125rem] bg-[#f7f7f7] p-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="size-4 text-[#ee5b45]" />
            <p className="text-xs font-semibold text-[#131313]">Qué mejorar en tu bio y perfil</p>
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
              Tu bio y enlace están bien configurados según lo medido.
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
                    <Users className="mt-0.5 size-3.5 shrink-0 text-[#1f9d6b]" />
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
