"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Badge, LpSection, Reveal } from "@/components/landing/lp-ui";
import { lp } from "@/lib/landing-copy";

const TILE = ["#ece2fd", "#ffe89a", "#ffe0d7"] as const;

export function ResultsSection() {
  const r = lp.results;
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion() ?? false;
  const active = r.cards[index];

  const move = (dir: 1 | -1) =>
    setIndex((i) => (i + dir + r.cards.length) % r.cards.length);

  return (
    <LpSection id="casos">
      <div className="text-center">
        <Reveal>
          <Badge tone="coral">{r.badge}</Badge>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="lp-font mx-auto mt-4 max-w-2xl text-[clamp(1.75rem,4.2vw,2.75rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-[#131316]">
            {r.title} <span className="text-[#8b8b96]">{r.titleAccent}</span>
          </h2>
        </Reveal>
      </div>

      <div className="mt-10 grid gap-3 lg:grid-cols-[1.35fr_1fr]">
        {/* Tarjeta de patrón con navegación */}
        <Reveal>
          <div className="flex h-full flex-col justify-between rounded-[1.75rem] border border-[#f0edf6] bg-white p-[clamp(1.25rem,2.4vw,2rem)]">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.tag}
                initial={reduce ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -14 }}
                transition={{ duration: 0.32 }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="flex size-11 items-center justify-center rounded-2xl"
                    style={{ backgroundColor: TILE[index] }}
                  >
                    <Quote className="size-4 text-[#131316]" />
                  </span>
                  <Badge tone="light">{active.tag}</Badge>
                </div>

                <p className="lp-font mt-6 text-[clamp(1.0625rem,2.1vw,1.375rem)] font-medium leading-[1.45] tracking-[-0.01em] text-[#131316]">
                  “{active.quote}”
                </p>
                <p className="mt-4 text-[0.8125rem] font-medium text-[#8b8b96]">{active.source}</p>
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {r.cards.map((card, i) => (
                  <button
                    key={card.tag}
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-label={`Ver patrón: ${card.tag}`}
                    className="h-1.5 rounded-full transition-all duration-300"
                    style={{
                      width: i === index ? 26 : 10,
                      backgroundColor: i === index ? "#111111" : "#e3dfec",
                    }}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => move(-1)}
                  aria-label="Patrón anterior"
                  className="flex size-9 items-center justify-center rounded-full border border-[#eae6f2] text-[#5f5f6a] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#111111] hover:text-[#131316]"
                >
                  <ArrowLeft className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => move(1)}
                  aria-label="Patrón siguiente"
                  className="flex size-9 items-center justify-center rounded-full bg-[#111111] text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#2b2b2b]"
                >
                  <ArrowRight className="size-4" />
                </button>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Panel con las cifras que devuelve el reporte */}
        <Reveal delay={0.1}>
          <div className="h-full rounded-[1.75rem] bg-[#ece2fd] p-[clamp(1.25rem,2.4vw,2rem)]">
            <p className="lp-font text-[0.9375rem] font-semibold text-[#131316]">
              {r.panel.title}
            </p>
            <ul className="mt-5 space-y-2.5">
              {r.panel.rows.map((row) => (
                <li
                  key={row.label}
                  className="rounded-2xl bg-white/80 p-4 transition-transform duration-300 hover:translate-x-1"
                >
                  <p className="lp-font text-[1.5rem] font-semibold leading-none tracking-tight text-[#131316]">
                    {row.value}
                  </p>
                  <p className="mt-1.5 text-[0.75rem] text-[#6b6478]">{row.label}</p>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </LpSection>
  );
}
