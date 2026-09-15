"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import {
  BarChart3,
  Camera,
  Heart,
  MessageCircle,
  QrCode,
  Star,
  UtensilsCrossed,
} from "lucide-react";
import { TOOL_ICONS } from "@/components/tools/tool-icons";
import { TOOL_MARKS } from "@/components/tools/tool-marks";
import { getToolTheme } from "@/components/tools/tool-theme";
import { getToolBySlug } from "@/lib/tools";
import { cn } from "@/lib/utils";

const HUB = {
  diagnostico: "/tools/diagnostico-digital",
  instagram: "/tools/instagram-analyzer",
  whatsapp: "/tools/whatsapp-generator",
  qr: "/tools/qr-generator",
  menu: "/tools/menu-digital",
} as const;

export function ToolsHubIllustration() {
  const reduce = useReducedMotion();

  return (
    <div className="relative mx-auto mt-10 grid max-w-[58rem] grid-cols-2 gap-3 sm:mt-12 sm:grid-cols-6 lg:mt-14 lg:block lg:h-[34.5rem]">
      <div
        className="pointer-events-none absolute top-[18%] left-1/2 hidden h-[22rem] w-[22rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_50%_40%,#fde9b8_0%,#fff7e4_42%,transparent_72%)] lg:block"
        aria-hidden
      />

      <div className="col-span-2 flex justify-center sm:col-span-6 lg:absolute lg:top-1/2 lg:left-1/2 lg:z-10 lg:-translate-x-1/2 lg:-translate-y-[46%]">
        <HubPhone reduce={Boolean(reduce)} />
      </div>

      <FloatCard
        href={HUB.instagram}
        label="Analizador de Instagram"
        delay={0.04}
        reduce={Boolean(reduce)}
        className="sm:col-span-2 lg:absolute lg:top-[7%] lg:left-[1%] lg:z-20 lg:w-[10.75rem]"
      >
        <div className="relative overflow-hidden rounded-[1.35rem] bg-[#d7e8f6] shadow-[0_18px_40px_rgba(22,22,28,0.1)]">
          <span className="absolute top-2.5 left-2.5 z-10 rounded-full bg-white/85 px-2 py-0.5 text-[0.62rem] font-semibold text-[#16161c]">
            Bio
          </span>
          <div className="flex h-[7.6rem] items-center justify-center bg-[linear-gradient(160deg,#c5dcf3_0%,#8eb6d8_55%,#f3efe6_100%)]">
            <Camera className="size-10 text-white/90" strokeWidth={1.5} aria-hidden />
          </div>
        </div>
      </FloatCard>

      <FloatCard
        href={HUB.diagnostico}
        label="Diagnóstico Digital"
        delay={0.1}
        reduce={Boolean(reduce)}
        className="sm:col-span-2 lg:absolute lg:bottom-[14%] lg:left-0 lg:z-20 lg:w-[13.5rem]"
      >
        <div className="flex items-center gap-3 rounded-[1.35rem] bg-[#f4d35e] px-4 py-3.5 shadow-[0_18px_40px_rgba(22,22,28,0.1)]">
          <span className="inline-flex size-10 items-center justify-end gap-0.5" aria-hidden>
            {[10, 16, 12, 20].map((h, i) => (
              <span
                key={i}
                className="w-1.5 rounded-full bg-[#16161c]"
                style={{ height: h }}
              />
            ))}
          </span>
          <span>
            <span className="block text-[0.68rem] font-medium text-[#16161c]/70">
              Diagnóstico
            </span>
            <span className="flex items-center gap-1 text-[1.35rem] font-semibold tracking-[-0.04em] text-[#16161c]">
              Listo
              <BarChart3 className="size-4" strokeWidth={2.2} aria-hidden />
            </span>
          </span>
        </div>
      </FloatCard>

      <FloatCard
        href={HUB.whatsapp}
        label="Link de WhatsApp"
        delay={0.14}
        reduce={Boolean(reduce)}
        className="sm:col-span-2 lg:absolute lg:top-[42%] lg:left-[14%] lg:z-30 lg:w-auto"
      >
        <div className="inline-flex items-center gap-1.5 rounded-full bg-[#f3d4ef] px-3 py-1.5 shadow-[0_12px_28px_rgba(22,22,28,0.1)]">
          <Star className="size-3.5 fill-[#c45aa8] text-[#c45aa8]" aria-hidden />
          <Star className="size-3.5 fill-[#c45aa8] text-[#c45aa8]" aria-hidden />
          <Star className="size-3.5 fill-[#c45aa8] text-[#c45aa8]" aria-hidden />
          <MessageCircle className="size-3.5 text-[#16161c]" strokeWidth={2} aria-hidden />
        </div>
      </FloatCard>

      <FloatCard
        href={HUB.menu}
        label="Menú Digital"
        delay={0.08}
        reduce={Boolean(reduce)}
        className="sm:col-span-3 lg:absolute lg:top-[5%] lg:right-0 lg:z-20 lg:w-[14.25rem]"
      >
        <div className="flex items-center justify-between gap-3 rounded-[1.45rem] bg-[#d8f3c9] px-4 py-3.5 shadow-[0_18px_40px_rgba(22,22,28,0.1)]">
          <span>
            <span className="flex items-baseline gap-1 font-semibold tracking-[-0.04em] text-[#16161c]">
              <span className="text-[1.85rem] leading-none">8</span>
              <span className="text-[0.92rem]">platos</span>
            </span>
            <span className="mt-0.5 block text-[0.72rem] text-[#16161c]/65">
              Menú digital · Gratis
            </span>
          </span>
          <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-white/70">
            <UtensilsCrossed className="size-5 text-[#3d7a1f]" strokeWidth={1.8} aria-hidden />
          </span>
        </div>
      </FloatCard>

      <FloatCard
        href={HUB.qr}
        label="Generador de QR"
        delay={0.16}
        reduce={Boolean(reduce)}
        className="sm:col-span-3 lg:absolute lg:right-[2%] lg:bottom-[12%] lg:z-20 lg:w-[11.5rem]"
      >
        <div className="overflow-hidden rounded-[1.35rem] bg-white shadow-[0_18px_40px_rgba(22,22,28,0.12)]">
          <div className="relative flex h-[6.4rem] items-center justify-center bg-[#f6f1ea]">
            <QrCode className="size-12 text-[#16161c]" strokeWidth={1.6} aria-hidden />
            <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[0.62rem] font-semibold text-[#16161c] shadow-sm">
              <Heart className="size-3 fill-[#e11d48] text-[#e11d48]" aria-hidden />
              Escanea
            </span>
          </div>
        </div>
      </FloatCard>
    </div>
  );
}

function FloatCard({
  href,
  label,
  delay,
  reduce,
  className,
  children,
}: {
  href: string;
  label: string;
  delay: number;
  reduce: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0.12 : 0.5, delay: reduce ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn(className)}
    >
      <Link
        href={href}
        aria-label={`Abrir ${label}`}
        className="block rounded-[1.45rem] transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#16161c]"
      >
        {children}
        <span className="mt-2 block px-1 text-[0.78rem] font-medium tracking-[-0.02em] text-[#16161c] lg:sr-only">
          {label}
        </span>
      </Link>
    </motion.div>
  );
}

function HubPhone({ reduce }: { reduce: boolean }) {
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0.12 : 0.55, delay: reduce ? 0 : 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-[13.75rem] sm:w-[15.35rem]"
    >
      <div className="rounded-[2.15rem] bg-[#111] p-[7px] shadow-[0_28px_70px_rgba(16,16,19,0.28)]">
        <div className="relative overflow-hidden rounded-[1.75rem] bg-[#fbfaf7]">
          <span
            className="absolute top-2.5 left-1/2 z-20 h-[1.15rem] w-[4.6rem] -translate-x-1/2 rounded-full bg-[#111]"
            aria-hidden
          />

          <div className="px-3.5 pt-10 pb-4">
            <div className="flex items-center justify-between">
              <p className="text-[0.68rem] font-semibold tracking-[-0.02em] text-[#16161c]">
                Dev Studio
              </p>
              <span className="inline-flex items-center rounded-full bg-[#e11d48] px-2 py-0.5 text-[0.58rem] font-semibold tracking-wide text-white uppercase">
                Live
              </span>
            </div>
            <p className="mt-4 text-left text-[1.12rem] leading-tight font-semibold tracking-[-0.04em] text-[#16161c]">
              Todas las opciones
            </p>
            <p className="mt-1 text-left text-[0.7rem] text-[#8b9190]">
              5 herramientas listas
            </p>

            <ul className="mt-4 space-y-1.5">
              {TOOL_MARKS.map(({ href, label }) => {
                const slug = href.replace("/tools/", "");
                const tool = getToolBySlug(slug);
                if (!tool) return null;
                const Icon = TOOL_ICONS[tool.icon];
                const theme = getToolTheme(tool.id);

                return (
                  <li key={href}>
                    <Link
                      href={href}
                      className="flex items-center gap-2.5 rounded-[0.95rem] bg-white px-2 py-1.5 shadow-[0_6px_16px_rgba(22,22,28,0.06)] transition-transform duration-200 hover:-translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#16161c]"
                    >
                      <span
                        className="inline-flex size-8 shrink-0 items-center justify-center rounded-[0.7rem]"
                        style={{ backgroundColor: theme.surface }}
                      >
                        <Icon
                          className="size-3.5"
                          strokeWidth={1.8}
                          style={{ color: theme.icon }}
                          aria-hidden
                        />
                      </span>
                      <span className="min-w-0 flex-1 text-left text-[0.72rem] font-semibold tracking-[-0.02em] text-[#16161c]">
                        {label}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
