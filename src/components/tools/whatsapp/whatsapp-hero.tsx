"use client";

import { motion, useReducedMotion } from "motion/react";
import { Check, MessageCircle } from "lucide-react";

export function WhatsappHero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-x-clip bg-white">
      <div
        className="pointer-events-none absolute -top-24 right-[-8rem] h-[28rem] w-[28rem] rounded-full bg-[#90BF53]/18 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-[-8rem] left-[-10rem] h-[22rem] w-[22rem] rounded-full bg-[#16161c]/6 blur-3xl"
        aria-hidden
      />

      <div className="dst-container grid items-center gap-12 py-12 md:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
        <div>
          <p className="text-[0.72rem] font-semibold tracking-[0.18em] text-[#6b716f] uppercase">
            Gratis · Sin registro · Sin complicaciones
          </p>
          <h1 className="mt-4 max-w-[12ch] font-inter text-[3.1rem] leading-[0.92] font-semibold tracking-[-0.055em] text-[#16161c] sm:text-[4.4rem] lg:text-[5.1rem]">
            Crea tu Link de WhatsApp
          </h1>
          <p className="mt-6 max-w-md text-[1.05rem] leading-relaxed text-[#6b716f]">
            Permite que tus clientes te contacten directamente con un solo clic.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#generador"
              className="inline-flex h-12 min-h-12 items-center rounded-full bg-[#90BF53] px-6 text-sm font-semibold text-[#13200a] transition-[filter,transform] duration-200 hover:-translate-y-0.5 hover:brightness-[0.97]"
            >
              Crear mi enlace
            </a>
            <a
              href="#como-funciona"
              className="inline-flex h-12 min-h-12 items-center rounded-full border border-[#16161c]/10 bg-white px-6 text-sm font-semibold text-[#16161c] transition-colors duration-200 hover:border-[#16161c]/25"
            >
              Cómo funciona
            </a>
          </div>
        </div>

        <div className="relative mx-auto h-[22rem] w-full max-w-[28rem] lg:h-[26rem]">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-2 right-2 w-[13.5rem] rounded-[1.5rem] bg-[#16161c] p-4 text-white shadow-[0_24px_50px_rgba(22,22,28,0.22)] sm:right-6 sm:w-[15rem]"
          >
            <p className="text-[0.68rem] tracking-[0.14em] text-white/40 uppercase">Tu enlace</p>
            <p className="mt-2 font-mono text-[0.92rem] tracking-tight">wa.me/18095551234</p>
            <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#90BF53] px-2.5 py-1 text-[0.7rem] font-semibold text-[#13200a]">
              <Check className="size-3" strokeWidth={2.4} aria-hidden />
              Listo para copiar
            </p>
          </motion.div>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-[7.5rem] left-0 w-[16.5rem] rounded-[1.5rem] bg-white p-4 shadow-[0_18px_40px_rgba(22,22,28,0.1)] sm:left-4 sm:w-[18rem]"
          >
            <div className="flex items-center gap-3">
              <span className="inline-flex size-10 items-center justify-center rounded-full bg-[#90BF53]/20 text-[#3d7a1f]">
                <MessageCircle className="size-4" strokeWidth={1.8} aria-hidden />
              </span>
              <div>
                <p className="text-sm font-semibold text-[#16161c]">Cliente</p>
                <p className="text-[0.7rem] text-[#8b9190]">ahora</p>
              </div>
            </div>
            <p className="mt-3 rounded-2xl rounded-tl-sm bg-[#f4f7f2] px-3 py-2.5 text-[0.82rem] leading-snug text-[#16161c]">
              Hola, quiero información sobre sus productos.
            </p>
          </motion.div>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 bottom-4 w-[12.5rem] rounded-[1.35rem] bg-white px-4 py-3 shadow-[0_16px_36px_rgba(22,22,28,0.1)] sm:right-8"
          >
            <p className="text-[0.7rem] font-medium text-[#6b716f]">Un clic en Instagram</p>
            <p className="mt-1 text-sm font-semibold text-[#16161c]">Abre el chat escrito</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
