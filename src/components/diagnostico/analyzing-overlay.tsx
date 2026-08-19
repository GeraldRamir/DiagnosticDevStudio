"use client";

import { Loader2 } from "lucide-react";
import { motion } from "motion/react";

export function AnalyzingOverlay() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#f3f4f8]/90 backdrop-blur-sm"
    >
      <div className="mx-4 w-full max-w-md rounded-2xl border border-[#e8ebf0] bg-white p-6 text-center shadow-[0_24px_64px_rgba(15,23,42,0.12)] sm:p-8">
        <Loader2 className="mx-auto size-8 animate-spin text-[#6366f1]" />
        <p className="mt-4 text-lg font-semibold text-[#111827]">Generando diagnóstico</p>
        <p className="mt-2 text-sm text-[#64748b]">
          Analizando presencia, operación y señales técnicas. Esto puede tardar unos segundos.
        </p>
        <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-[#eef2f7]">
          <motion.div
            className="h-full rounded-full bg-[#6366f1]"
            initial={{ width: "12%" }}
            animate={{ width: ["12%", "68%", "92%"] }}
            transition={{ duration: 8, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
          />
        </div>
      </div>
    </motion.div>
  );
}
