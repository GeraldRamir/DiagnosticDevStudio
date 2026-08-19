"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Aparición suave al entrar en pantalla, anulable por preferencia del sistema */
export function Reveal({
  children,
  delay = 0,
  y = 22,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduce = useReducedMotion() ?? false;

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={reduce ? { duration: 0 } : { duration: 0.65, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function Badge({
  children,
  tone = "light",
  className,
}: {
  children: ReactNode;
  tone?: "light" | "dark" | "yellow" | "coral" | "lilac";
  className?: string;
}) {
  const tones = {
    light: "border border-[#e9e5f1] bg-white text-[#5f5f6a]",
    dark: "bg-[#111111] text-white",
    yellow: "bg-[#ffd95e] text-[#4a3a00]",
    coral: "bg-[#ffe7e1] text-[#c8402c]",
    lilac: "bg-[#ede4ff] text-[#5b3fa8]",
  } as const;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[0.6875rem] font-semibold uppercase tracking-[0.12em]",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

type ButtonProps = {
  children: ReactNode;
  href: string;
  variant?: "dark" | "light" | "coral" | "yellow";
  size?: "md" | "lg";
  icon?: ReactNode;
  className?: string;
};

export function LpButton({
  children,
  href,
  variant = "dark",
  size = "md",
  icon,
  className,
}: ButtonProps) {
  const reduce = useReducedMotion() ?? false;
  const isInternal = href.startsWith("/") || href.startsWith("#");

  const cls = cn(
    "lp-font group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-semibold transition-colors",
    size === "lg" ? "h-[3.25rem] px-7 text-[0.9375rem]" : "h-11 px-5 text-sm",
    variant === "dark" && "bg-[#111111] text-white hover:bg-[#2b2b2b]",
    variant === "light" &&
      "border border-[#e5e1ed] bg-white text-[#131316] hover:border-[#c9bdea] hover:text-[#5b3fa8]",
    variant === "coral" && "bg-[#ee5b45] text-white hover:bg-[#d9452f]",
    variant === "yellow" && "bg-[#ffd95e] text-[#3c2f00] hover:bg-[#f7cd41]",
    className,
  );

  const inner = (
    <>
      <span className="rp-shine" aria-hidden />
      {children}
      {icon ? (
        <span className="transition-transform duration-300 group-hover:translate-x-1">{icon}</span>
      ) : null}
    </>
  );

  const motionProps = {
    whileHover: reduce ? undefined : { y: -2 },
    whileTap: reduce ? undefined : { scale: 0.97 },
    transition: { type: "spring" as const, stiffness: 400, damping: 26 },
  };

  if (isInternal) {
    return (
      <motion.span {...motionProps} className={cn("inline-flex max-w-full", className?.includes("w-full") && "w-full")}>
        <Link href={href} className={cls}>
          {inner}
        </Link>
      </motion.span>
    );
  }

  return (
    <motion.a
      href={href}
      className={cls}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      {...motionProps}
    >
      {inner}
    </motion.a>
  );
}

export function SectionTitle({
  badge,
  badgeTone = "light",
  title,
  accent,
  subtitle,
  align = "center",
  className,
}: {
  badge?: string;
  badgeTone?: "light" | "dark" | "yellow" | "coral" | "lilac";
  title: string;
  accent?: string;
  subtitle?: string;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className,
      )}
    >
      {badge ? (
        <Reveal>
          <Badge tone={badgeTone}>{badge}</Badge>
        </Reveal>
      ) : null}
      <Reveal delay={0.06}>
        <h2
          className={cn(
            "lp-font font-semibold leading-[1.08] tracking-[-0.03em] text-[#131316]",
            badge ? "mt-4" : "",
            "text-[clamp(1.75rem,4.2vw,2.75rem)]",
          )}
        >
          {title}
          {accent ? (
            <>
              <br />
              <span className="text-[#8b8b96]">{accent}</span>
            </>
          ) : null}
        </h2>
      </Reveal>
      {subtitle ? (
        <Reveal delay={0.12}>
          <p
            className={cn(
              "mt-4 text-[0.9375rem] leading-relaxed text-[#7b7b87]",
              align === "center" && "mx-auto max-w-xl",
            )}
          >
            {subtitle}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}

/** Contenedor interno de la hoja blanca */
export function LpSection({
  children,
  id,
  className,
}: {
  children: ReactNode;
  id?: string;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={cn("px-[clamp(1.25rem,4vw,3.75rem)] py-[clamp(3rem,6vw,5.5rem)]", className)}
    >
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}
