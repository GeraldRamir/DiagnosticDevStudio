"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Clock,
  Download,
  Layers,
  Maximize2,
  MoreHorizontal,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Target,
  X,
} from "lucide-react";
import {
  Card,
  CardHead,
  Chip,
  CircleButton,
  ConcentricRings,
  Counter,
  GaugeRing,
  MiniBars,
  PillButton,
  SignalDots,
  Sparkline,
  StaticPill,
} from "@/components/report/report-ui";
import type { DashboardData } from "@/lib/report-dashboard";
import type { ReportViewId } from "@/lib/report-view-model";
import { cn } from "@/lib/utils";

type DashboardHomeViewProps = {
  data: DashboardData;
  slug: string;
  analysisStatus: string;
  onNavigate: (view: ReportViewId) => void;
  onExportPdf: () => void;
  onCopyLink: () => void;
};

const STATUS_COPY: Record<string, string> = {
  completo: "Análisis completo",
  parcial: "Análisis parcial",
  fallback: "Análisis base",
};

function IconBubble({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#f4f4f4] text-[#5c5c5c] transition-colors duration-300 group-hover:bg-[#fdeeeb] group-hover:text-[#ee5b45]">
      {children}
    </span>
  );
}

function AccentLink({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group/link inline-flex items-center gap-1.5 text-xs font-semibold text-[#ee5b45] transition-opacity hover:opacity-80"
    >
      <span className="flex size-5 items-center justify-center rounded-full bg-[#fdeeeb] transition-transform duration-300 group-hover/link:scale-110 group-hover/link:rotate-45">
        <ArrowUpRight className="size-3" />
      </span>
      {label}
    </button>
  );
}

function CountChip({
  label,
  count,
  color,
  onClick,
}: {
  label: string;
  count: number;
  color: string;
  onClick: () => void;
}) {
  const reduce = useReducedMotion() ?? false;

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={reduce ? undefined : { y: -2 }}
      whileTap={reduce ? undefined : { scale: 0.96 }}
      transition={{ type: "spring", stiffness: 420, damping: 24 }}
      className="inline-flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-[#ececec] bg-white px-3 text-xs font-semibold text-[#5c5c5c] transition-colors hover:border-[#f6c3ba] hover:text-[#131313]"
    >
      <span className="size-1.5 rounded-full" style={{ backgroundColor: color }} />
      {label}
      <span className="text-[#b0b0b0]">{count}</span>
    </motion.button>
  );
}

const FACE_PATHS = [
  "M4 12 Q10 6 16 12",
  "M4 11 Q10 8 16 11",
  "M4 10 L16 10",
  "M4 9 Q10 12 16 9",
  "M4 8 Q10 14 16 8",
];

function FaceScale() {
  const [picked, setPicked] = useState<number | null>(null);
  const reduce = useReducedMotion() ?? false;

  return (
    <div>
      <div className="flex items-center justify-between gap-1.5">
        {FACE_PATHS.map((d, i) => (
          <motion.button
            key={i}
            type="button"
            onClick={() => setPicked(i)}
            aria-label={`Valoración ${i + 1} de 5`}
            whileHover={reduce ? undefined : { scale: 1.14, y: -3 }}
            whileTap={reduce ? undefined : { scale: 0.92 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className={cn(
              "flex size-10 items-center justify-center rounded-full border transition-colors",
              picked === i
                ? "border-transparent bg-[#ee5b45] text-white"
                : "border-[#ececec] bg-white text-[#8a8a8a] hover:border-[#f6c3ba] hover:text-[#ee5b45]",
            )}
          >
            <svg viewBox="0 0 20 20" className="size-5" fill="none" aria-hidden>
              <path d={d} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </motion.button>
        ))}
      </div>
      <p className="mt-3 h-4 text-[0.6875rem] text-[#a3a3a3]">
        {picked === null ? "Selecciona una opción" : "Gracias por tu respuesta"}
      </p>
    </div>
  );
}

export function DashboardHomeView({
  data,
  slug,
  analysisStatus,
  onNavigate,
  onExportPdf,
  onCopyLink,
}: DashboardHomeViewProps) {
  const [feedbackOpen, setFeedbackOpen] = useState(true);
  const statusCopy = STATUS_COPY[analysisStatus] ?? "Análisis registrado";
  const topPillars = data.pillarMeters.slice(0, 3);

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-12">
      {/* ── Perfil del informe ── */}
      <Card className="group flex flex-col justify-between md:col-span-2 xl:col-span-3" delay={0}>
        <div>
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#131313]">
              DevStudio
            </p>
            <StaticPill label="Diagnóstico" />
          </div>

          <p className="mt-7 text-xs text-[#b0b0b0]">Informe emitido para {data.industry}</p>
          <p className="mt-1 font-mono text-sm tracking-[0.2em] text-[#5c5c5c]">
            •••• {slug.slice(-4).toUpperCase()}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <PillButton variant="dark" onClick={() => onNavigate("report")}>
              Hallazgos
            </PillButton>
            <PillButton variant="light" onClick={onCopyLink}>
              Compartir
            </PillButton>
          </div>
        </div>

        <div className="mt-6 flex items-end justify-between gap-3 border-t border-[#f3f3f3] pt-4">
          <div>
            <p className="text-xs text-[#b0b0b0]">Carga administrativa</p>
            <p className="mt-0.5 text-lg font-bold leading-none text-[#131313]">
              <Counter value={data.hoursMonth} delay={0.3} /> h
              <span className="text-sm font-semibold text-[#c9c9c9]">/mes</span>
            </p>
          </div>
          <AccentLink label="Ver pilares" onClick={() => onNavigate("pillars")} />
        </div>
      </Card>

      {/* ── Puntaje y horas ── */}
      <div className="grid gap-3 md:col-span-2 xl:col-span-3">
        <Card className="group" delay={0.08}>
          <div className="flex items-center justify-between gap-3">
            <IconBubble>
              <Target className="size-4" />
            </IconBubble>
            <StaticPill label="Global" />
          </div>
          <div className="mt-5">
            <p className="text-xs text-[#b0b0b0]">Puntaje global</p>
            <p className="mt-1 text-[1.75rem] font-bold leading-none tracking-tight text-[#131313]">
              <Counter value={data.globalScore} delay={0.35} />
              <span className="text-lg font-semibold text-[#c9c9c9]">/100</span>
            </p>
          </div>
        </Card>

        <Card className="group" delay={0.16}>
          <div className="flex items-center justify-between gap-3">
            <IconBubble>
              <Clock className="size-4" />
            </IconBubble>
            <StaticPill label="Mensual" />
          </div>
          <div className="mt-5 flex items-end justify-between gap-3">
            <div>
              <p className="text-xs text-[#b0b0b0]">Horas recuperables</p>
              <p className="mt-1 text-[1.75rem] font-bold leading-none tracking-tight text-[#131313]">
                <Counter value={data.hoursRecoverable} delay={0.45} />
                <span className="text-lg font-semibold text-[#c9c9c9]"> h</span>
              </p>
            </div>
            <AccentLink label="Ver sistemas" onClick={() => onNavigate("software")} />
          </div>
        </Card>
      </div>

      {/* ── Estado + índice ── */}
      <div className="grid gap-3 md:col-span-1 xl:col-span-2">
        <Card className="group flex flex-col items-center justify-center gap-3 py-6 text-center" delay={0.24}>
          <span className="flex size-11 items-center justify-center rounded-full bg-[#101010] text-white transition-colors duration-300 group-hover:bg-[#ee5b45]">
            <ShieldCheck className="size-5" />
          </span>
          <p className="text-sm font-semibold leading-tight text-[#131313]">{statusCopy}</p>
        </Card>

        <Card tone="dark" className="flex items-center justify-center py-6" delay={0.32}>
          <GaugeRing value={data.globalScore} caption={data.scoreLabel} delay={0.55} />
        </Card>
      </div>

      {/* ── Tiempo, pilares y tendencia ── */}
      <div className="grid gap-3 md:col-span-1 xl:col-span-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <Card className="group" delay={0.4}>
            <IconBubble>
              <Clock className="size-4" />
            </IconBubble>
            <p className="mt-3 text-[1.375rem] font-bold leading-none tracking-tight text-[#131313]">
              <Counter value={data.hoursMonth} delay={0.6} /> h
            </p>
            <p className="mt-1 text-[0.6875rem] text-[#a3a3a3]">
              {data.signalsTotal} señales · pasa el mouse por cada punto
            </p>
            <SignalDots className="mt-4" items={data.signalDots} columns={10} delay={0.65} />
          </Card>

          <Card className="group" delay={0.48}>
            <div className="flex items-center justify-between gap-2">
              <IconBubble>
                <BarChart3 className="size-4" />
              </IconBubble>
              <Chip tone="accent">{data.scoreLabel}</Chip>
            </div>
            <MiniBars className="mt-4" items={data.pillarBarItems} delay={0.6} />
            <p className="mt-2 text-[0.6875rem] text-[#a3a3a3]">Cobertura por pilar</p>
          </Card>
        </div>

        <Card className="group" delay={0.56}>
          <div className="flex items-start justify-between gap-3">
            <IconBubble>
              <Activity className="size-4" />
            </IconBubble>
            <p className="text-[1.25rem] font-bold leading-none tracking-tight text-[#131313]">
              <Counter value={data.totalAchieved} delay={0.7} />
              <span className="text-sm font-semibold text-[#c9c9c9]"> / {data.totalPossible} pt</span>
            </p>
          </div>
          <Sparkline points={data.pillarPoints} className="mt-1" delay={0.7} />
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-[#131313]">Madurez por pilar</p>
              <p className="text-[0.6875rem] text-[#a3a3a3]">Cobertura real de cada dimensión</p>
            </div>
            <Chip tone="accent">+{data.recoverablePct}%</Chip>
          </div>
        </Card>
      </div>

      {/* ── Distribución por pilar ── */}
      <Card className="group md:col-span-2 xl:col-span-3" delay={0.64}>
        <CardHead title="Puntaje por pilar" right={<StaticPill label="Actual" />} />
        <ConcentricRings items={data.rings} delay={0.8} />
      </Card>

      {/* ── Gestor de hallazgos ── */}
      <Card className="group md:col-span-2 xl:col-span-6" delay={0.72}>
        <CardHead
          title="Gestor de hallazgos"
          right={
            <div className="flex items-center gap-1">
              <CircleButton
                label="Ver todos los hallazgos"
                variant="ghost"
                size="sm"
                onClick={() => onNavigate("report")}
              >
                <MoreHorizontal className="size-4" />
              </CircleButton>
              <CircleButton
                label="Abrir matriz de señales"
                variant="ghost"
                size="sm"
                onClick={() => onNavigate("signals")}
              >
                <Maximize2 className="size-3.5" />
              </CircleButton>
              <CircleButton
                label="Filtrar señales"
                variant="ghost"
                size="sm"
                onClick={() => onNavigate("signals")}
              >
                <SlidersHorizontal className="size-3.5" />
              </CircleButton>
            </div>
          }
        />

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <motion.button
            type="button"
            onClick={() => onNavigate("signals")}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 420, damping: 24 }}
            className="inline-flex h-8 min-w-0 flex-1 items-center gap-2 rounded-full border border-[#ececec] bg-white px-3 text-xs text-[#b0b0b0] transition-colors hover:border-[#f6c3ba] hover:text-[#5c5c5c] sm:flex-none sm:basis-44"
          >
            <Search className="size-3.5 shrink-0" />
            Buscar en señales…
          </motion.button>
          <CountChip
            label="Críticas"
            count={data.statusCounts.fail}
            color="#ee5b45"
            onClick={() => onNavigate("signals")}
          />
          <CountChip
            label="Alertas"
            count={data.statusCounts.warn}
            color="#dd9a2b"
            onClick={() => onNavigate("signals")}
          />
          <CountChip
            label="Conformes"
            count={data.statusCounts.ok}
            color="#1f9d6b"
            onClick={() => onNavigate("signals")}
          />
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="group/sub rounded-[1.125rem] bg-[#f7f7f7] p-4 transition-colors hover:bg-[#f2f2f2]">
            <p className="text-[1.5rem] font-bold leading-none tracking-tight text-[#131313]">
              <Counter value={data.signalsTotal} delay={0.9} />
              <span className="ml-1 text-xs font-semibold text-[#b0b0b0]">señales</span>
            </p>
            <p className="mt-1 text-[0.6875rem] text-[#a3a3a3]">Mediciones verificables</p>
            <MiniBars
              className="mt-4"
              grid={false}
              height={48}
              items={data.pillarBarItems}
              delay={0.95}
            />
          </div>

          <div className="rounded-[1.125rem] bg-[#f7f7f7] p-4 transition-colors hover:bg-[#f2f2f2]">
            <p className="text-xs font-semibold text-[#131313]">Pilares medidos</p>
            <ul className="mt-3 space-y-2.5">
              {topPillars.map((p) => (
                <li
                  key={p.id}
                  title={`${p.label}: ${p.score} de ${p.max} pt`}
                  className="flex cursor-help items-center gap-2 text-xs text-[#5c5c5c] transition-transform duration-200 hover:translate-x-1"
                >
                  <span
                    className="flex size-5 shrink-0 items-center justify-center rounded-full text-[0.5625rem] font-bold text-white"
                    style={{ backgroundColor: p.color }}
                  >
                    {p.pct}
                  </span>
                  <span className="truncate">{p.label}</span>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => onNavigate("pillars")}
              className="group/more mt-3 inline-flex items-center gap-1 text-[0.6875rem] font-semibold text-[#ee5b45]"
            >
              Ver desglose
              <ArrowRight className="size-3 transition-transform duration-300 group-hover/more:translate-x-1" />
            </button>
          </div>

          <div className="flex flex-col justify-between rounded-[1.125rem] bg-[#fdeeeb] p-4">
            <div>
              <span className="flex size-8 items-center justify-center rounded-full bg-[#ee5b45] text-white">
                <Layers className="size-4" />
              </span>
              <p className="mt-3 text-xs font-semibold text-[#131313]">Informe completo</p>
              <p className="mt-1 text-[0.6875rem] leading-relaxed text-[#a5665a]">
                Descarga el diagnóstico con hallazgos y sistemas recomendados.
              </p>
            </div>
            <motion.button
              type="button"
              onClick={onExportPdf}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 420, damping: 24 }}
              className="group/dl relative mt-3 inline-flex h-9 items-center justify-center gap-1.5 overflow-hidden rounded-full bg-[#ee5b45] px-4 text-xs font-semibold text-white transition-colors hover:bg-[#d9452f]"
            >
              <Download className="size-3.5 transition-transform duration-300 group-hover/dl:translate-y-0.5" />
              Descargar
            </motion.button>
          </div>
        </div>
      </Card>

      {/* ── Percepción del negocio ── */}
      {feedbackOpen ? (
        <Card
          className="flex flex-col justify-between gap-5 md:col-span-2 xl:col-span-3"
          delay={0.8}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-1" aria-hidden>
              <span className="h-1.5 w-1.5 rounded-full bg-[#e0e0e0]" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#e0e0e0]" />
              <span className="h-1.5 w-5 rounded-full bg-[#101010]" />
            </div>
            <CircleButton
              label="Ocultar valoración"
              variant="ghost"
              size="sm"
              onClick={() => setFeedbackOpen(false)}
            >
              <X className="size-3.5" />
            </CircleButton>
          </div>

          <div>
            <p className="text-xs text-[#b0b0b0]">Percepción del negocio</p>
            <p className="mt-1 text-lg font-bold leading-snug tracking-tight text-[#131313]">
              ¿Cómo va tu gestión digital?
            </p>
          </div>

          <FaceScale />
        </Card>
      ) : (
        <Card className="flex items-center justify-center md:col-span-2 xl:col-span-3" delay={0}>
          <button
            type="button"
            onClick={() => setFeedbackOpen(true)}
            className="text-xs font-semibold text-[#ee5b45] hover:underline"
          >
            Mostrar valoración
          </button>
        </Card>
      )}
    </div>
  );
}
