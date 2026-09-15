"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { BlurFade } from "@/components/ui/blur-fade";
import { BorderBeam } from "@/components/ui/border-beam";
import { CREATE_TOOL_HREF } from "@/lib/site";
import { BRAND_LINKS } from "@/lib/brand";

export function HomePromoInvite() {
  const reduce = useReducedMotion() ?? false;

  return (
    <section className="dst-container">
      <BlurFade>
        <motion.div
          className="relative overflow-hidden rounded-[2rem] bg-[#111111] px-6 py-14 text-white sm:px-10 sm:py-16 lg:px-16"
          whileHover={reduce ? undefined : { scale: 1.01 }}
          transition={{ type: "spring", stiffness: 220, damping: 22 }}
        >
          <BorderBeam
            size={180}
            duration={8}
            colorFrom="#c8eb4a"
            colorTo="#c084fc"
            borderWidth={1.6}
          />
          <motion.span
            aria-hidden
            className="absolute -top-8 -right-6 size-36 rounded-full bg-[#c8eb4a]/20 blur-3xl"
            animate={reduce ? undefined : { opacity: [0.25, 0.55, 0.25], scale: [1, 1.12, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <p className="relative font-inter text-[0.72rem] font-medium tracking-[0.22em] text-[#c8eb4a] uppercase">
            Siguiente paso
          </p>
          <h2 className="relative mt-5 max-w-2xl font-inter text-[2.1rem] leading-[1.1] font-normal tracking-[0.02em] sm:text-[2.7rem]">
            Si tu negocio necesita algo a medida, lo construimos.
          </h2>
          <p className="relative mt-5 max-w-xl font-inter text-[1.05rem] leading-relaxed text-white/65">
            Esta plataforma muestra cómo pensamos el producto. El estudio está para diseñar la
            pieza que todavía no existe.
          </p>
          <div className="relative mt-9 flex flex-wrap items-center gap-3">
            <motion.div whileHover={reduce ? undefined : { y: -4 }} whileTap={{ scale: 0.98 }}>
              <Link href={CREATE_TOOL_HREF} className="dst-lime-cta font-inter inline-flex">
                Crear herramienta
                <ArrowUpRight className="size-3.5 stroke-[2.4]" />
              </Link>
            </motion.div>
            <motion.div whileHover={reduce ? undefined : { y: -4 }} whileTap={{ scale: 0.98 }}>
              <Link
                href={BRAND_LINKS.website}
                className="inline-flex h-[2.6rem] items-center rounded-full border border-white/20 px-5 font-inter text-[0.8125rem] font-semibold tracking-[-0.01em] text-white transition-colors hover:border-[#c8eb4a] hover:text-[#c8eb4a]"
              >
                Conocer Dev Studio
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </BlurFade>
    </section>
  );
}
