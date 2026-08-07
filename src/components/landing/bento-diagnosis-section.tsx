"use client";

import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import {
  ArrowRight,
  ClipboardList,
  FileText,
  Grid3x3,
  PenLine,
  Shield,
} from "lucide-react";
import { BlurFade } from "@/components/ui/blur-fade";
import { copy } from "@/lib/copy";

type ProCardProps = {
  index: string;
  label: string;
  icon: LucideIcon;
  title: string;
  desc: string;
  detail: string;
  link?: { href: string; label: string };
  steps?: readonly string[];
  includes?: readonly string[];
  tags?: readonly string[];
};

function ProCard({
  index,
  label,
  icon: Icon,
  title,
  desc,
  detail,
  link,
  steps,
  includes,
  tags,
}: ProCardProps) {
  return (
    <article className="ds-glass-card ds-glass-card-hover group relative flex h-full flex-col overflow-hidden p-4 sm:p-5">
      {/* Shimmer al hover — mismo lenguaje visual que el header */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        aria-hidden
      >
        <div
          className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/25 to-transparent"
          style={{ animation: "ds-shimmer-slide 1.8s ease-in-out infinite" }}
        />
      </div>

      <div className="relative flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="ds-mono-num font-mono text-[0.6875rem] font-medium text-[color:var(--landing-muted)]">
            {index}
          </span>
          <span className="text-[0.625rem] font-semibold uppercase tracking-[0.12em] text-[color:var(--landing-muted)]">
            {label}
          </span>
        </div>
        <div className="ds-glass flex size-8 items-center justify-center rounded-lg">
          <Icon className="size-3.5 text-[color:var(--landing-text)]" strokeWidth={1.75} />
        </div>
      </div>

      <h3 className="relative mt-3 text-[0.9375rem] font-semibold leading-snug text-[color:var(--landing-text)]">
        {title}
      </h3>
      <p className="relative mt-1.5 text-[0.8125rem] leading-relaxed text-[color:var(--landing-muted)]">
        {desc}
      </p>

      {steps ? (
        <p className="relative mt-2 truncate text-[0.625rem] font-medium text-[color:var(--landing-muted)]">
          {steps.join(" → ")}
        </p>
      ) : null}

      {includes ? (
        <ul className="relative mt-2 flex flex-wrap gap-x-2 gap-y-0.5">
          {includes.map((item) => (
            <li
              key={item}
              className="text-[0.625rem] text-[color:var(--landing-muted)] before:mr-1 before:text-[#a855f7] before:content-['·'] first:before:content-none"
            >
              {item}
            </li>
          ))}
        </ul>
      ) : null}

      {tags ? (
        <p className="relative mt-2 line-clamp-1 text-[0.625rem] leading-relaxed text-[color:var(--landing-muted)]">
          {tags.join(" · ")}
        </p>
      ) : null}

      {link ? (
        <Link
          href={link.href}
          className="relative mt-2.5 inline-flex items-center gap-1 text-[0.75rem] font-medium text-[color:var(--landing-text)] transition-colors hover:text-[#9333ea]"
        >
          {link.label}
          <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
        </Link>
      ) : null}

      <p className="relative mt-auto border-t border-white/40 pt-2.5 text-[0.6875rem] leading-snug text-[color:var(--landing-muted)]">
        {detail}
      </p>
    </article>
  );
}

function GlassOrbs() {
  return (
    <>
      <div
        className="ds-orb-float pointer-events-none absolute left-[8%] top-[28%] size-64 rounded-full opacity-70 blur-3xl sm:size-80"
        style={{
          background:
            "radial-gradient(circle, rgba(168,85,247,0.35) 0%, rgba(168,85,247,0) 70%)",
        }}
        aria-hidden
      />
      <div
        className="ds-orb-float-slow pointer-events-none absolute right-[6%] top-[42%] size-56 rounded-full opacity-60 blur-3xl sm:size-72"
        style={{
          background:
            "radial-gradient(circle, rgba(251,146,60,0.3) 0%, rgba(251,146,60,0) 70%)",
        }}
        aria-hidden
      />
      <div
        className="ds-orb-float pointer-events-none absolute bottom-[8%] left-[38%] size-48 rounded-full opacity-50 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(192,132,252,0.28) 0%, rgba(192,132,252,0) 70%)",
          animationDelay: "-11s",
        }}
        aria-hidden
      />
    </>
  );
}

export function BentoDiagnosisSection() {
  const b = copy.landing.doodi.bento;

  return (
    <section
      id="que-medimos"
      className="relative w-full overflow-hidden px-[clamp(1.25rem,4vw,4rem)] py-12 md:py-16"
      style={{ background: "var(--landing-shell)" }}
    >
      <GlassOrbs />

      <div className="relative mx-auto w-full max-w-[100rem]">
        <BlurFade className="grid gap-4 lg:grid-cols-2 lg:gap-10">
          <div>
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--landing-muted)]">
              Qué medimos
            </p>
            <h2 className="mt-1.5 max-w-lg text-[clamp(1.5rem,3vw,2.125rem)] font-bold leading-tight tracking-[-0.02em] text-[color:var(--landing-text)]">
              {b.title}
            </h2>
          </div>
          <div className="lg:self-end">
            <p className="text-[0.9375rem] leading-relaxed text-[color:var(--landing-muted)]">
              {b.subtitle}
            </p>
            <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
              {b.meta.map((item, i) => (
                <li key={item}>
                  <BlurFade delay={0.04 + i * 0.03}>
                    <span className="flex items-center gap-1.5 text-[0.6875rem] font-medium text-[color:var(--landing-muted)]">
                      <span className="size-1 rounded-full bg-gradient-to-r from-[#a855f7] to-[#fb923c]" />
                      {item}
                    </span>
                  </BlurFade>
                </li>
              ))}
            </ul>
          </div>
        </BlurFade>

        <div className="relative mt-7 grid items-stretch gap-3 sm:grid-cols-2 lg:mt-8 lg:grid-cols-4">
          <BlurFade delay={0.06}>
            <ProCard
              index="01"
              label={b.card1.label}
              icon={ClipboardList}
              title={b.card1.title}
              desc={b.card1.desc}
              detail={b.card1.detail}
              steps={b.card1.steps}
            />
          </BlurFade>
          <BlurFade delay={0.09}>
            <ProCard
              index="02"
              label={b.card2.label}
              icon={FileText}
              title={b.card2.title}
              desc={b.card2.desc}
              detail={b.card2.detail}
              includes={b.card2.includes}
              link={{ href: "#reporte", label: b.card2.link }}
            />
          </BlurFade>
          <BlurFade delay={0.12}>
            <ProCard
              index="03"
              label={b.card3.label}
              icon={Grid3x3}
              title={b.card3.title}
              desc={b.card3.desc}
              detail={b.card3.detail}
              tags={b.card3.tags}
            />
          </BlurFade>
          <BlurFade delay={0.15}>
            <ProCard
              index="04"
              label={b.card4.label}
              icon={PenLine}
              title={b.card4.title}
              desc={b.card4.desc}
              detail={b.card4.detail}
            />
          </BlurFade>
        </div>

        <BlurFade delay={0.18} className="mt-3">
          <div className="ds-glass-card ds-glass-card-hover flex flex-col items-start justify-between gap-3 px-4 py-3.5 sm:flex-row sm:items-center sm:px-5">
            <div className="flex min-w-0 items-start gap-3">
              <div className="ds-glass mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg">
                <Shield className="size-3.5 text-[color:var(--landing-text)]" strokeWidth={1.75} />
              </div>
              <div>
                <p className="text-[0.875rem] font-semibold text-[color:var(--landing-text)]">
                  {b.card5.title}
                </p>
                <p className="mt-0.5 text-[0.75rem] leading-snug text-[color:var(--landing-muted)]">
                  {b.card5.desc}
                </p>
              </div>
            </div>
            <Link
              href="/diagnostico"
              className="ds-glass-btn inline-flex h-9 shrink-0 items-center justify-center gap-1.5 px-5 text-[0.8125rem] hover:scale-[1.02] active:scale-[0.98]"
            >
              {b.card5.cta}
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </BlurFade>
      </div>
    </section>
  );
}
