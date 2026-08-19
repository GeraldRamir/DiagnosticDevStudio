"use client";

import { motion, useReducedMotion } from "motion/react";
import { TrendingUp } from "lucide-react";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const PILLARS = [
  { label: "Presencia", pct: 62, color: "#ee5b45" },
  { label: "Rendimiento", pct: 38, color: "#f68d7c" },
  { label: "Captación", pct: 24, color: "#fbc0b4" },
];

const FINDINGS = [
  { title: "Sin formulario de captación", tone: "#ee5b45" },
  { title: "Sitio lento en móvil (LCP 4.2 s)", tone: "#dd9a2b" },
  { title: "Dominio con HTTPS activo", tone: "#1f9d6b" },
];

function ScoreRing({ score }: { score: number }) {
  const reduce = useReducedMotion() ?? false;
  const size = 96;
  const stroke = 9;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = (score / 100) * c;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#ee5b45"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={reduce ? false : { strokeDashoffset: c }}
          animate={{ strokeDashoffset: c - dash }}
          transition={reduce ? { duration: 0 } : { duration: 1.6, delay: 0.5, ease: EASE }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-bold leading-none text-white">{score}</span>
        <span className="mt-1 text-[0.5625rem] font-medium uppercase tracking-[0.14em] text-white/50">
          de 100
        </span>
      </div>
    </div>
  );
}

export function HeroVisual() {
  const reduce = useReducedMotion() ?? false;

  return (
    <div className="relative mx-auto w-full max-w-[560px] overflow-x-clip">
      {/* Halo de color detrás del dispositivo */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 size-[min(340px,80vw)] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-80 blur-[60px]"
        style={{
          background: "radial-gradient(circle, #e6d4fb 0%, #fbe0d6 55%, transparent 72%)",
        }}
      />

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 40, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={reduce ? { duration: 0 } : { duration: 0.9, delay: 0.15, ease: EASE }}
        className="relative mx-auto w-[min(268px,100%)]"
      >
        {/* Marco del dispositivo */}
        <div className="rounded-[2.25rem] border-[7px] border-[#111111] bg-[#111111] shadow-[0_30px_60px_rgba(40,20,70,0.28)]">
          <div className="overflow-hidden rounded-[1.75rem] bg-[#101010]">
            <div className="flex items-center justify-between px-5 pt-4">
              <span className="text-[0.625rem] font-semibold text-white/50">Reporte</span>
              <span className="flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[0.5625rem] font-semibold text-white/70">
                <span className="size-1.5 rounded-full bg-[#1f9d6b]" />
                En vivo
              </span>
            </div>

            <div className="flex flex-col items-center px-5 pb-5 pt-3">
              <ScoreRing score={41} />
              <p className="mt-3 text-[0.8125rem] font-semibold text-white">Restaurante La Esquina</p>
              <p className="text-[0.625rem] text-white/45">Restaurante · México</p>
            </div>

            <div className="rounded-t-[1.5rem] bg-white px-5 pb-5 pt-4">
              <p className="text-[0.5625rem] font-semibold uppercase tracking-[0.16em] text-[#b6b6c0]">
                Pilares
              </p>
              <ul className="mt-3 space-y-2.5">
                {PILLARS.map((p, i) => (
                  <li key={p.label}>
                    <div className="flex items-center justify-between">
                      <span className="text-[0.6875rem] font-medium text-[#4d4d55]">{p.label}</span>
                      <span className="text-[0.6875rem] font-semibold tabular-nums text-[#131316]">
                        {p.pct}%
                      </span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[#f1eef7]">
                      <motion.div
                        initial={reduce ? false : { width: 0 }}
                        animate={{ width: `${p.pct}%` }}
                        transition={
                          reduce
                            ? { duration: 0 }
                            : { duration: 1.1, delay: 0.8 + i * 0.15, ease: EASE }
                        }
                        className="h-full rounded-full"
                        style={{ backgroundColor: p.color }}
                      />
                    </div>
                  </li>
                ))}
              </ul>

              <p className="mt-4 text-[0.5625rem] font-semibold uppercase tracking-[0.16em] text-[#b6b6c0]">
                Hallazgos
              </p>
              <ul className="mt-2 space-y-1.5">
                {FINDINGS.map((f, i) => (
                  <motion.li
                    key={f.title}
                    initial={reduce ? false : { opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={
                      reduce ? { duration: 0 } : { duration: 0.5, delay: 1.2 + i * 0.12 }
                    }
                    className="flex items-center gap-2 rounded-xl bg-[#f8f6fc] px-2.5 py-2"
                  >
                    <span
                      className="size-1.5 shrink-0 rounded-full"
                      style={{ backgroundColor: f.tone }}
                    />
                    <span className="truncate text-[0.625rem] font-medium text-[#4d4d55]">
                      {f.title}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Señales flotantes a los lados del dispositivo */}
      <motion.div
        initial={reduce ? false : { opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={reduce ? { duration: 0 } : { duration: 0.7, delay: 1.1, ease: EASE }}
        className="absolute right-0 top-[28%] hidden w-[168px] space-y-2 sm:block"
      >
        {[
          { label: "Velocidad móvil", value: "38" },
          { label: "Captación", value: "24" },
          { label: "Datos", value: "12" },
        ].map((s, i) => (
          <div
            key={s.label}
            className="flex items-center justify-between rounded-full bg-white/95 px-3 py-2 shadow-[0_8px_20px_rgba(60,30,90,0.10)] backdrop-blur"
            style={{ marginLeft: i * 12 }}
          >
            <span className="text-[0.625rem] font-medium text-[#7b7b87]">{s.label}</span>
            <span className="text-[0.6875rem] font-bold tabular-nums text-[#131316]">{s.value}</span>
          </div>
        ))}
      </motion.div>

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={reduce ? { duration: 0 } : { duration: 0.7, delay: 1.4, ease: EASE }}
        className="lp-float absolute -right-1 bottom-6 hidden items-center gap-2 rounded-2xl bg-[#111111] px-3.5 py-2.5 text-white shadow-[0_14px_34px_rgba(20,10,40,0.28)] sm:flex"
      >
        <TrendingUp className="size-3.5 text-[#ee5b45]" />
        <span className="text-[0.6875rem] font-semibold">+18 pts potenciales</span>
      </motion.div>
    </div>
  );
}
