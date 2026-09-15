"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, ChevronDown, Menu, Search, X } from "lucide-react";
import { TOOL_ICONS } from "@/components/tools/tool-icons";
import { getToolTheme } from "@/components/tools/tool-theme";
import { LOGO_SRC } from "@/lib/brand";
import { NAV_ITEMS, type NavItem } from "@/lib/navigation";
import { getAvailableTools, getCategoryLabel } from "@/lib/tools";
import { cn } from "@/lib/utils";

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function isMenuActive(pathname: string, item: Extract<NavItem, { type: "menu" }>) {
  return item.items.some((link) => isActive(pathname, link.href));
}

const NAV_LINK =
  "relative inline-flex h-[4.25rem] items-center gap-1.5 px-3.5 text-[0.8125rem] font-medium tracking-[-0.01em] transition-colors duration-200";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  useEffect(() => {
    setOpen(false);
    setOpenMenu(null);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-black/[0.06] bg-white/80 backdrop-blur-xl">
      <div className="dst-container grid h-[4.25rem] grid-cols-[1fr_auto] items-center md:grid-cols-[auto_1fr_auto]">
        <Link href="/" className="flex min-w-0 items-center gap-2.5" aria-label="Dev Studio Tools">
          <Image
            src={LOGO_SRC}
            alt="Dev Studio"
            width={819}
            height={1024}
            priority
            className="h-8 w-auto object-contain"
            sizes="36px"
          />
          <span className="flex min-w-0 items-baseline gap-2">
            <span className="text-[0.92rem] font-semibold tracking-[-0.03em] text-foreground">
              Dev Studio
            </span>
            <span className="hidden text-[0.68rem] font-medium tracking-[0.12em] text-muted-foreground uppercase sm:inline">
              Tools
            </span>
          </span>
        </Link>

        <nav
          className="hidden items-center justify-center gap-0.5 md:flex"
          aria-label="Principal"
        >
          {NAV_ITEMS.map((item) => {
            if (item.type === "tools") {
              return (
                <NavToolsMenu
                  key={item.label}
                  href={item.href}
                  label={item.label}
                  active={isActive(pathname, item.href)}
                  open={openMenu === item.label}
                  onOpenChange={(value) => setOpenMenu(value ? item.label : null)}
                  pathname={pathname}
                />
              );
            }

            if (item.type === "menu") {
              return (
                <NavMenu
                  key={item.label}
                  item={item}
                  active={isMenuActive(pathname, item)}
                  open={openMenu === item.label}
                  onOpenChange={(value) => setOpenMenu(value ? item.label : null)}
                  pathname={pathname}
                />
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  NAV_LINK,
                  isActive(pathname, item.href)
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {item.label}
                {isActive(pathname, item.href) ? (
                  <span
                    className="absolute inset-x-3.5 bottom-0 h-[2px] rounded-full bg-landing-lime"
                    aria-hidden
                  />
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center justify-end gap-1.5">
          <Link
            href="/tools"
            aria-label="Buscar herramientas"
            className="inline-flex size-10 items-center justify-center rounded-full text-foreground transition-colors duration-200 hover:bg-black/[0.05]"
          >
            <Search className="size-4" strokeWidth={1.8} />
          </Link>
          <Link
            href="/contacto"
            className="hidden h-10 items-center rounded-full bg-landing-lime px-4 text-[0.8125rem] font-semibold tracking-[-0.01em] text-landing-lime-ink transition-[filter] duration-200 hover:brightness-[0.97] md:inline-flex"
          >
            Contacto
          </Link>
          <button
            type="button"
            className="inline-flex size-10 cursor-pointer items-center justify-center rounded-full text-foreground transition-colors duration-200 hover:bg-black/[0.05] md:hidden"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? (
              <X className="size-4" strokeWidth={1.8} />
            ) : (
              <Menu className="size-4" strokeWidth={1.8} />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-black/[0.06] bg-white md:hidden"
          >
            <nav className="dst-container flex flex-col gap-1 py-3" aria-label="Móvil">
              {NAV_ITEMS.map((item) => {
                if (item.type === "tools") {
                  return <MobileToolsBlock key={item.label} pathname={pathname} />;
                }

                if (item.type === "menu") {
                  return (
                    <div key={item.label} className="px-3 pt-3">
                      <p className="text-[0.68rem] tracking-[0.14em] text-muted-foreground uppercase">
                        {item.label}
                      </p>
                      <div className="mt-1 flex flex-col">
                        {item.items.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                              "rounded-xl py-2.5 text-sm transition-colors duration-200",
                              isActive(pathname, link.href)
                                ? "text-foreground"
                                : "text-muted-foreground hover:text-foreground",
                            )}
                          >
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "rounded-xl px-3 py-3 text-sm transition-colors duration-200",
                      isActive(pathname, item.href)
                        ? "bg-[#f6f5fa] text-foreground"
                        : "text-muted-foreground hover:bg-[#f6f5fa] hover:text-foreground",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <Link
                href="/contacto"
                className="mt-2 inline-flex h-11 items-center justify-center rounded-full bg-landing-lime px-4 text-sm font-semibold text-landing-lime-ink"
              >
                Contacto
              </Link>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

function useHoverMenu(open: boolean, onOpenChange: (open: boolean) => void) {
  const containerRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | null>(null);

  function cancelClose() {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }

  function openMenu() {
    cancelClose();
    onOpenChange(true);
  }

  function closeMenu() {
    cancelClose();
    closeTimer.current = window.setTimeout(() => onOpenChange(false), 90);
  }

  useEffect(() => {
    return () => cancelClose();
  }, []);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        onOpenChange(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onOpenChange(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onOpenChange]);

  return { containerRef, openMenu, closeMenu };
}

function NavToolsMenu({
  href,
  label,
  active,
  open,
  onOpenChange,
  pathname,
}: {
  href: string;
  label: string;
  active: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pathname: string;
}) {
  const { containerRef, openMenu, closeMenu } = useHoverMenu(open, onOpenChange);
  const tools = getAvailableTools();

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={openMenu}
      onMouseLeave={closeMenu}
    >
      <div
        className={cn(
          NAV_LINK,
          "gap-1",
          active || open ? "text-foreground" : "text-muted-foreground",
        )}
      >
        <Link
          href={href}
          onFocus={openMenu}
          className="hover:text-foreground"
        >
          {label}
        </Link>
        <button
          type="button"
          aria-expanded={open}
          aria-haspopup="true"
          aria-label="Ver listado de herramientas"
          onClick={() => onOpenChange(!open)}
          className="inline-flex size-7 cursor-pointer items-center justify-center rounded-full hover:bg-black/[0.05] hover:text-foreground"
        >
          <ChevronDown
            className={cn("size-3.5 transition-transform duration-200", open ? "rotate-180" : "")}
            strokeWidth={1.8}
            aria-hidden
          />
        </button>
        {active ? (
          <span
            className="absolute inset-x-3.5 bottom-0 h-[2px] rounded-full bg-landing-lime"
            aria-hidden
          />
        ) : null}
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-full left-1/2 z-50 w-[min(38rem,calc(100vw-2rem))] -translate-x-1/2 pt-3"
          >
            <div className="overflow-hidden rounded-[1.35rem] border border-black/[0.06] bg-white shadow-[0_24px_60px_rgba(16,16,20,0.12)]">
              <div className="grid gap-1 p-2 sm:grid-cols-2">
                {tools.map((tool) => {
                  const Icon = TOOL_ICONS[tool.icon];
                  const theme = getToolTheme(tool.id);
                  const current = isActive(pathname, tool.href);

                  return (
                    <Link
                      key={tool.id}
                      href={tool.href}
                      className={cn(
                        "group/item flex items-start gap-3 rounded-[1rem] p-3 transition-colors duration-200",
                        current ? "bg-[#f6f5fa]" : "hover:bg-[#f6f5fa]",
                      )}
                    >
                      <span
                        className="mt-0.5 inline-flex size-10 shrink-0 items-center justify-center rounded-[0.8rem]"
                        style={{ backgroundColor: theme.surface }}
                      >
                        <Icon
                          className="size-4"
                          strokeWidth={1.8}
                          style={{ color: theme.icon }}
                          aria-hidden
                        />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[0.84rem] font-semibold tracking-[-0.02em] text-foreground">
                          {tool.shortName}
                        </span>
                        <span className="mt-0.5 block text-[0.72rem] leading-snug text-muted-foreground">
                          {tool.cardDescription}
                        </span>
                        <span className="mt-1.5 block text-[0.65rem] font-medium tracking-[0.08em] text-muted-foreground/80 uppercase">
                          {getCategoryLabel(tool.category)}
                        </span>
                      </span>
                    </Link>
                  );
                })}
              </div>
              <div className="border-t border-black/[0.06] bg-[#faf9fc] px-4 py-3">
                <Link
                  href={href}
                  className="inline-flex items-center gap-1.5 text-[0.8rem] font-medium text-foreground transition-colors hover:text-muted-foreground"
                >
                  Ver todas las herramientas
                  <ArrowRight className="size-3.5" strokeWidth={1.8} aria-hidden />
                </Link>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function NavMenu({
  item,
  active,
  open,
  onOpenChange,
  pathname,
}: {
  item: Extract<NavItem, { type: "menu" }>;
  active: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pathname: string;
}) {
  const { containerRef, openMenu, closeMenu } = useHoverMenu(open, onOpenChange);

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={openMenu}
      onMouseLeave={closeMenu}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => onOpenChange(!open)}
        onFocus={openMenu}
        className={cn(
          NAV_LINK,
          "cursor-pointer",
          active || open ? "text-foreground" : "text-muted-foreground hover:text-foreground",
        )}
      >
        {item.label}
        <ChevronDown
          className={cn("size-3.5 transition-transform duration-200", open ? "rotate-180" : "")}
          strokeWidth={1.8}
          aria-hidden
        />
        {active ? (
          <span
            className="absolute inset-x-3.5 bottom-0 h-[2px] rounded-full bg-landing-lime"
            aria-hidden
          />
        ) : null}
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-full left-1/2 z-50 w-[20rem] -translate-x-1/2 pt-3"
          >
            <div className="rounded-[1.25rem] border border-black/[0.06] bg-white p-2 shadow-[0_24px_60px_rgba(16,16,20,0.12)]">
              {item.items.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "block rounded-[0.9rem] px-3 py-2.5 transition-colors duration-200",
                    isActive(pathname, link.href) ? "bg-[#f6f5fa]" : "hover:bg-[#f6f5fa]",
                  )}
                >
                  <span className="block text-[0.85rem] font-medium text-foreground">
                    {link.label}
                  </span>
                  {link.description ? (
                    <span className="mt-0.5 block text-[0.75rem] leading-snug text-muted-foreground">
                      {link.description}
                    </span>
                  ) : null}
                </Link>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function MobileToolsBlock({ pathname }: { pathname: string }) {
  const tools = getAvailableTools();

  return (
    <div className="px-1 pt-1">
      <Link
        href="/tools"
        className={cn(
          "flex items-center justify-between rounded-xl px-3 py-3 text-sm transition-colors duration-200",
          isActive(pathname, "/tools") && pathname === "/tools"
            ? "bg-[#f6f5fa] text-foreground"
            : "text-foreground hover:bg-[#f6f5fa]",
        )}
      >
        Herramientas
        <ArrowRight className="size-3.5 text-muted-foreground" strokeWidth={1.8} aria-hidden />
      </Link>
      <div className="mt-1 flex flex-col">
        {tools.map((tool) => {
          const Icon = TOOL_ICONS[tool.icon];
          const theme = getToolTheme(tool.id);

          return (
            <Link
              key={tool.id}
              href={tool.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors duration-200",
                isActive(pathname, tool.href) ? "bg-[#f6f5fa]" : "hover:bg-[#f6f5fa]",
              )}
            >
              <span
                className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: theme.surface }}
              >
                <Icon className="size-3.5" strokeWidth={1.8} style={{ color: theme.icon }} aria-hidden />
              </span>
              <span className="min-w-0">
                <span className="block text-[0.84rem] font-medium text-foreground">
                  {tool.shortName}
                </span>
                <span className="block truncate text-[0.7rem] text-muted-foreground">
                  {getCategoryLabel(tool.category)}
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
