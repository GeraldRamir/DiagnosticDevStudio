"use client";

import { ArrowRight, Gauge, Globe2, Link2, Timer } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { HeroVisual } from "@/components/landing/hero-visual";
import { LpButton } from "@/components/landing/lp-ui";
import { lp } from "@/lib/landing-copy";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

function FloatCard({
  children,
  className,
  delay,
  float,
}: {
  children: React.ReactNode;
  className?: string;
  delay: number;
  float?: "normal" | "slow";
}) {
  const reduce = useReducedMotion() ?? false;

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 24, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={reduce ? { duration: 0 } : { duration: 0.7, delay, ease: EASE }}
      whileHover={reduce ? undefined : { y: -6, rotate: 0 }}
      className={className}
    >
      <div className={float === "slow" ? "lp-float-slow" : float ? "lp-float" : undefined}>
        {children}
      </div>
    </motion.div>
  );
}

export function HeroSection() {
  const reduce = useReducedMotion() ?? false;
  const h = lp.hero;

  return (
    <section className="relative overflow-x-clip px-[clamp(1rem,4vw,3.75rem)] pb-6 pt-[clamp(1.5rem,4vw,4rem)]">
      <div className="mx-auto w-full max-w-5xl text-center">
        <motion.h1
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reduce ? { duration: 0 } : { duration: 0.7, ease: EASE }}
          className="lp-font mx-auto max-w-3xl text-[clamp(2.125rem,5.6vw,3.75rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-[#131316]"
        >
          {h.titleTop}
          <br />
          {h.titleBottom}
        </motion.h1>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reduce ? { duration: 0 } : { duration: 0.7, delay: 0.1, ease: EASE }}
          className="mx-auto mt-5 max-w-xl text-[0.9375rem] leading-relaxed text-[#7b7b87]"
        >
          {h.subtitle}
        </motion.p>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reduce ? { duration: 0 } : { duration: 0.7, delay: 0.2, ease: EASE }}
          className="mt-7 flex w-full flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:items-center"
        >
          <LpButton href={h.ctaPrimary.href} variant="dark" size="lg" className="w-full sm:w-auto">
            {h.ctaPrimary.label}
          </LpButton>
          <LpButton
            href={h.ctaSecondary.href}
            variant="light"
            size="lg"
            className="w-full sm:w-auto"
            icon={<ArrowRight className="size-4" />}
          >
            {h.ctaSecondary.label}
          </LpButton>
        </motion.div>
      </div>

      {/* Escenario: dispositivo al centro, tarjetas de color alrededor */}
      <div className="relative mx-auto mt-10 w-full max-w-6xl">
        <div className="grid items-center gap-6 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
          {/* Columna izquierda */}
          <div className="order-2 flex flex-row flex-wrap items-start justify-center gap-4 lg:order-1 lg:flex-col lg:items-start">
            <FloatCard delay={0.5} float="normal">
              <div className="lp-card-hover w-full max-w-[190px] rounded-[1.375rem] bg-[#ffd95e] p-4">
                <span className="flex size-8 items-center justify-center rounded-full bg-[#111111]/10">
                  <Timer className="size-4 text-[#3c2f00]" />
                </span>
                <p className="lp-font mt-4 text-[1.75rem] font-semibold leading-none tracking-tight text-[#2e2400]">
                  {h.floatA.value}
                </p>
                <p className="mt-1.5 text-[0.6875rem] font-medium leading-snug text-[#6b5500]">
                  {h.floatA.label}
                </p>
              </div>
            </FloatCard>

            <FloatCard delay={0.65} float="slow">
              <div className="lp-card-hover w-full max-w-[214px] rounded-[1.375rem] border border-[#efecf4] bg-white p-4 shadow-[0_12px_30px_rgba(60,30,90,0.08)]">
                <div className="flex items-center gap-2">
                  <span className="flex size-8 items-center justify-center rounded-full bg-[#f3ecff] text-[#5b3fa8]">
                    <Link2 className="size-4" />
                  </span>
                  <p className="text-[0.75rem] font-semibold leading-tight text-[#131316]">
                    {h.floatC.title}
                  </p>
                </div>
                <span className="lp-font mt-3 inline-flex h-8 items-center rounded-full bg-[#111111] px-3.5 text-[0.6875rem] font-semibold text-white">
                  {h.floatC.cta}
                </span>
              </div>
            </FloatCard>
          </div>

          {/* Dispositivo */}
          <div className="order-1 lg:order-2">
            <HeroVisual />
          </div>

          {/* Columna derecha */}
          <div className="order-3 flex flex-row flex-wrap items-start justify-center gap-4 lg:flex-col lg:items-end">
            <FloatCard delay={0.8} float="slow">
              <div className="lp-card-hover w-full max-w-[214px] rounded-[1.375rem] border border-[#efecf4] bg-white p-4 shadow-[0_12px_30px_rgba(60,30,90,0.08)]">
                <div className="flex items-center gap-2">
                  <span className="flex size-8 items-center justify-center rounded-full bg-[#ffe7e1] text-[#ee5b45]">
                    <Gauge className="size-4" />
                  </span>
                  <p className="text-[0.75rem] font-semibold leading-tight text-[#131316]">
                    {h.floatD.title}
                  </p>
                </div>
                <p className="mt-2.5 text-[0.6875rem] leading-relaxed text-[#8b8b96]">
                  {h.floatD.value}
                </p>
              </div>
            </FloatCard>

            <FloatCard delay={0.95} float="normal">
              <div className="lp-card-hover w-full max-w-[190px] rounded-[1.375rem] bg-[#ee5b45] p-4 text-white">
                <span className="flex size-8 items-center justify-center rounded-full bg-white/20">
                  <Globe2 className="size-4" />
                </span>
                <p className="lp-font mt-4 text-[1.75rem] font-semibold leading-none tracking-tight">
                  {h.floatB.value}
                </p>
                <p className="mt-1.5 text-[0.6875rem] font-medium leading-snug text-white/80">
                  {h.floatB.label}
                </p>
              </div>
            </FloatCard>
          </div>
        </div>
      </div>
    </section>
  );
}
