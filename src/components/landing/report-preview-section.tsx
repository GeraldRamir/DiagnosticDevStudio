"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { motion, useInView, useReducedMotion } from "motion/react";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  Clock,
  Download,
  Layers,
  Search,
  ShieldCheck,
  Target,
} from "lucide-react";
import {
  Card,
  CardHead,
  Chip,
  ConcentricRings,
  Counter,
  GaugeRing,
  MiniBars,
  SignalDots,
  Sparkline,
  StaticPill,
  StatusDot,
} from "@/components/report/report-ui";
import { LpButton, LpSection, Reveal, SectionTitle } from "@/components/landing/lp-ui";
import { LOGO_SRC } from "@/lib/brand";
import { RP_SCALE, type RpStatus } from "@/lib/report-theme";

/** Muestra con las mismas proporciones que un diagnóstico real */
const DEMO = {
  industry: "Restaurante",
  score: 41,
  scoreLabel: "Frágil",
  hoursMonth: 47,
  hoursRecoverable: 18,
  recoverablePct: 38,
  totalAchieved: 41,
  totalPossible: 100,
  signalsTotal: 13,
  statusCounts: { fail: 3, warn: 4, ok: 6 },
  pillars: [
    { label: "Presencia", pct: 62, score: 15, max: 25 },
    { label: "Rendimiento", pct: 38, score: 8, max: 20 },
    { label: "Captación", pct: 24, score: 6, max: 25 },
    { label: "Operación", pct: 45, score: 9, max: 20 },
    { label: "Datos", pct: 20, score: 3, max: 10 },
  ].map((p, i) => ({ ...p, color: RP_SCALE[i % RP_SCALE.length] })),
  signals: [
    { label: "Dominio propio", status: "ok" as RpStatus },
    { label: "HTTPS activo", status: "ok" as RpStatus },
    { label: "Sitio indexable", status: "ok" as RpStatus },
    { label: "Velocidad móvil (LCP)", status: "fail" as RpStatus },
    { label: "Peso de la página", status: "warn" as RpStatus },
    { label: "Adaptación a móvil", status: "warn" as RpStatus },
    { label: "Formulario de captación", status: "fail" as RpStatus },
    { label: "WhatsApp visible", status: "ok" as RpStatus },
    { label: "Vista previa al compartir", status: "warn" as RpStatus },
    { label: "Registro de pedidos", status: "fail" as RpStatus },
    { label: "Canales de contacto", status: "ok" as RpStatus },
    { label: "Analítica instalada", status: "warn" as RpStatus },
    { label: "Reportes de venta", status: "ok" as RpStatus },
  ],
  findings: [
    { title: "Sin formulario de captación", status: "fail" as RpStatus, weight: 8 },
    { title: "Sitio lento en móvil (LCP 4.2 s)", status: "warn" as RpStatus, weight: 6 },
    { title: "Registro de pedidos manual", status: "fail" as RpStatus, weight: 5 },
  ],
};

const RINGS = [...DEMO.pillars]
  .sort((a, b) => b.score - a.score)
  .slice(0, 4)
  .map((p) => ({ label: p.label, value: `${p.score} pt` }));

const TABS = ["Dashboard", "Pilares", "Señales", "Reporte", "Sistemas"] as const;
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * Monta el dashboard al entrar en pantalla (o si el ancla #reporte ya lo dejó
 * a la vista) para que contadores, gauges y sparklines se armen al llegar.
 */
function MountOnView({
  children,
  minHeight,
  className,
}: {
  children: ReactNode;
  minHeight: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.05 });
  const [force, setForce] = useState(false);

  useEffect(() => {
    if (window.location.hash !== "#reporte") return;
    // Tras el scroll del ancla, monta aunque el umbral de useInView tarde un tick
    const t = window.setTimeout(() => setForce(true), 120);
    return () => window.clearTimeout(t);
  }, []);

  const show = inView || force;

  return (
    <div ref={ref} className={className} style={{ minHeight: show ? undefined : minHeight }}>
      {show ? children : null}
    </div>
  );
}

function IconBubble({ children }: { children: ReactNode }) {
  return (
    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#f4f4f4] text-[#5c5c5c] transition-colors duration-300 group-hover:bg-[#fdeeeb] group-hover:text-[#ee5b45]">
      {children}
    </span>
  );
}

function PreviewShell({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion() ?? false;

  return (
    <div className="rp-font overflow-hidden rounded-[clamp(1rem,2vw,1.5rem)] bg-[#f5f5f5]">
      <div className="bg-[#f0f0f0] px-3 pb-4 pt-3 sm:px-5 sm:pt-4">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reduce ? { duration: 0 } : { duration: 0.5, ease: EASE }}
          className="flex flex-wrap items-center justify-between gap-3"
        >
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#e4e4e4] bg-white">
              <Image
                src={LOGO_SRC}
                alt=""
                width={819}
                height={1024}
                className="size-5 object-contain"
                sizes="20px"
              />
            </span>
            <div className="min-w-0 leading-tight">
              <p className="truncate text-[0.8125rem] font-bold tracking-tight text-[#131313]">
                Diagnóstico
              </p>
              <p className="truncate text-[0.8125rem] font-light text-[#a3a3a3]">Digital</p>
            </div>
            <span className="ml-1 hidden rounded-full bg-[#fdeeeb] px-2.5 py-1 text-[0.625rem] font-semibold uppercase tracking-[0.12em] text-[#d9452f] sm:inline-flex">
              Ejemplo
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden h-9 items-center gap-2 rounded-full border border-[#ececec] bg-white px-3 text-[0.6875rem] text-[#b0b0b0] sm:inline-flex">
              <Search className="size-3.5" />
              Buscar en el informe…
            </span>
            <span className="relative flex size-9 items-center justify-center rounded-full border border-[#ececec] bg-white text-[#4a4a4a]">
              <Bell className="size-3.5" />
              <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-[#ee5b45]" />
            </span>
            <span className="flex size-9 items-center justify-center rounded-full bg-[#101010] text-[0.625rem] font-bold text-white">
              LE
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reduce ? { duration: 0 } : { duration: 0.55, delay: 0.12, ease: EASE }}
          className="mt-4 flex flex-wrap items-center justify-between gap-3"
        >
          <div className="flex items-center gap-2.5">
            <span className="flex h-12 items-center gap-2.5 rounded-full border border-[#e4e4e4] bg-white px-3.5">
              <span className="text-lg font-bold leading-none text-[#131313]">10</span>
              <span className="max-w-[74px] text-[0.625rem] font-medium capitalize leading-tight text-[#9a9a9a]">
                lun, agosto
              </span>
            </span>
            <span className="group relative inline-flex h-10 items-center gap-2 overflow-hidden rounded-full bg-[#ee5b45] px-4 text-[0.8125rem] font-semibold text-white">
              <span className="rp-shine" aria-hidden />
              Ver hallazgos
              <span className="flex size-5 items-center justify-center rounded-full bg-white/20">
                <ArrowRight className="size-3" />
              </span>
            </span>
          </div>

          <div className="flex min-w-0 items-center gap-3">
            <div className="min-w-0 text-right">
              <p className="truncate text-[1.0625rem] font-bold leading-tight tracking-tight text-[#131313]">
                Hola, Restaurante
              </p>
              <p className="truncate text-[1.0625rem] font-light leading-tight text-[#b0b0b0]">
                La Esquina
              </p>
            </div>
            <span className="flex size-11 items-center justify-center rounded-full border border-[#ececec] bg-white text-[#4a4a4a]">
              <Download className="size-4" />
            </span>
          </div>
        </motion.div>

        <nav className="rp-scrollbar -mx-1 mt-4 flex gap-2 overflow-x-auto px-1 pb-1" aria-label="Vistas del informe">
          {TABS.map((tab, i) => (
            <motion.span
              key={tab}
              initial={reduce ? false : { opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={reduce ? { duration: 0 } : { duration: 0.35, delay: 0.2 + i * 0.05 }}
              className={
                i === 0
                  ? "inline-flex h-8 shrink-0 items-center rounded-full bg-[#101010] px-3.5 text-[0.6875rem] font-semibold text-white"
                  : "inline-flex h-8 shrink-0 items-center rounded-full border border-[#ececec] bg-white px-3.5 text-[0.6875rem] font-semibold text-[#6b6b6b]"
              }
            >
              {tab}
            </motion.span>
          ))}
        </nav>
      </div>

      {children}
    </div>
  );
}

function PreviewDashboard() {
  const topPillars = DEMO.pillars.slice(0, 3);

  return (
    <div className="grid grid-cols-1 gap-2.5 px-3 py-3 sm:px-5 sm:py-4 md:grid-cols-2 xl:grid-cols-12">
      {/* Perfil */}
      <Card className="group flex flex-col justify-between md:col-span-2 xl:col-span-3" delay={0}>
        <div>
          <div className="flex items-start justify-between gap-3">
            <p className="text-[0.8125rem] font-black uppercase tracking-[0.18em] text-[#131313]">
              DevStudio
            </p>
            <StaticPill label="Diagnóstico" />
          </div>
          <p className="mt-6 text-[0.6875rem] text-[#b0b0b0]">
            Informe emitido para {DEMO.industry}
          </p>
          <p className="mt-1 font-mono text-[0.8125rem] tracking-[0.2em] text-[#5c5c5c]">
            •••• A7F2
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex h-9 items-center rounded-full bg-[#101010] px-4 text-xs font-semibold text-white">
              Hallazgos
            </span>
            <span className="inline-flex h-9 items-center rounded-full border border-[#ececec] bg-white px-4 text-xs font-semibold text-[#131313]">
              Compartir
            </span>
          </div>
        </div>
        <div className="mt-5 flex items-end justify-between gap-3 border-t border-[#f3f3f3] pt-4">
          <div>
            <p className="text-[0.6875rem] text-[#b0b0b0]">Carga administrativa</p>
            <p className="mt-0.5 text-base font-bold leading-none text-[#131313]">
              <Counter value={DEMO.hoursMonth} delay={0.3} /> h
              <span className="text-xs font-semibold text-[#c9c9c9]">/mes</span>
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-[0.6875rem] font-semibold text-[#ee5b45]">
            <span className="flex size-5 items-center justify-center rounded-full bg-[#fdeeeb]">
              <ArrowUpRight className="size-3" />
            </span>
            Ver pilares
          </span>
        </div>
      </Card>

      {/* Puntaje + horas */}
      <div className="grid gap-2.5 md:col-span-2 xl:col-span-3">
        <Card className="group" delay={0.08}>
          <div className="flex items-center justify-between gap-3">
            <IconBubble>
              <Target className="size-4" />
            </IconBubble>
            <StaticPill label="Global" />
          </div>
          <p className="mt-4 text-[0.6875rem] text-[#b0b0b0]">Puntaje global</p>
          <p className="mt-1 text-[1.5rem] font-bold leading-none tracking-tight text-[#131313]">
            <Counter value={DEMO.score} delay={0.35} />
            <span className="text-base font-semibold text-[#c9c9c9]">/100</span>
          </p>
        </Card>

        <Card className="group" delay={0.16}>
          <div className="flex items-center justify-between gap-3">
            <IconBubble>
              <Clock className="size-4" />
            </IconBubble>
            <StaticPill label="Mensual" />
          </div>
          <p className="mt-4 text-[0.6875rem] text-[#b0b0b0]">Horas recuperables</p>
          <p className="mt-1 text-[1.5rem] font-bold leading-none tracking-tight text-[#131313]">
            <Counter value={DEMO.hoursRecoverable} delay={0.45} />
            <span className="text-base font-semibold text-[#c9c9c9]"> h</span>
          </p>
        </Card>
      </div>

      {/* Estado + gauge */}
      <div className="grid gap-2.5 md:col-span-1 xl:col-span-2">
        <Card
          className="group flex flex-col items-center justify-center gap-2.5 py-5 text-center"
          delay={0.24}
        >
          <span className="flex size-10 items-center justify-center rounded-full bg-[#101010] text-white transition-colors duration-300 group-hover:bg-[#ee5b45]">
            <ShieldCheck className="size-4" />
          </span>
          <p className="text-[0.8125rem] font-semibold leading-tight text-[#131313]">
            Análisis completo
          </p>
        </Card>
        <Card tone="dark" className="flex items-center justify-center py-5" delay={0.32}>
          <GaugeRing value={DEMO.score} caption={DEMO.scoreLabel} size={112} delay={0.55} />
        </Card>
      </div>

      {/* Señales, barras y sparkline */}
      <div className="grid gap-2.5 md:col-span-1 xl:col-span-4">
        <div className="grid gap-2.5 sm:grid-cols-2">
          <Card className="group" delay={0.4}>
            <IconBubble>
              <Clock className="size-4" />
            </IconBubble>
            <p className="mt-3 text-[1.25rem] font-bold leading-none tracking-tight text-[#131313]">
              <Counter value={DEMO.hoursMonth} delay={0.6} /> h
            </p>
            <p className="mt-1 text-[0.625rem] text-[#a3a3a3]">
              {DEMO.signalsTotal} señales medidas
            </p>
            <SignalDots className="mt-3" items={DEMO.signals} columns={7} delay={0.65} />
          </Card>

          <Card className="group" delay={0.48}>
            <div className="flex items-center justify-between gap-2">
              <IconBubble>
                <BarChart3 className="size-4" />
              </IconBubble>
              <Chip tone="accent">{DEMO.scoreLabel}</Chip>
            </div>
            <MiniBars
              className="mt-3"
              height={56}
              items={DEMO.pillars.map((p) => ({
                label: p.label,
                value: p.pct,
                color: p.color,
              }))}
              delay={0.6}
            />
            <p className="mt-2 text-[0.625rem] text-[#a3a3a3]">Cobertura por pilar</p>
          </Card>
        </div>

        <Card className="group" delay={0.56}>
          <div className="flex items-start justify-between gap-3">
            <IconBubble>
              <Activity className="size-4" />
            </IconBubble>
            <p className="text-[1.125rem] font-bold leading-none tracking-tight text-[#131313]">
              <Counter value={DEMO.totalAchieved} delay={0.7} />
              <span className="text-xs font-semibold text-[#c9c9c9]">
                {" "}
                / {DEMO.totalPossible} pt
              </span>
            </p>
          </div>
          <Sparkline
            className="mt-1"
            height={64}
            points={DEMO.pillars.map((p) => ({ label: p.label, value: p.pct }))}
            delay={0.7}
          />
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-[0.8125rem] font-semibold text-[#131313]">Madurez por pilar</p>
              <p className="text-[0.625rem] text-[#a3a3a3]">Cobertura real de cada dimensión</p>
            </div>
            <Chip tone="accent">+{DEMO.recoverablePct}%</Chip>
          </div>
        </Card>
      </div>

      {/* Anillos */}
      <Card className="group md:col-span-2 xl:col-span-3" delay={0.64}>
        <CardHead title="Puntaje por pilar" right={<StaticPill label="Actual" />} />
        <ConcentricRings items={RINGS} height={200} delay={0.8} />
      </Card>

      {/* Hallazgos (versión reducida del gestor) */}
      <Card className="group md:col-span-2 xl:col-span-5" delay={0.72}>
        <CardHead
          title="Gestor de hallazgos"
          subtitle="Priorizados por impacto en el puntaje"
          right={<Chip tone="dark">{DEMO.findings.length}</Chip>}
        />
        <div className="mt-3 flex flex-wrap gap-1.5">
          <Chip tone="fail">{DEMO.statusCounts.fail} críticas</Chip>
          <Chip tone="warn">{DEMO.statusCounts.warn} alertas</Chip>
          <Chip tone="ok">{DEMO.statusCounts.ok} conformes</Chip>
        </div>
        <ul className="mt-4 space-y-2">
          {DEMO.findings.map((f) => (
            <li
              key={f.title}
              className="flex items-center gap-2.5 rounded-2xl bg-[#f7f7f7] px-3 py-2.5 transition-transform duration-200 hover:translate-x-1"
            >
              <StatusDot status={f.status} />
              <span className="min-w-0 flex-1 truncate text-[0.75rem] font-medium text-[#4a4a4a]">
                {f.title}
              </span>
              <span className="shrink-0 text-[0.6875rem] font-semibold tabular-nums text-[#b0b0b0]">
                {f.weight} pt
              </span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Pilares top */}
      <Card className="group md:col-span-2 xl:col-span-4" delay={0.8}>
        <CardHead title="Pilares medidos" subtitle="Top 3 por cobertura" />
        <ul className="mt-4 space-y-2.5">
          {topPillars.map((p) => (
            <li
              key={p.label}
              className="flex items-center gap-2.5 text-[0.8125rem] text-[#5c5c5c] transition-transform duration-200 hover:translate-x-1"
            >
              <span
                className="flex size-7 shrink-0 items-center justify-center rounded-full text-[0.625rem] font-bold text-white"
                style={{ backgroundColor: p.color }}
              >
                {p.pct}
              </span>
              <span className="min-w-0 flex-1 truncate font-medium">{p.label}</span>
              <span className="shrink-0 tabular-nums text-[#b0b0b0]">
                {p.score}/{p.max}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-4 rounded-[1.125rem] bg-[#fdeeeb] p-3.5">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-full bg-[#ee5b45] text-white">
              <Layers className="size-3.5" />
            </span>
            <p className="text-[0.75rem] font-semibold text-[#131313]">Quick win de la semana</p>
          </div>
          <p className="mt-2 text-[0.6875rem] leading-relaxed text-[#a5665a]">
            Activar un formulario de captación en el sitio para dejar de depender solo de WhatsApp.
          </p>
        </div>
      </Card>
    </div>
  );
}

export function ReportPreviewSection() {
  /** Si el usuario llega con #reporte (CTA “Ver un ejemplo”), hace scroll al preview */
  useEffect(() => {
    if (window.location.hash !== "#reporte") return;
    const el = document.getElementById("reporte");
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <LpSection id="reporte" className="scroll-mt-6">
      <SectionTitle
        badge="El reporte"
        badgeTone="coral"
        title="Así se ve tu diagnóstico"
        accent="cuando termina de armarse"
        subtitle="Misma interfaz del informe real: puntaje, pilares, señales y hallazgos. Esta es una muestra con datos de ejemplo."
      />

      <Reveal delay={0.08}>
        <div className="mt-10 rounded-[clamp(1.25rem,2.4vw,2rem)] bg-[#e8e8e8] p-2 sm:p-3">
          <div className="rp-shell-shadow overflow-hidden rounded-[clamp(1rem,2vw,1.5rem)]">
            <MountOnView minHeight="640px">
              <PreviewShell>
                <PreviewDashboard />
              </PreviewShell>
            </MountOnView>
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.16}>
        <div className="mt-7 flex flex-col items-center gap-3">
          <LpButton
            href="/diagnostico"
            variant="dark"
            size="lg"
            icon={<ArrowRight className="size-4" />}
          >
            Generar mi reporte
          </LpButton>
          <p className="max-w-md text-center text-[0.75rem] text-[#b6b6c0]">
            El reporte real añade matriz de señales completa, sistemas recomendados y exportación a
            PDF.
          </p>
        </div>
      </Reveal>
    </LpSection>
  );
}
