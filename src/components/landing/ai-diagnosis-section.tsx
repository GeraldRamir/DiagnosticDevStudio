"use client";

import { useEffect, useState } from "react";
import { BrainCircuit, Shield, Zap } from "lucide-react";
import { BlurFade } from "@/components/ui/blur-fade";
import { SectionHeader } from "@/components/landing/section-header";
import { copy } from "@/lib/copy";
import { cn } from "@/lib/utils";

const FEATURE_ICONS = [Zap, BrainCircuit, Shield] as const;

function AnalysisFeed() {
  const messages = copy.landing.ai.feed;
  const [idx, setIdx] = useState(0);
  const [dots, setDots] = useState("");

  useEffect(() => {
    const dotId = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "" : `${d}.`));
    }, 400);
    return () => clearInterval(dotId);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setIdx((i) => (i + 1) % messages.length);
    }, 2800);
    return () => clearInterval(id);
  }, [messages.length]);

  return (
    <div className="overflow-hidden rounded-2xl border border-black/[0.08] bg-[#0f172a] shadow-[0_24px_64px_rgba(15,23,42,0.18)]">
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
        <span className="size-2.5 rounded-full bg-[#fb923c]" />
        <span className="size-2.5 rounded-full bg-[#fbbf24]" />
        <span className="size-2.5 rounded-full bg-[#34d399]" />
        <span className="ml-2 text-xs font-medium text-white/50">
          devstudio-diagnostico — análisis en vivo
        </span>
      </div>
      <div className="space-y-3 p-5 font-mono text-sm leading-relaxed">
        {messages.slice(0, idx + 1).map((msg, i) => (
          <p
            key={`${msg}-${i}`}
            className={cn(
              "transition-opacity duration-500",
              i === idx ? "text-emerald-400" : "text-white/45",
            )}
          >
            <span className="text-white/30">{">"}</span> {msg}
            {i === idx ? (
              <span className="inline-block w-4 text-emerald-400">{dots}</span>
            ) : null}
          </p>
        ))}
      </div>
      <div className="border-t border-white/10 px-5 py-3">
        <div className="flex items-center justify-between text-xs text-white/40">
          <span>Motor: análisis determinístico + Gemini</span>
          <span className="ds-mono-num font-mono text-emerald-400/80">
            {Math.min(Math.round(((idx + 1) / messages.length) * 100), 100)}%
          </span>
        </div>
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#a855f7] to-[#fb923c] transition-all duration-700"
            style={{
              width: `${Math.min(((idx + 1) / messages.length) * 100, 100)}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export function AiDiagnosisSection() {
  return (
    <section className="bg-white px-5 py-16 md:px-8 md:py-20 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <BlurFade>
          <SectionHeader
            eyebrow={copy.landing.ai.badge}
            title={copy.landing.ai.title}
            subtitle={copy.landing.ai.subtitle}
          />
        </BlurFade>

        <div className="mt-14 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <BlurFade delay={0.1}>
            <ul className="space-y-6">
              {copy.landing.ai.features.map((feature, i) => {
                const Icon = FEATURE_ICONS[i] ?? Zap;
                return (
                  <li
                    key={feature.title}
                    className="flex gap-4 rounded-2xl border border-black/[0.06] bg-[color:var(--landing-shell)] p-5"
                  >
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#a855f7]/15 to-[#fb923c]/15 text-[#a855f7]">
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-bold text-[color:var(--landing-text)]">
                        {feature.title}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-[color:var(--landing-muted)]">
                        {feature.desc}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </BlurFade>

          <BlurFade delay={0.2}>
            <AnalysisFeed />
          </BlurFade>
        </div>
      </div>
    </section>
  );
}
