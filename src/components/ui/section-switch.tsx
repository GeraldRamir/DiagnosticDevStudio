"use client";

import type { ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Crossfade suave al cambiar de pestaña o paso dentro de una herramienta.
 */
export function SectionSwitch({
  sectionKey,
  children,
  className,
}: {
  sectionKey: string | number;
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={sectionKey}
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
        transition={{ duration: reduce ? 0.12 : 0.28, ease: [0.22, 1, 0.36, 1] }}
        className={cn(className)}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
