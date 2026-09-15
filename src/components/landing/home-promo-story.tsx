"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { MarkPerson, MarkRadar, MarkRings, MarkToggles } from "@/components/landing/home-promo-marks";

const CELLS = [
  {
    title: "Presencia y operación juntas",
    body: "Cómo te ven y cómo sigues vendiendo dejan de vivir en lugares distintos.",
    tag: "Capa 01",
    Mark: MarkRings,
  },
  {
    title: "Todo queda conectado",
    body: "Perfil, mensaje y flujo se hablan entre sí. El cliente no salta de herramienta en herramienta.",
    tag: "Capa 02",
    Mark: MarkToggles,
  },
  {
    title: "Criterio de un estudio",
    body: "Cada decisión visual y de producto pasa por el mismo estándar de Dev Studio.",
    tag: "Capa 03",
    Mark: MarkRadar,
  },
  {
    title: "Un lenguaje digital completo",
    body: "Una estética, un tono y una forma de operar. El negocio se entiende de un vistazo.",
    tag: "Capa 04",
    Mark: MarkPerson,
  },
] as const;

const STATS = [
  { value: "5", label: "piezas vivas" },
  { value: "1", label: "estudio detrás" },
  { value: "0", label: "cuentas extra" },
] as const;

const LAYERS = ["Diagnóstico", "Captación", "Contacto", "Operación", "Identidad"] as const;

export function HomePromoStory() {
  const reduce = useReducedMotion() ?? false;

  return (
    <section id="plataforma" className="dst-container scroll-mt-24 pt-12 pb-10 md:pt-20 md:pb-12 lg:pt-24">
      <motion.div
        className="rounded-[2rem] bg-white px-6 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-14"
        initial={reduce ? false : { opacity: 0, y: 28 }}
        whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="grid items-start gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            <p className="font-inter text-[0.72rem] font-medium tracking-[0.22em] text-[#8a8694] uppercase">
              La plataforma
            </p>
            <h2 className="mt-4 font-inter text-[2.15rem] leading-[1.08] font-normal tracking-[-0.02em] text-black sm:text-[2.75rem] lg:text-[3.25rem]">
              <span className="block">Creamos un sistema</span>
              <span className="block">para digitalizar</span>
              <span className="block">tu negocio</span>
            </h2>
          </div>
          <div className="lg:pt-7">
            <p className="max-w-md font-inter text-[0.95rem] leading-[1.7] text-[#8a8694] lg:text-[1.02rem]">
              Reunimos presencia, contacto y operación en un solo lugar. El objetivo es que un
              negocio se vea, se contacte y trabaje en digital — sin procesos sueltos ni cuentas
              extra.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {STATS.map((stat) => (
                <span
                  key={stat.label}
                  className="inline-flex items-center gap-2 rounded-full bg-[#f4f2f8] px-3 py-1.5 font-inter text-[0.78rem] text-black"
                >
                  <span className="font-semibold">{stat.value}</span>
                  <span className="text-[#8a8694]">{stat.label}</span>
                </span>
              ))}
            </div>
            <Link
              href="#sistema"
              className="mt-7 inline-flex h-11 items-center gap-2 rounded-full bg-[#111111] px-5 font-inter text-[0.8125rem] font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5"
            >
              Explorar más
              <ArrowUpRight className="size-3.5 stroke-[2.4]" />
            </Link>
          </div>
        </div>

        <div className="mt-12 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {CELLS.map((cell, index) => {
            const Mark = cell.Mark;
            return (
              <motion.article
                key={cell.title}
                className="rounded-[1.5rem] bg-[#f6f4fa] px-5 py-6 text-left"
                initial={reduce ? false : { opacity: 0, y: 18 }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.08 * index, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                whileHover={reduce ? undefined : { y: -6 }}
              >
                <span className="inline-flex rounded-full bg-white px-2.5 py-1 font-inter text-[0.68rem] font-semibold tracking-[0.08em] text-[#8a8694] uppercase">
                  {cell.tag}
                </span>
                <h3 className="mt-3 font-inter text-[1.05rem] leading-snug font-medium tracking-[-0.02em] text-black">
                  {cell.title}
                </h3>
                <p className="mt-2 min-h-[3.4rem] font-inter text-[0.82rem] leading-relaxed text-[#8a8694]">
                  {cell.body}
                </p>
                <div className="mt-5 flex justify-center">
                  <Mark />
                </div>
              </motion.article>
            );
          })}
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-[#efeaf6] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-inter text-[0.78rem] tracking-[0.06em] text-[#8a8694] uppercase">
            Qué cubre el sistema
          </p>
          <ul className="flex flex-wrap gap-2">
            {LAYERS.map((layer) => (
              <li
                key={layer}
                className="rounded-full border border-black/8 bg-white px-3.5 py-1.5 font-inter text-[0.8rem] text-black"
              >
                {layer}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </section>
  );
}
