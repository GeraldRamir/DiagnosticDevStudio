"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Menu,
} from "lucide-react";
import type { ReactNode } from "react";
import { copy } from "@/lib/copy";
import { cn } from "@/lib/utils";

const LOGO_SRC = "/DevStudio-Content/Logo-Black.png";

type MegaFeaturedProps = {
  label: string;
  title: string;
  desc: string;
  cta: string;
  href: string;
};

function MegaFeatured({ label, title, desc, cta, href }: MegaFeaturedProps) {
  return (
    <div className="flex flex-col justify-between bg-gradient-to-br from-[#fef3f2] via-[#fdf4ff] to-[#fff7ed] p-6">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#fb923c]">
          {label}
        </p>
        <h3 className="mt-2 font-display text-xl font-extrabold leading-tight text-[color:var(--landing-text)]">
          {title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-[color:var(--landing-muted)]">
          {desc}
        </p>
      </div>
      <Link
        href={href}
        className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#a855f7] hover:underline"
      >
        {cta}
        <ChevronRight className="size-4" />
      </Link>
    </div>
  );
}

type MegaLinkItem = {
  title: string;
  subtitle: string;
  href: string;
};

function MegaLinkList({
  heading,
  items,
}: {
  heading: string;
  items: MegaLinkItem[];
}) {
  return (
    <div className="p-5">
      <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[color:var(--landing-muted)]">
        {heading}
      </p>
      <ul className="space-y-0.5">
        {items.map((item) => (
          <li key={item.title}>
            <Link
              href={item.href}
              className="group/item flex items-center justify-between rounded-xl px-3 py-2.5 transition-colors hover:bg-black/[0.03]"
            >
              <div>
                <p className="text-sm font-semibold text-[color:var(--landing-text)]">
                  {item.title}
                </p>
                <p className="text-xs text-[color:var(--landing-muted)]">
                  {item.subtitle}
                </p>
              </div>
              <ChevronRight className="size-4 shrink-0 text-[color:var(--landing-muted)] opacity-0 transition-opacity group-hover/item:opacity-100" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MegaMenuPanel({ children }: { children: ReactNode }) {
  return (
    <div
      className={cn(
        "invisible absolute left-1/2 top-full z-[70] w-[40rem] max-w-[calc(100vw-2rem)] -translate-x-1/2 pt-3 opacity-0",
        "transition-all duration-200",
        "group-hover:visible group-hover:opacity-100",
        "group-focus-within:visible group-focus-within:opacity-100",
      )}
    >
      <div className="overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-[0_20px_60px_rgba(15,23,42,0.14)]">
        {children}
      </div>
    </div>
  );
}

function MegaMenuRightPanel({ children }: { children: ReactNode }) {
  return (
    <div
      className={cn(
        "invisible absolute right-0 top-full z-[70] w-[40rem] max-w-[calc(100vw-2rem)] pt-3 opacity-0",
        "transition-all duration-200",
        "group-hover:visible group-hover:opacity-100",
        "group-focus-within:visible group-focus-within:opacity-100",
      )}
    >
      <div className="overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-[0_20px_60px_rgba(15,23,42,0.14)]">
        {children}
      </div>
    </div>
  );
}

function NavDropdownTrigger({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium text-[color:var(--landing-muted)] transition-colors group-hover:bg-black/[0.04] group-hover:text-[color:var(--landing-text)]"
      aria-haspopup="true"
    >
      {label}
      <ChevronDown className="size-3.5 opacity-50 transition-transform duration-200 group-hover:rotate-180" />
    </button>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="rounded-full px-3 py-1.5 text-sm font-medium text-[color:var(--landing-muted)] transition-colors hover:bg-black/[0.04] hover:text-[color:var(--landing-text)]"
    >
      {label}
    </Link>
  );
}

export function SiteHeader() {
  const pillars = copy.landing.headerDropdown.pillars;
  const pillarLinks = pillars.map((p) => ({
    title: p.name,
    subtitle: p.desc,
    href: "#que-medimos",
  }));

  const industryLinks = copy.landing.headerDropdown.industries.map((name) => ({
    title: name,
    subtitle: "Diagnóstico adaptado",
    href: "#industrias",
  }));

  const caseLinks = copy.landing.headerDropdown.cases.map((c) => ({
    title: c.title,
    subtitle: c.desc,
    href: "#casos",
  }));

  const moreLinks = copy.landing.headerDropdown.more.map((m) => ({
    title: m.label,
    subtitle: m.href === "#faq" ? "Preguntas frecuentes" : "Política de datos",
    href: m.href,
  }));

  return (
    <header className="sticky top-0 z-50 overflow-visible ds-glass border-b border-white/40">
      <div className="relative mx-auto flex h-14 max-w-7xl items-center justify-between gap-6 overflow-visible px-5 md:px-8 lg:px-10">
        <Link
          href="/"
          className="relative block h-11 w-[10.5rem] shrink-0 sm:h-12 sm:w-[11.75rem]"
        >
          <Image
            src={LOGO_SRC}
            alt="DevStudio"
            fill
            priority
            className="object-contain object-left"
            sizes="188px"
          />
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex">
          <NavLink href="#como-funciona" label={copy.landing.nav.howItWorks} />

          {/* Qué medimos — mega menu */}
          <div className="group relative">
            <NavDropdownTrigger label={copy.landing.nav.whatWeMeasure} />
            <MegaMenuPanel>
              <div className="grid grid-cols-3 divide-x divide-black/[0.06]">
                <MegaFeatured {...copy.landing.headerDropdown.featured.pillars} />
                <MegaLinkList
                  heading={copy.landing.headerDropdown.visitLabel}
                  items={pillarLinks.slice(0, 3)}
                />
                <MegaLinkList
                  heading="Métricas"
                  items={[
                    ...pillarLinks.slice(3),
                    {
                      title: "Puntaje global",
                      subtitle: "0–100 determinístico",
                      href: "#que-medimos",
                    },
                  ]}
                />
              </div>
            </MegaMenuPanel>
          </div>

          {/* Industrias — mega menu */}
          <div className="group relative">
            <NavDropdownTrigger label={copy.landing.nav.industries} />
            <MegaMenuPanel>
              <div className="grid grid-cols-3 divide-x divide-black/[0.06]">
                <MegaFeatured {...copy.landing.headerDropdown.featured.industries} />
                <MegaLinkList
                  heading={copy.landing.headerDropdown.citiesLabel}
                  items={industryLinks.slice(0, 3)}
                />
                <MegaLinkList
                  heading="Más sectores"
                  items={industryLinks.slice(3)}
                />
              </div>
            </MegaMenuPanel>
          </div>

          <NavLink href="#reporte" label={copy.landing.nav.report} />

          {/* Casos de uso — mega menu */}
          <div className="group relative">
            <NavDropdownTrigger label={copy.landing.nav.cases} />
            <MegaMenuPanel>
              <div className="grid grid-cols-3 divide-x divide-black/[0.06]">
                <MegaFeatured {...copy.landing.headerDropdown.featured.cases} />
                <MegaLinkList heading="Patrones" items={caseLinks} />
                <MegaLinkList
                  heading="Resultado"
                  items={copy.landing.headerDropdown.stats.map((s) => ({
                    title: s.value,
                    subtitle: s.label,
                    href: "#reporte",
                  }))}
                />
              </div>
            </MegaMenuPanel>
          </div>

          {/* Más — mega menu alineado a la derecha */}
          <div className="group relative">
            <NavDropdownTrigger label="Más" />
            <MegaMenuRightPanel>
              <div className="grid grid-cols-2 divide-x divide-black/[0.06]">
                <MegaLinkList heading="Recursos" items={moreLinks} />
                <div className="p-5">
                  <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[color:var(--landing-muted)]">
                    Diagnóstico
                  </p>
                  <p className="text-sm leading-relaxed text-[color:var(--landing-muted)]">
                    {copy.landing.headerDropdown.tagline}
                  </p>
                  <Link
                    href="/diagnostico"
                    className="ds-glass-btn mt-4 inline-flex h-9 items-center gap-1.5 px-4 text-xs"
                  >
                    Empezar gratis
                    <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              </div>
            </MegaMenuRightPanel>
          </div>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/diagnostico"
            className="ds-glass-btn hidden h-9 items-center gap-1.5 px-4 text-xs font-semibold uppercase tracking-wide sm:inline-flex"
          >
            Diagnóstico gratis
            <ArrowRight className="size-3.5" />
          </Link>
          <Link
            href="/diagnostico"
            className="ds-glass-btn inline-flex size-9 items-center justify-center sm:hidden"
            aria-label={copy.landing.ctaPrimary}
          >
            <ArrowRight className="size-4" />
          </Link>
          <button
            type="button"
            className="flex size-9 items-center justify-center rounded-full text-[color:var(--landing-muted)] hover:bg-black/[0.04] lg:hidden"
            aria-label="Menú"
          >
            <Menu className="size-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
