"use client";

import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ChevronDown,
  FileDown,
  HelpCircle,
  LayoutDashboard,
  Layers,
  Package,
  Settings,
  Share2,
  SlidersHorizontal,
} from "lucide-react";
import type { ReportViewId } from "@/lib/report-view-model";
import { VIEW_TITLES } from "@/lib/report-view-model";
import { cn } from "@/lib/utils";

const LOGO_SRC = "/DevStudio-Content/Logo-Black.png";

const MAIN_NAV: { id: ReportViewId; label: string; icon: LucideIcon }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "pillars", label: "Pilares", icon: Package },
  { id: "signals", label: "Señales", icon: SlidersHorizontal },
  { id: "report", label: "Reporte", icon: Share2 },
  { id: "software", label: "Sistemas", icon: Layers },
];

const SETTINGS_NAV: {
  id: ReportViewId | "export-pdf";
  label: string;
  icon: LucideIcon;
  action?: "export-pdf";
}[] = [
  { id: "settings", label: "Exportar PDF", icon: FileDown, action: "export-pdf" },
  { id: "settings", label: "Configuración", icon: Settings },
  { id: "help", label: "Ayuda", icon: HelpCircle },
];

type DashboardSidebarProps = {
  businessName: string;
  headline: string;
  activeView: ReportViewId;
  onNavigate: (view: ReportViewId) => void;
  onExportPdf: () => void;
  mobile?: boolean;
  onCloseMobile?: () => void;
};

export function DashboardSidebar({
  businessName,
  headline,
  activeView,
  onNavigate,
  onExportPdf,
  mobile,
  onCloseMobile,
}: DashboardSidebarProps) {
  const navItem = (id: ReportViewId, label: string, Icon: LucideIcon, onClick?: () => void) => {
    const isActive = activeView === id && !onClick;
    return (
      <button
        key={`${id}-${label}`}
        type="button"
        onClick={() => {
          if (onClick) onClick();
          else onNavigate(id);
          onCloseMobile?.();
        }}
        className={cn(
          "flex w-full items-center gap-3 border-l-2 px-3 py-2.5 text-left text-sm transition-colors",
          isActive
            ? "border-[#1e3a5f] bg-[#f4f5f7] font-semibold text-[#0f172a]"
            : "border-transparent font-medium text-[#6b7280] hover:bg-[#f9fafb] hover:text-[#0f172a]",
        )}
      >
        <Icon className={cn("size-4 shrink-0", isActive ? "text-[#1e3a5f]" : "text-[#9ca3af]")} />
        {label}
      </button>
    );
  };

  return (
    <aside
      className={cn(
        "flex shrink-0 flex-col border-[#d1d5db] bg-white",
        mobile
          ? "fixed inset-y-0 left-0 z-50 w-[260px] border-r shadow-lg"
          : "hidden w-[248px] border-r lg:flex",
      )}
    >
      <div className="border-b border-[#e5e7eb] px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className="relative size-7">
            <Image src={LOGO_SRC} alt="DevStudio" fill className="object-contain" sizes="28px" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#0f172a]">DevStudio</p>
            <p className="text-[0.625rem] uppercase tracking-[0.12em] text-[#9ca3af]">
              Diagnóstico digital
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 py-4">
        <div className="flex w-full items-center justify-between border border-[#d1d5db] bg-[#f9fafb] px-3 py-2.5">
          <span className="truncate text-sm font-medium text-[#0f172a]">{businessName}</span>
          <ChevronDown className="size-4 shrink-0 text-[#9ca3af]" />
        </div>
      </div>

      <p className="px-5 pb-1 text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-[#9ca3af]">
        Navegación
      </p>
      <nav className="space-y-0.5 px-2">{MAIN_NAV.map((item) => navItem(item.id, item.label, item.icon))}</nav>

      <p className="mt-6 px-5 pb-1 text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-[#9ca3af]">
        Informe
      </p>
      <nav className="space-y-0.5 px-2">
        {SETTINGS_NAV.map((item) =>
          item.action === "export-pdf"
            ? navItem("settings", item.label, item.icon, onExportPdf)
            : navItem(item.id as ReportViewId, item.label, item.icon),
        )}
      </nav>

      <div className="mt-auto border-t border-[#e5e7eb] p-4">
        <div className="border border-[#d1d5db] bg-[#f9fafb] p-4">
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-[#6b7280]">
            Acción inmediata
          </p>
          <p className="mt-2 line-clamp-4 text-xs leading-relaxed text-[#374151]">{headline}</p>
          <Link
            href="/diagnostico"
            className="mt-3 inline-flex h-9 w-full items-center justify-center border border-[#0f172a] bg-[#0f172a] text-xs font-semibold text-white hover:bg-[#1e293b]"
          >
            Nuevo diagnóstico
          </Link>
        </div>
      </div>
    </aside>
  );
}

export { VIEW_TITLES };
