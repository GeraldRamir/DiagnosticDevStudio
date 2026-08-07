"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { Gauge } from "@/components/brand/gauge";
import { copy } from "@/lib/copy";

/** Posiciones 2×2 flanqueando el mockup central */
const FLOATING_CARDS = [
  {
    id: "restaurante",
    industry: "Restaurante",
    score: 33,
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=480&h=360&fit=crop&q=80",
    style: { left: "0%", top: "12%" },
    zIndex: 2,
  },
  {
    id: "gimnasio",
    industry: "Gimnasio",
    score: 58,
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=480&h=360&fit=crop&q=80",
    style: { right: "0%", top: "12%" },
    zIndex: 2,
  },
  {
    id: "clinica",
    industry: "Clínica",
    score: 67,
    image:
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=480&h=360&fit=crop&q=80",
    style: { left: "-2%", top: "56%" },
    zIndex: 3,
  },
  {
    id: "retail",
    industry: "Retail",
    score: 45,
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=480&h=360&fit=crop&q=80",
    style: { right: "-2%", top: "56%" },
    zIndex: 2,
  },
] as const;

export function HeroVisual() {
  const [sampleIdx, setSampleIdx] = useState(0);
  const sample = copy.liveSamples[sampleIdx]!;

  useEffect(() => {
    const id = setInterval(() => {
      setSampleIdx((i) => (i + 1) % copy.liveSamples.length);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative mx-auto h-[26rem] w-full max-w-[36rem] sm:h-[28rem] md:max-w-[38rem] lg:h-[30rem] lg:max-w-[40rem]">
      <svg
        className="pointer-events-none absolute inset-0 z-[1] hidden h-full w-full sm:block"
        viewBox="0 0 560 640"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden
      >
        <path
          d="M 72 110 Q 180 190 280 260"
          fill="none"
          stroke="url(#hero-conn-grad)"
          strokeWidth="1.5"
          opacity="0.5"
        />
        <path
          d="M 488 110 Q 380 190 280 260"
          fill="none"
          stroke="url(#hero-conn-grad)"
          strokeWidth="1.5"
          opacity="0.5"
        />
        <path
          d="M 56 420 Q 168 360 280 320"
          fill="none"
          stroke="url(#hero-conn-grad)"
          strokeWidth="1.5"
          opacity="0.45"
        />
        <path
          d="M 504 420 Q 392 360 280 320"
          fill="none"
          stroke="url(#hero-conn-grad)"
          strokeWidth="1.5"
          opacity="0.45"
        />
        <circle cx="200" cy="210" r="5" fill="url(#hero-conn-grad)" opacity="0.85" />
        <defs>
          <linearGradient id="hero-conn-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#e879f9" />
            <stop offset="100%" stopColor="#fb923c" />
          </linearGradient>
        </defs>
      </svg>

      {FLOATING_CARDS.map((card) => (
        <article
          key={card.id}
          className="absolute hidden w-[8.5rem] overflow-hidden rounded-2xl border border-white/70 bg-white/85 p-1.5 shadow-[0_16px_48px_rgba(15,23,42,0.14)] backdrop-blur-sm sm:block md:w-[9.5rem] lg:w-[10.5rem]"
          style={{ ...card.style, zIndex: card.zIndex }}
        >
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
            <Image
              src={card.image}
              alt={card.industry}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 136px, 168px"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-2 pb-2 pt-8">
              <p className="truncate text-[11px] font-semibold text-white">
                {card.industry}
              </p>
              <p className="ds-mono-num font-mono text-[10px] text-white/85">
                {card.score}/100
              </p>
            </div>
          </div>
        </article>
      ))}

      <div
        className="absolute z-20 flex items-center gap-1.5 rounded-full border border-white/60 bg-white/75 px-3 py-1.5 text-xs font-medium shadow-[0_4px_20px_rgba(15,23,42,0.08)] backdrop-blur-md"
        style={{ right: "22%", top: "4%" }}
      >
        <Star className="size-3 fill-amber-400 text-amber-400" />
        <span className="ds-mono-num font-mono font-semibold text-[color:var(--landing-text)]">
          5.0
        </span>
        <span className="text-[color:var(--landing-muted)]">/5.0</span>
      </div>

      <div
        className="absolute left-1/2 z-10 w-[12rem] -translate-x-1/2 rounded-[1.75rem] border border-black/[0.06] bg-white p-4 shadow-[0_24px_64px_rgba(15,23,42,0.14)] sm:w-[13rem] sm:p-5 lg:w-[14rem]"
        style={{ top: "8%" }}
      >
        <div className="text-center">
          <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[color:var(--landing-muted)]">
            Diagnóstico en vivo
          </p>
          <h3 className="mt-0.5 font-display text-sm font-bold tracking-tight text-[color:var(--landing-text)] lg:text-base">
            {copy.landing.mockupTitle}
          </h3>
        </div>

        <div className="mt-3 flex justify-center">
          <Gauge
            value={sample.score}
            label={sample.industry}
            sublabel={sample.country}
            size={160}
            animate
          />
        </div>

        <div className="mt-2 space-y-1.5 px-1">
          {[
            { label: "Presencia", w: 88 },
            { label: "Operación", w: 62 },
            { label: "Captación", w: 45 },
          ].map((bar) => (
            <div key={bar.label} className="flex items-center gap-1.5">
              <span className="w-12 shrink-0 text-[8px] text-[color:var(--landing-muted)]">
                {bar.label}
              </span>
              <div className="h-1 flex-1 overflow-hidden rounded-full bg-black/[0.06]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#a855f7] to-[#fb923c]"
                  style={{ width: `${bar.w}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <p className="ds-mono-num mt-3 text-center font-mono text-[9px] text-[color:var(--landing-muted)] transition-opacity duration-500">
          {sample.industry} · {sample.country}
        </p>
      </div>
    </div>
  );
}
