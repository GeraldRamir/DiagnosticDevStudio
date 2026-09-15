"use client";

import { useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { MarkBars, MarkFlow, MarkHex } from "@/components/landing/home-promo-marks";

const CARDS = [
  {
    title: "Presencia que se entiende",
    body: "Tu negocio deja de verse improvisado. La plataforma ordena cómo te muestran, cómo te encuentran y cómo te eligen.",
    Mark: MarkHex,
  },
  {
    title: "Contacto que convierte",
    body: "Del perfil al mensaje, del anuncio a la conversación. Menos pasos para el cliente, más claridad para ti.",
    Mark: MarkFlow,
  },
  {
    title: "Operación que se sostiene",
    body: "Lo cotidiano también es digital: menús, códigos, enlaces y flujos que se mantienen con el mismo criterio.",
    Mark: MarkBars,
  },
] as const;

export function HomePromoShowcase() {
  const scroller = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion() ?? false;

  function move(direction: number) {
    scroller.current?.scrollBy({
      left: direction * 360,
      behavior: reduce ? "auto" : "smooth",
    });
  }

  return (
    <section id="sistema" className="scroll-mt-24 pb-12 md:pb-16">
      <div className="dst-container">
        <div className="mb-8 flex items-end justify-between gap-6">
          <h2 className="max-w-[16ch] font-inter text-[2rem] leading-[1.1] font-normal tracking-[-0.02em] text-black sm:text-[2.6rem] lg:text-[3rem]">
            Presencia y operación en un solo lugar
          </h2>
          <div className="mb-1 hidden shrink-0 items-center gap-2 sm:flex">
            <button
              type="button"
              onClick={() => move(-1)}
              className="inline-flex size-11 items-center justify-center rounded-full bg-white text-black transition-transform hover:-translate-x-0.5"
              aria-label="Ver anterior"
            >
              <ArrowLeft className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => move(1)}
              className="inline-flex size-11 items-center justify-center rounded-full bg-[#c8eb4a] text-black transition-transform hover:translate-x-0.5"
              aria-label="Ver siguiente"
            >
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={scroller}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 pl-[clamp(1.25rem,4vw,2.75rem)] pr-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {CARDS.map((card, index) => {
          const Mark = card.Mark;
          return (
            <motion.article
              key={card.title}
              className="min-w-[min(100%,20.5rem)] snap-start rounded-[1.75rem] bg-white px-8 py-9 sm:min-w-[22.5rem] lg:min-w-[24rem]"
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 * index, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              whileHover={reduce ? undefined : { y: -8 }}
            >
              <h3 className="font-inter text-[1.35rem] leading-tight font-normal tracking-[-0.03em] text-black">
                {card.title}
              </h3>
              <p className="mt-4 min-h-[4.5rem] font-inter text-[0.92rem] leading-relaxed text-[#8a8694]">
                {card.body}
              </p>
              <Mark />
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
