"use client";

import { useTransition, type MouseEvent } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutGroup, motion, useReducedMotion } from "motion/react";
import { TOOL_MARKS } from "@/components/tools/tool-marks";
import { cn } from "@/lib/utils";

export function ToolsSwitcher({
  variant,
}: {
  variant: "hero" | "dock";
}) {
  const pathname = usePathname();
  const router = useRouter();
  const reduce = useReducedMotion();
  const [isPending, startTransition] = useTransition();

  function onClick(event: MouseEvent<HTMLAnchorElement>, href: string) {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.defaultPrevented
    ) {
      return;
    }

    if (pathname === href || pathname.startsWith(`${href}/`)) {
      event.preventDefault();
      return;
    }

    event.preventDefault();
    startTransition(() => {
      router.push(href);
    });
  }

  return (
    <nav
      id={variant === "hero" ? "kit" : undefined}
      className={cn(
        "[view-transition-name:tools-kit]",
        variant === "hero" && "mt-6 scroll-mt-24 md:mt-8 lg:mt-10",
        variant === "dock" && isPending && "pointer-events-none opacity-80",
      )}
      aria-label="Kit de herramientas"
    >
      <LayoutGroup id="tools-switcher">
        <ul
          className={cn(
            "flex items-center",
            variant === "hero" &&
              "gap-x-8 gap-y-4 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:flex-wrap sm:justify-between sm:overflow-visible lg:gap-x-10 [&::-webkit-scrollbar]:hidden",
            variant === "dock" &&
              "dst-container min-h-[3.25rem] justify-between gap-1 overflow-x-auto py-2 [-ms-overflow-style:none] [scrollbar-width:none] md:min-h-[3.5rem] md:gap-2 md:py-2.5 [&::-webkit-scrollbar]:hidden",
          )}
        >
          {TOOL_MARKS.map(({ href, label, Mark }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);

            return (
              <li key={href} className="relative shrink-0">
                <Link
                  href={href}
                  prefetch
                  scroll={variant === "dock"}
                  onClick={(event) => onClick(event, href)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative inline-flex items-center gap-2 rounded-full font-semibold tracking-[-0.02em] transition-colors duration-200",
                    variant === "hero" &&
                      "px-0 py-1 text-[0.92rem] text-[#b8bdbf] hover:text-[#16161c] sm:text-[1rem] lg:text-[1.08rem]",
                    variant === "dock" &&
                      "min-h-10 px-2.5 py-2 text-[0.78rem] md:min-h-11 md:px-3 md:text-[0.88rem]",
                    variant === "dock" &&
                      (active
                        ? "text-[#16161c]"
                        : "text-[#9aa0a6] hover:text-[#16161c]"),
                  )}
                >
                  {variant === "dock" && active && !reduce ? (
                    <motion.span
                      layoutId="tools-dock-pill"
                      className="absolute inset-0 rounded-full bg-[#16161c]/[0.06]"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      aria-hidden
                    />
                  ) : variant === "dock" && active ? (
                    <span
                      className="absolute inset-0 rounded-full bg-[#16161c]/[0.06]"
                      aria-hidden
                    />
                  ) : null}
                  <Mark />
                  <span className="relative z-[1]">{label}</span>
                  <span className="sr-only"> — abrir herramienta</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </LayoutGroup>
    </nav>
  );
}
