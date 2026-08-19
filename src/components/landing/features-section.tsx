"use client";

import type { ReactNode } from "react";
import { ArrowRight, Check, FileText, Gauge, ListChecks, Share2 } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Badge, LpButton, LpSection, Reveal, SectionTitle } from "@/components/landing/lp-ui";
import { lp } from "@/lib/landing-copy";
import { cn } from "@/lib/utils";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

function FeatureBlock({
  tone,
  badge,
  badgeTone,
  title,
  desc,
  cta,
  ctaHref,
  visual,
  reversed,
}: {
  tone: "lilac" | "yellow";
  badge: string;
  badgeTone: "lilac" | "coral" | "dark";
  title: string;
  desc: string;
  cta: string;
  ctaHref: string;
  visual: ReactNode;
  reversed?: boolean;
}) {
  return (
    <Reveal>
      <div
        className={cn(
          "grid items-center gap-8 overflow-x-clip rounded-[clamp(1.5rem,2.6vw,2.25rem)] p-[clamp(1.25rem,3vw,3rem)] lg:grid-cols-2",
          tone === "lilac" ? "bg-[#ece2fd]" : "bg-[#ffe89a]",
        )}
      >
        <div className={cn("min-w-0", reversed && "lg:order-2")}>
          <Badge tone={badgeTone}>{badge}</Badge>
          <h3 className="lp-font mt-4 text-[clamp(1.5rem,3.2vw,2.25rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-[#131316]">
            {title}
          </h3>
          <p className="mt-4 max-w-md text-[0.9375rem] leading-relaxed text-[#5b5b66]">{desc}</p>
          <LpButton
            href={ctaHref}
            variant="dark"
            className="mt-6"
            icon={<ArrowRight className="size-4" />}
          >
            {cta}
          </LpButton>
        </div>

        <div className={cn("min-w-0", reversed && "lg:order-1")}>{visual}</div>
      </div>
    </Reveal>
  );
}

function StepperVisual() {
  const reduce = useReducedMotion() ?? false;
  const steps = lp.features.big.steps;

  return (
    <div className="relative">
      <div className="rounded-[1.5rem] bg-white p-5 shadow-[0_18px_44px_rgba(60,30,90,0.10)]">
        <div className="flex items-center justify-between">
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-[#b6b6c0]">
            Diagnóstico
          </p>
          <span className="rounded-full bg-[#f3ecff] px-2.5 py-1 text-[0.625rem] font-semibold text-[#5b3fa8]">
            Paso 2 de 4
          </span>
        </div>

        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#f1eef7]">
          <motion.div
            initial={reduce ? false : { width: 0 }}
            whileInView={{ width: "50%" }}
            viewport={{ once: true }}
            transition={reduce ? { duration: 0 } : { duration: 1.1, ease: EASE }}
            className="h-full rounded-full bg-[#111111]"
          />
        </div>

        <ul className="mt-5 space-y-2.5">
          {steps.map((step, i) => {
            const done = i < 2;
            return (
              <motion.li
                key={step}
                initial={reduce ? false : { opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={reduce ? { duration: 0 } : { duration: 0.45, delay: i * 0.1 }}
                className="flex items-center gap-3 rounded-2xl border border-[#f1eef7] px-3.5 py-3 transition-colors hover:border-[#d9c9fa]"
              >
                <span
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-full text-[0.625rem] font-bold",
                    done ? "bg-[#111111] text-white" : "bg-[#f4f2f9] text-[#b6b6c0]",
                  )}
                >
                  {done ? <Check className="size-3.5" /> : i + 1}
                </span>
                <span className="text-[0.8125rem] font-medium text-[#4d4d55]">{step}</span>
              </motion.li>
            );
          })}
        </ul>
      </div>

      <div className="lp-float absolute -left-3 -top-4 rounded-2xl bg-[#ffd95e] px-3.5 py-2.5 shadow-[0_12px_28px_rgba(60,30,90,0.14)]">
        <p className="lp-font text-lg font-semibold leading-none text-[#2e2400]">
          {lp.features.big.tag.value}
        </p>
        <p className="text-[0.625rem] font-medium text-[#6b5500]">{lp.features.big.tag.label}</p>
      </div>
    </div>
  );
}

function MetricsVisual() {
  const reduce = useReducedMotion() ?? false;
  const metrics = lp.features.yellow.metrics;

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="rounded-[1.5rem] bg-white p-5 shadow-[0_18px_44px_rgba(60,30,90,0.10)] sm:col-span-2">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-full bg-[#ffe7e1] text-[#ee5b45]">
            <Gauge className="size-4" />
          </span>
          <p className="text-[0.8125rem] font-semibold text-[#131316]">Google PageSpeed</p>
        </div>
        <ul className="mt-4 space-y-3">
          {metrics.map((m, i) => (
            <li key={m.label}>
              <div className="flex items-center justify-between">
                <span className="text-[0.75rem] text-[#7b7b87]">{m.label}</span>
                <span className="text-[0.8125rem] font-bold tabular-nums text-[#131316]">
                  {m.value}
                </span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#f4f2f9]">
                <motion.div
                  initial={reduce ? false : { width: 0 }}
                  whileInView={{ width: `${[42, 78, 91][i]}%` }}
                  viewport={{ once: true }}
                  transition={
                    reduce ? { duration: 0 } : { duration: 1, delay: i * 0.12, ease: EASE }
                  }
                  className="h-full rounded-full"
                  style={{ backgroundColor: ["#ee5b45", "#dd9a2b", "#1f9d6b"][i] }}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-[1.5rem] bg-[#111111] p-5 text-white">
        <ListChecks className="size-4 text-[#ffd95e]" />
        <p className="lp-font mt-3 text-[1.5rem] font-semibold leading-none">13+</p>
        <p className="mt-1.5 text-[0.6875rem] text-white/60">señales verificables por informe</p>
      </div>

      <div className="rounded-[1.5rem] bg-white p-5 shadow-[0_18px_44px_rgba(60,30,90,0.10)]">
        <Share2 className="size-4 text-[#5b3fa8]" />
        <p className="lp-font mt-3 text-[1.5rem] font-semibold leading-none text-[#131316]">0</p>
        <p className="mt-1.5 text-[0.6875rem] text-[#8b8b96]">datos personales enviados a la IA</p>
      </div>
    </div>
  );
}

function ReportVisual() {
  const reduce = useReducedMotion() ?? false;

  return (
    <div className="rounded-[1.5rem] bg-white p-5 shadow-[0_18px_44px_rgba(60,30,90,0.10)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-[#b6b6c0]">
            Puntaje global
          </p>
          <p className="lp-font mt-1 text-[2.25rem] font-semibold leading-none tracking-tight text-[#131316]">
            41
            <span className="text-lg text-[#c2c2cc]">/100</span>
          </p>
        </div>
        <span className="flex size-9 items-center justify-center rounded-full bg-[#111111] text-white">
          <FileText className="size-4" />
        </span>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {lp.features.lilac.chips.map((chip, i) => (
          <motion.span
            key={chip}
            initial={reduce ? false : { opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={reduce ? { duration: 0 } : { duration: 0.4, delay: i * 0.08 }}
            className="rounded-full border border-[#f1eef7] px-3 py-1.5 text-[0.6875rem] font-semibold text-[#5b5b66] transition-colors hover:border-[#d9c9fa] hover:text-[#5b3fa8]"
          >
            {chip}
          </motion.span>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2">
        {[
          { v: "47 h", l: "carga admin" },
          { v: "3", l: "críticos" },
          { v: "5", l: "sistemas" },
        ].map((item) => (
          <div key={item.l} className="rounded-2xl bg-[#f8f6fc] p-3 text-center">
            <p className="lp-font text-base font-semibold leading-none text-[#131316]">{item.v}</p>
            <p className="mt-1 text-[0.5625rem] text-[#8b8b96]">{item.l}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function FeaturesSection() {
  const f = lp.features;

  return (
    <LpSection id="que-medimos">
      <SectionTitle title={f.title} accent={f.titleAccent} subtitle={f.subtitle} />

      <div className="mt-10 space-y-4" id="como-funciona">
        <FeatureBlock
          tone="lilac"
          badge={f.big.badge}
          badgeTone="lilac"
          title={f.big.title}
          desc={f.big.desc}
          cta={f.big.cta}
          ctaHref="/diagnostico"
          visual={<StepperVisual />}
          reversed
        />
        <FeatureBlock
          tone="yellow"
          badge={f.yellow.badge}
          badgeTone="dark"
          title={f.yellow.title}
          desc={f.yellow.desc}
          cta={f.yellow.cta}
          ctaHref="#reporte"
          visual={<MetricsVisual />}
        />
        <FeatureBlock
          tone="lilac"
          badge={f.lilac.badge}
          badgeTone="coral"
          title={f.lilac.title}
          desc={f.lilac.desc}
          cta={f.lilac.cta}
          ctaHref="/diagnostico"
          visual={<ReportVisual />}
          reversed
        />
      </div>
    </LpSection>
  );
}
