"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
};

export function Reveal({ children, delay = 0, className }: RevealProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setShow(true), delay);
    return () => window.clearTimeout(t);
  }, [delay]);

  return (
    <div className={cn("relative", className)}>
      {!show ? (
        <div className="absolute inset-0 animate-pulse rounded-2xl bg-[#eef2f7]" aria-hidden />
      ) : null}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className={cn(!show && "pointer-events-none opacity-0")}
      >
        {children}
      </motion.div>
    </div>
  );
}

type ChartMountProps = {
  delay?: number;
  height: number;
  children: ReactNode;
  className?: string;
};

/** Monta Recharts solo con altura fija — evita ResponsiveContainer en 0px */
export function ChartMount({ delay = 0, height, children, className }: ChartMountProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setReady(true), delay);
    return () => window.clearTimeout(t);
  }, [delay]);

  if (!ready) {
    return (
      <div
        className={cn("w-full animate-pulse rounded-xl bg-[#eef2f7]", className)}
        style={{ height }}
        aria-hidden
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={cn("w-full", className)}
      style={{ height }}
    >
      {children}
    </motion.div>
  );
}
