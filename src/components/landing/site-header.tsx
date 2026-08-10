"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { LpButton } from "@/components/landing/lp-ui";
import { LOGO_SRC } from "@/lib/brand";
import { lp } from "@/lib/landing-copy";
import { cn } from "@/lib/utils";

type MenuItem = {
  title: string;
  desc: string;
  href: string;
};

type NavMenu = {
  label: string;
  href: string;
  featured: {
    title: string;
    desc: string;
    cta: string;
    href: string;
  };
  groups: readonly {
    heading: string;
    items: readonly MenuItem[];
  }[];
};

function MegaPanel({ children }: { children: ReactNode }) {
  return (
    <div
      className={cn(
        "invisible absolute left-1/2 top-full z-[70] w-[min(42rem,calc(100vw-2rem))] -translate-x-1/2 pt-3 opacity-0",
        "pointer-events-none transition-all duration-200",
        "group-hover:visible group-hover:pointer-events-auto group-hover:opacity-100",
        "group-focus-within:visible group-focus-within:pointer-events-auto group-focus-within:opacity-100",
      )}
    >
      <div className="overflow-hidden rounded-[1.5rem] border border-[#efecf4] bg-white shadow-[0_24px_60px_rgba(40,20,70,0.12)]">
        {children}
      </div>
    </div>
  );
}

function FeaturedCard({
  title,
  desc,
  cta,
  href,
}: NavMenu["featured"]) {
  return (
    <div className="flex h-full flex-col justify-between bg-gradient-to-br from-[#f3ecff] via-[#fff7f3] to-[#ffe9c8] p-5">
      <div>
        <p className="text-[0.625rem] font-bold uppercase tracking-[0.16em] text-[#ee5b45]">
          Destacado
        </p>
        <h3 className="lp-font mt-2 text-lg font-semibold leading-tight tracking-[-0.02em] text-[#131316]">
          {title}
        </h3>
        <p className="mt-2 text-[0.8125rem] leading-relaxed text-[#6b6478]">{desc}</p>
      </div>
      <Link
        href={href}
        className="lp-font group/cta mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#131316] transition-colors hover:text-[#ee5b45]"
      >
        {cta}
        <ChevronRight className="size-4 transition-transform duration-300 group-hover/cta:translate-x-0.5" />
      </Link>
    </div>
  );
}

function LinkGroup({ heading, items }: { heading: string; items: readonly MenuItem[] }) {
  return (
    <div className="p-4 sm:p-5">
      <p className="mb-2.5 text-[0.625rem] font-bold uppercase tracking-[0.16em] text-[#b6b6c0]">
        {heading}
      </p>
      <ul className="space-y-0.5">
        {items.map((item) => (
          <li key={item.title}>
            <Link
              href={item.href}
              className="group/item flex items-start justify-between gap-2 rounded-xl px-2.5 py-2.5 transition-colors hover:bg-[#f7f4fc]"
            >
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#131316]">{item.title}</p>
                <p className="text-[0.75rem] text-[#8b8b96]">{item.desc}</p>
              </div>
              <ChevronRight className="mt-0.5 size-3.5 shrink-0 text-[#c9c9d4] opacity-0 transition-opacity group-hover/item:opacity-100" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function NavDropdown({ menu }: { menu: NavMenu }) {
  return (
    <div className="group relative">
      <Link
        href={menu.href}
        className="lp-font flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium text-[#5f5f6a] transition-colors group-hover:bg-[#f7f4fc] group-hover:text-[#131316]"
      >
        {menu.label}
        <ChevronDown className="size-3.5 opacity-50 transition-transform duration-200 group-hover:rotate-180" />
      </Link>

      <MegaPanel>
        <div className="grid grid-cols-[1.05fr_1fr_1fr] divide-x divide-[#f1eef7]">
          <FeaturedCard {...menu.featured} />
          {menu.groups.map((group) => (
            <LinkGroup key={group.heading} heading={group.heading} items={group.items} />
          ))}
        </div>
      </MegaPanel>
    </div>
  );
}

function PlainNavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="lp-font group relative rounded-full px-3.5 py-2 text-sm font-medium text-[#5f5f6a] transition-colors hover:text-[#131316]"
    >
      {label}
      <span className="absolute inset-x-3.5 bottom-1 h-px origin-left scale-x-0 bg-[#ee5b45] transition-transform duration-300 group-hover:scale-x-100" />
    </Link>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const menus = [lp.navMenus.measure, lp.navMenus.how, lp.navMenus.report];

  return (
    <header className="relative z-50 px-[clamp(1.25rem,4vw,3.75rem)] pt-5">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6">
        <Link href="/" className="flex h-10 shrink-0 items-center sm:h-11" aria-label="DevStudio">
          <Image
            src={LOGO_SRC}
            alt="DevStudio"
            width={819}
            height={1024}
            priority
            className="h-full w-auto object-contain"
            sizes="120px"
          />
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex">
          {menus.map((menu) => (
            <NavDropdown key={menu.label} menu={menu} />
          ))}
          <PlainNavLink href="#recursos" label="Recursos" />
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href={lp.navSecondary.href}
            className="lp-font hidden text-sm font-semibold text-[#131316] transition-colors hover:text-[#ee5b45] sm:inline-flex"
          >
            {lp.navSecondary.label}
          </Link>
          <LpButton href={lp.navCta.href} variant="dark" className="hidden sm:inline-flex">
            {lp.navCta.label}
          </LpButton>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            className="flex size-10 items-center justify-center rounded-full border border-[#eae6f2] bg-white text-[#131316] transition-colors hover:border-[#c9bdea] lg:hidden"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            className="mx-auto mt-3 w-full max-w-6xl overflow-hidden rounded-3xl border border-[#efecf4] bg-white p-3 shadow-[0_18px_40px_rgba(60,30,90,0.10)] lg:hidden"
          >
            <ul className="space-y-1">
              {[...menus.map((m) => ({ href: m.href, label: m.label })), { href: "#recursos", label: "Recursos" }].map(
                (item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="lp-font flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold text-[#131316] transition-colors hover:bg-[#f6f3fb]"
                    >
                      {item.label}
                      <ArrowRight className="size-4 text-[#b6b6c0]" />
                    </Link>
                  </li>
                ),
              )}
            </ul>

            <div className="mt-2 space-y-2 rounded-2xl bg-[#f7f4fc] p-3">
              {menus[0].groups[0].items.slice(0, 3).map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-2 py-1.5"
                >
                  <p className="text-sm font-semibold text-[#131316]">{item.title}</p>
                  <p className="text-[0.75rem] text-[#8b8b96]">{item.desc}</p>
                </Link>
              ))}
            </div>

            <div className="mt-2 grid gap-2 px-1 pb-1">
              <LpButton href={lp.navCta.href} variant="dark" className="w-full">
                {lp.navCta.label}
              </LpButton>
              <LpButton href={lp.navSecondary.href} variant="light" className="w-full">
                {lp.navSecondary.label}
              </LpButton>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
