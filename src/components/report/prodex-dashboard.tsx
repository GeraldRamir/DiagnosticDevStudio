"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Bell, ChevronDown, Menu, Search, X } from "lucide-react";
import { toast } from "sonner";
import { DashboardSidebar, VIEW_TITLES } from "@/components/report/dashboard-sidebar";
import { DashboardHomeView } from "@/components/report/views/dashboard-home-view";
import { HelpView } from "@/components/report/views/help-view";
import { PillarsView } from "@/components/report/views/pillars-view";
import { ReportNarrativeView } from "@/components/report/views/report-narrative-view";
import { SettingsView } from "@/components/report/views/settings-view";
import { SignalsView } from "@/components/report/views/signals-view";
import { SoftwareView } from "@/components/report/views/software-view";
import type { ReportViewId, ReportViewModel } from "@/lib/report-view-model";
import { cn } from "@/lib/utils";

type ProdexDashboardProps = {
  report: ReportViewModel;
};

export function ProdexDashboard({ report }: ProdexDashboardProps) {
  const { dashboard, meta, pillars, signals, narrative, hours, scores } = report;
  const [activeView, setActiveView] = useState<ReportViewId>("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  const initials = dashboard.businessName.slice(0, 2).toUpperCase();
  const subtitle = `${dashboard.industry} · ${dashboard.scoreLabel} · Ref. ${meta.slug} · ${meta.createdAt}`;
  const isDashboard = activeView === "dashboard";

  const handleExportPdf = useCallback(() => {
    toast.info("Generando PDF…");
    window.open(`/api/reporte/${meta.slug}/pdf`, "_blank", "noopener,noreferrer");
  }, [meta.slug]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchRef.current?.focus();
        if (activeView !== "signals") setActiveView("signals");
      }
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeView]);

  const renderView = () => {
    switch (activeView) {
      case "dashboard":
        return (
          <DashboardHomeView
            data={dashboard}
            subtitle={subtitle}
            onViewActivity={() => setActiveView("report")}
            onViewSignals={() => setActiveView("signals")}
          />
        );
      case "pillars":
        return (
          <PillarsView
            pillars={pillars}
            hours={hours}
            globalScore={scores.globalScore}
          />
        );
      case "signals":
        return <SignalsView signals={signals} query={searchQuery} />;
      case "report":
        return (
          <ReportNarrativeView
            narrative={narrative}
            meta={meta}
            globalScore={scores.globalScore}
            scoreLabel={scores.scoreLabel}
          />
        );
      case "software":
        return <SoftwareView narrative={narrative} industry={meta.industry} />;
      case "settings":
        return <SettingsView meta={meta} onExportPdf={handleExportPdf} />;
      case "help":
        return <HelpView />;
      default:
        return null;
    }
  };

  return (
    <div
      className={cn(
        "flex min-h-screen",
        isDashboard ? "bg-[#f3f4f8] text-[#111827]" : "bg-[#f4f5f7] text-[#0f172a]",
      )}
    >
      {mobileOpen ? (
        <button
          type="button"
          aria-label="Cerrar menú"
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}

      <DashboardSidebar
        businessName={dashboard.businessName}
        headline={narrative.quickWin}
        activeView={activeView}
        onNavigate={setActiveView}
        onExportPdf={handleExportPdf}
        mobile={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <header
          className={cn(
            "flex flex-wrap items-center justify-between gap-4 border-b bg-white px-5 py-4 lg:px-8",
            isDashboard ? "border-[#e8ebf0]" : "border-[#d1d5db]",
          )}
        >
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Abrir menú"
              className={cn(
                "flex size-10 items-center justify-center lg:hidden",
                isDashboard
                  ? "rounded-full border border-[#e8ebf0]"
                  : "rounded border border-[#d1d5db] bg-[#f9fafb]",
              )}
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="size-4 text-[#64748b]" />
            </button>
            <div>
              {!isDashboard ? (
                <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-[#6b7280]">
                  {dashboard.businessName}
                </p>
              ) : null}
              <h1
                className={cn(
                  "font-semibold tracking-tight",
                  isDashboard ? "text-2xl" : "text-xl text-[#0f172a]",
                )}
              >
                {VIEW_TITLES[activeView]}
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className={cn(
                "relative flex size-10 items-center justify-center bg-white",
                isDashboard
                  ? "rounded-full border border-[#e8ebf0]"
                  : "rounded border border-[#d1d5db]",
              )}
              onClick={() => setActiveView("report")}
              aria-label="Ver hallazgos"
            >
              <Bell className="size-4 text-[#64748b]" />
              {narrative.findings.length > 0 ? (
                <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-[#991b1b] text-[0.5625rem] font-bold text-white">
                  {Math.min(narrative.findings.length, 9)}
                </span>
              ) : null}
            </button>

            <label
              className={cn(
                "flex h-10 min-w-[200px] items-center gap-2 px-4 text-sm md:min-w-[240px]",
                isDashboard
                  ? "rounded-full border border-[#e8ebf0] bg-[#f8fafc] text-[#64748b]"
                  : "rounded border border-[#d1d5db] bg-white text-[#6b7280]",
              )}
            >
              <Search className="size-4 shrink-0" />
              <input
                ref={searchRef}
                type="search"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value && activeView !== "signals") setActiveView("signals");
                }}
                onFocus={() => {
                  if (activeView !== "signals") setActiveView("signals");
                }}
                placeholder="Buscar señales…"
                className="min-w-0 flex-1 bg-transparent text-[#111827] placeholder:text-[#94a3b8] outline-none"
              />
              {searchQuery ? (
                <button
                  type="button"
                  aria-label="Limpiar búsqueda"
                  onClick={() => setSearchQuery("")}
                  className="shrink-0"
                >
                  <X className="size-3.5 text-[#94a3b8]" />
                </button>
              ) : (
                <span className="hidden shrink-0 rounded border border-[#e5e7eb] bg-[#f9fafb] px-1.5 py-0.5 text-[0.625rem] font-medium text-[#9ca3af] sm:inline">
                  ⌘ K
                </span>
              )}
            </label>

            <button
              type="button"
              className={cn(
                "flex items-center gap-2 bg-white py-1.5 pl-1.5 pr-3",
                isDashboard
                  ? "rounded-full border border-[#e8ebf0]"
                  : "rounded border border-[#d1d5db]",
              )}
              onClick={() => setActiveView("settings")}
            >
              <span
                className={cn(
                  "flex size-8 items-center justify-center text-xs font-semibold text-white",
                  isDashboard ? "rounded-full bg-[#111827]" : "rounded bg-[#1e3a5f]",
                )}
              >
                {initials}
              </span>
              <span className="hidden max-w-[120px] truncate text-sm font-medium sm:block">
                {dashboard.businessName}
              </span>
              <ChevronDown className="size-4 text-[#94a3b8]" />
            </button>
          </div>
        </header>

        <main className={cn("flex-1", isDashboard ? "p-5 lg:p-8" : "p-5 lg:p-6")}>
          {renderView()}
        </main>
      </div>
    </div>
  );
}
