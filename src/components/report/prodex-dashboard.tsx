"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ReportShell } from "@/components/report/report-shell";
import { DashboardHomeView } from "@/components/report/views/dashboard-home-view";
import { HelpView } from "@/components/report/views/help-view";
import { PillarsView } from "@/components/report/views/pillars-view";
import { ReportNarrativeView } from "@/components/report/views/report-narrative-view";
import { SettingsView } from "@/components/report/views/settings-view";
import { SignalsView } from "@/components/report/views/signals-view";
import { SoftwareView } from "@/components/report/views/software-view";
import type { ReportViewId, ReportViewModel } from "@/lib/report-view-model";

type ProdexDashboardProps = {
  report: ReportViewModel;
};

export function ProdexDashboard({ report }: ProdexDashboardProps) {
  const {
    dashboard,
    meta,
    pillars,
    signals,
    narrative,
    hours,
    scores,
    instagramSummary,
    websiteSummary,
    channelKpis,
    analysisFocus,
  } = report;
  const [activeView, setActiveView] = useState<ReportViewId>("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [copied, setCopied] = useState(false);
  const [reportUrl, setReportUrl] = useState(`/reporte/${meta.slug}`);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setReportUrl(`${window.location.origin}/reporte/${meta.slug}`);
  }, [meta.slug]);

  const handleExportPdf = useCallback(() => {
    toast.info("Generando PDF…");
    window.open(`/api/reporte/${meta.slug}/pdf`, "_blank", "noopener,noreferrer");
  }, [meta.slug]);

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(reportUrl);
      setCopied(true);
      toast.success("Enlace copiado");
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("No se pudo copiar el enlace");
    }
  }, [reportUrl]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setActiveView("signals");
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    if (value.trim()) setActiveView("signals");
  }, []);

  const firstName = meta.fullName.split(" ")[0] ?? dashboard.businessName;

  const renderView = () => {
    switch (activeView) {
      case "dashboard":
        return (
          <DashboardHomeView
            data={dashboard}
            slug={meta.slug}
            analysisStatus={meta.analysisStatus}
            analysisFocus={analysisFocus}
            focusLabel={meta.focusLabel}
            focusSubtitle={meta.focusSubtitle}
            instagram={instagramSummary}
            website={websiteSummary}
            channelKpis={channelKpis}
            onNavigate={setActiveView}
            onExportPdf={handleExportPdf}
            onCopyLink={handleCopyLink}
          />
        );
      case "pillars":
        return <PillarsView pillars={pillars} hours={hours} globalScore={scores.globalScore} />;
      case "signals":
        return <SignalsView signals={signals} query={searchQuery} />;
      case "report":
        return (
          <ReportNarrativeView
            narrative={narrative}
            meta={meta}
            globalScore={scores.globalScore}
            scoreLabel={scores.scoreLabel}
            onNavigate={setActiveView}
          />
        );
      case "software":
        return <SoftwareView narrative={narrative} industry={meta.industry} />;
      case "settings":
        return (
          <SettingsView
            meta={meta}
            reportUrl={reportUrl}
            copied={copied}
            onExportPdf={handleExportPdf}
            onCopyLink={handleCopyLink}
          />
        );
      case "help":
        return <HelpView />;
      default:
        return null;
    }
  };

  return (
    <ReportShell
      businessName={dashboard.businessName}
      contactName={meta.fullName}
      industry={meta.industry}
      dateDay={meta.createdAtDay}
      dateLabel={meta.createdAtLabel}
      greetingTitle={`Hola, ${firstName} 👋`}
      greetingSubtitle={meta.focusGreeting}
      findingsCount={narrative.findings.length}
      activeView={activeView}
      onNavigate={setActiveView}
      onExportPdf={handleExportPdf}
      onCopyLink={handleCopyLink}
      searchQuery={searchQuery}
      onSearchChange={handleSearchChange}
      searchRef={searchRef}
    >
      {renderView()}
    </ReportShell>
  );
}
