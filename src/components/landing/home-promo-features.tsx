"use client";

import { motion, useReducedMotion } from "motion/react";
import { MarkOrbit } from "@/components/landing/home-promo-marks";

const POINTS = [
  "Criterio de diseño",
  "Un solo lenguaje",
  "Sin fricción extra",
  "Hecho a medida",
  "Pensado para operar",
] as const;

export function HomePromoFeatures() {
  const reduce = useReducedMotion() ?? false;

  return (
    <section className="dst-container pb-16 md:pb-20">
      <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-8">
        <motion.div
          initial={reduce ? false : { opacity: 0, x: -20 }}
          whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="max-w-[16ch] font-inter text-[2.15rem] leading-[1.12] font-normal tracking-[-0.02em] text-black sm:text-[2.7rem] lg:text-[3.15rem]">
            ¿Qué hace distinta
            <span className="mt-2 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center rounded-full border border-black/10 bg-white px-3 py-1 text-[0.72rem] tracking-[-0.01em] text-black">
                Desde el estudio
                <span className="ml-2 inline-flex h-4 w-8 items-center rounded-full bg-[#eee] p-0.5">
                  <span className="ml-auto size-3 rounded-full bg-[#111]" />
                </span>
              </span>
              <span>
                a esta <span className="text-[#c4b5fd]">plataforma</span>
              </span>
            </span>
            y memorable?
          </h2>
          <p className="mt-6 max-w-md font-inter text-[0.98rem] leading-relaxed text-[#8a8694]">
            Según el negocio y su momento, construimos un sistema que responde a cómo te ven, cómo
            te escriben y cómo operas.
          </p>
          <ol className="mt-8 grid max-w-lg grid-cols-1 gap-x-10 gap-y-3 sm:grid-cols-2">
            {POINTS.map((point, index) => (
              <motion.li
                key={point}
                className="flex items-center gap-3 font-inter text-[0.95rem] text-black"
                initial={reduce ? false : { opacity: 0, y: 10 }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.06 * index, duration: 0.4 }}
              >
                <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-[#c8eb4a] text-[0.7rem] font-semibold text-black">
                  {index + 1}
                </span>
                {point}
              </motion.li>
            ))}
          </ol>
        </motion.div>

        <motion.div
          className="flex justify-center lg:justify-end"
          initial={reduce ? false : { opacity: 0, scale: 0.92 }}
          whileInView={reduce ? undefined : { opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <MarkOrbit />
        </motion.div>
      </div>
    </section>
  );
}
