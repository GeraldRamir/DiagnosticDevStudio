"use client";

import { useState, type ReactNode, type RefObject } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Bell,
  Download,
  Menu,
  Plus,
  Search,
  Share2,
  X,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { LOGO_SRC } from "@/lib/brand";
import type { ReportViewId } from "@/lib/report-view-model";
import { CircleButton } from "@/components/report/report-ui";
import { cn } from "@/lib/utils";

const TABS: { id: ReportViewId; label: string }[] = [
  { id: "dashboard", label: "Resumen" },
  { id: "pillars", label: "Pilares" },
  { id: "signals", label: "Señales" },
  { id: "report", label: "Hallazgos" },
  { id: "software", label: "Sistemas" },
  { id: "settings", label: "Configuración" },
  { id: "help", label: "Ayuda" },
];

type ReportShellProps = {
  businessName: string;
  contactName: string;
  industry: string;
  dateDay: string;
  dateLabel: string;
  greetingTitle: string;
  greetingSubtitle: string;
  findingsCount: number;
  activeView: ReportViewId;
  onNavigate: (view: ReportViewId) => void;
  onExportPdf: () => void;
  onCopyLink: () => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  searchRef?: RefObject<HTMLInputElement | null>;
  children: ReactNode;
};

export function ReportShell({
  businessName,
  contactName,
  industry,
  dateDay,
  dateLabel,
  greetingTitle,
  greetingSubtitle,
  findingsCount,
  activeView,
  onNavigate,
  onExportPdf,
  onCopyLink,
  searchQuery,
  onSearchChange,
  searchRef,
  children,
}: ReportShellProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const reduce = useReducedMotion() ?? false;
  const initials = businessName.slice(0, 2).toUpperCase();

  const go = (view: ReportViewId) => {
    onNavigate(view);
    setDrawerOpen(false);
  };

  return (
    <div className="rp-font min-h-screen bg-[#e8e8e8] p-2 sm:p-4 lg:p-6">
      <div className="rp-shell-shadow mx-auto w-full max-w-[104rem] overflow-hidden rounded-[1.5rem] bg-[#f5f5f5] sm:rounded-[2rem]">
        {/* ── Banda superior ── */}
        <div className="bg-[#f0f0f0] px-3 pb-5 pt-3 sm:px-6 sm:pt-5">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reduce ? { duration: 0 } : { duration: 0.5 }}
            className="flex flex-wrap items-center justify-between gap-4"
          >
            <div className="flex min-w-0 items-center gap-3">
              <CircleButton
                label="Abrir navegación"
                variant="light"
                onClick={() => setDrawerOpen(true)}
              >
                <Menu className="size-4" />
              </CircleButton>

              <span className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#e4e4e4] bg-white">
                <Image
                  src={LOGO_SRC}
                  alt="DevStudio"
                  width={819}
                  height={1024}
                  className="size-7 object-contain"
                  sizes="28px"
                />
              </span>

              <div className="min-w-0 leading-tight">
                <p className="truncate text-[0.9375rem] font-bold tracking-tight text-[#131313]">
                  Diagnóstico
                </p>
                <p className="truncate text-[0.9375rem] font-light text-[#a3a3a3]">Digital</p>
              </div>
            </div>

            <div className="hidden items-center gap-3 md:flex">
              <Link
                href="/diagnostico"
                aria-label="Nuevo diagnóstico"
                title="Nuevo diagnóstico"
                className="flex size-9 items-center justify-center rounded-full border border-[#ececec] bg-white text-[#4a4a4a] transition-all duration-200 hover:scale-110 hover:border-[#f6c3ba] hover:text-[#ee5b45]"
              >
                <Plus className="size-4" />
              </Link>
              <span className="flex size-10 items-center justify-center rounded-full bg-[#101010] text-xs font-bold text-white">
                {initials}
              </span>
              <div className="leading-tight">
                <p className="text-sm font-semibold text-[#131313]">{contactName}</p>
                <p className="text-xs text-[#a3a3a3]">{industry}</p>
              </div>
            </div>

            <div className="flex min-w-0 flex-1 items-center justify-end gap-2 sm:flex-none">
              <CircleButton label="Buscar señales" variant="light" size="sm">
                <Search className="size-4" />
              </CircleButton>
              <input
                ref={searchRef}
                type="search"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onFocus={() => {
                  if (activeView !== "signals") onNavigate("signals");
                }}
                placeholder="Buscar en el informe…"
                className="h-10 w-full min-w-0 rounded-full bg-transparent px-2 text-sm text-[#131313] outline-none placeholder:text-[#b0b0b0] sm:w-52"
              />
            </div>
          </motion.div>

          {/* ── Fila de acciones + saludo ── */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reduce ? { duration: 0 } : { duration: 0.55, delay: 0.12 }}
            className="mt-5 flex flex-wrap items-center justify-between gap-5"
          >
            <div className="flex items-center gap-3">
              <motion.span
                whileHover={reduce ? undefined : { y: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 26 }}
                className="flex h-14 items-center gap-3 rounded-full border border-[#e4e4e4] bg-white px-4 transition-colors hover:border-[#f6c3ba]"
              >
                <span className="text-xl font-bold leading-none text-[#131313]">{dateDay}</span>
                <span className="max-w-[86px] text-[0.6875rem] font-medium capitalize leading-tight text-[#9a9a9a]">
                  {dateLabel}
                </span>
              </motion.span>

              <motion.button
                type="button"
                onClick={() => onNavigate("report")}
                whileHover={reduce ? undefined : { y: -2 }}
                whileTap={reduce ? undefined : { scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 26 }}
                className="group relative inline-flex h-12 items-center gap-2 overflow-hidden rounded-full bg-[#ee5b45] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#d9452f]"
              >
                <span className="rp-shine" aria-hidden />
                Ver hallazgos
                <span className="flex size-6 items-center justify-center rounded-full bg-white/20 transition-transform duration-300 group-hover:translate-x-1">
                  <ArrowRight className="size-3.5" />
                </span>
              </motion.button>

              <CircleButton
                label="Hallazgos pendientes"
                variant="light"
                size="md"
                dot={findingsCount > 0}
                onClick={() => onNavigate("report")}
              >
                <Bell className="size-4" />
              </CircleButton>
            </div>

            <div className="flex min-w-0 items-center gap-4">
              <div className="min-w-0 text-left sm:text-right">
                <p className="truncate text-[1.375rem] font-bold leading-tight tracking-tight text-[#131313] sm:text-[1.75rem]">
                  {greetingTitle}
                </p>
                <p className="truncate text-[1.375rem] font-light leading-tight text-[#b0b0b0] sm:text-[1.75rem]">
                  {greetingSubtitle}
                </p>
              </div>
              <CircleButton
                label="Descargar informe en PDF"
                variant="light"
                size="lg"
                onClick={onExportPdf}
              >
                <Download className="size-5" />
              </CircleButton>
            </div>
          </motion.div>
        </div>

        {/* ── Área de contenido ── */}
        <div className="flex gap-3 px-3 pb-4 pt-4 sm:px-5 sm:pb-6">
          <div className="hidden shrink-0 flex-col items-center gap-2 self-start rounded-full border border-[#ececec] bg-white p-2 lg:flex">
            <Link
              href="/diagnostico"
              aria-label="Nuevo diagnóstico"
              title="Nuevo diagnóstico"
              className="flex size-9 items-center justify-center rounded-full bg-[#eeeeee] text-[#4a4a4a] transition-all duration-200 hover:scale-110 hover:bg-[#fdeeeb] hover:text-[#ee5b45]"
            >
              <Plus className="size-4" />
            </Link>
            <CircleButton label="Copiar enlace" variant="ghost" size="sm" onClick={onCopyLink}>
              <Share2 className="size-4" />
            </CircleButton>
          </div>

          <div className="min-w-0 flex-1">
            <nav className="rp-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-3">
              {TABS.map((tab, i) => {
                const isActive = activeView === tab.id;
                return (
                  <motion.button
                    key={tab.id}
                    type="button"
                    onClick={() => onNavigate(tab.id)}
                    initial={reduce ? false : { opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={reduce ? { duration: 0 } : { duration: 0.4, delay: i * 0.05 }}
                    whileHover={reduce ? undefined : { y: -2 }}
                    whileTap={reduce ? undefined : { scale: 0.96 }}
                    className={cn(
                      "relative inline-flex h-9 shrink-0 items-center rounded-full px-4 text-xs font-semibold transition-colors",
                      isActive
                        ? "text-white"
                        : "border border-[#ececec] bg-white text-[#6b6b6b] hover:border-[#f6c3ba] hover:text-[#d9452f]",
                    )}
                  >
                    {isActive ? (
                      <motion.span
                        layoutId="rp-tab-indicator"
                        className="absolute inset-0 rounded-full bg-[#101010]"
                        transition={
                          reduce
                            ? { duration: 0 }
                            : { type: "spring", stiffness: 420, damping: 34 }
                        }
                      />
                    ) : null}
                    <span className="relative z-10">{tab.label}</span>
                  </motion.button>
                );
              })}
            </nav>

            <div className="min-w-0">{children}</div>
          </div>
        </div>
      </div>

      {/* ── Panel de navegación ── */}
      {drawerOpen ? (
        <>
          <button
            type="button"
            aria-label="Cerrar navegación"
            className="fixed inset-0 z-40 bg-black/35"
            onClick={() => setDrawerOpen(false)}
          />
          <aside className="rp-font fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Image
                  src={LOGO_SRC}
                  alt="DevStudio"
                  width={819}
                  height={1024}
                  className="size-8 object-contain"
                  sizes="32px"
                />
                <div className="leading-tight">
                  <p className="text-sm font-bold text-[#131313]">{businessName}</p>
                  <p className="text-xs text-[#a3a3a3]">{industry}</p>
                </div>
              </div>
              <CircleButton
                label="Cerrar"
                variant="ghost"
                size="sm"
                onClick={() => setDrawerOpen(false)}
              >
                <X className="size-4" />
              </CircleButton>
            </div>

            <nav className="mt-6 space-y-1">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => go(tab.id)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-full px-4 py-2.5 text-left text-sm font-semibold transition-all duration-200",
                    activeView === tab.id
                      ? "bg-[#101010] text-white"
                      : "text-[#5c5c5c] hover:translate-x-1 hover:bg-[#fdeeeb] hover:text-[#d9452f]",
                  )}
                >
                  {tab.label}
                  {activeView === tab.id ? <ArrowRight className="size-4" /> : null}
                </button>
              ))}
            </nav>

            <div className="mt-auto space-y-2 pt-6">
              <button
                type="button"
                onClick={() => {
                  onExportPdf();
                  setDrawerOpen(false);
                }}
                className="group relative flex h-11 w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-[#ee5b45] text-sm font-semibold text-white transition-colors hover:bg-[#d9452f]"
              >
                <span className="rp-shine" aria-hidden />
                <Download className="size-4" />
                Descargar PDF
              </button>
              <Link
                href="/diagnostico"
                className="flex h-11 w-full items-center justify-center gap-2 rounded-full border border-[#ececec] text-sm font-semibold text-[#131313] transition-colors hover:border-[#f6c3ba] hover:text-[#d9452f]"
              >
                <Plus className="size-4" />
                Nuevo diagnóstico
              </Link>
            </div>
          </aside>
        </>
      ) : null}
    </div>
  );
}
