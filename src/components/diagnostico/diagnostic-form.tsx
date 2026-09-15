"use client";

import { useEffect, useState } from "react";
import { DiagnosticFormInner } from "@/components/diagnostico/diagnostic-form-inner";

function DiagnosticFormSkeleton() {
  return (
    <div className="mx-auto w-full max-w-6xl animate-pulse">
      <div className="mb-8 border-b border-[#e2e8f0] pb-6">
        <div className="mb-4 h-4 w-24 rounded bg-[#e2e8f0]" />
        <div className="h-8 w-2/3 max-w-md rounded bg-[#e2e8f0]" />
        <div className="mt-3 h-4 w-full max-w-xl rounded bg-[#f1f5f9]" />
      </div>
      <div className="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
        <div className="hidden h-80 rounded-xl bg-[#f1f5f9] lg:block" />
        <div className="h-[420px] rounded-xl border border-[#e2e8f0] bg-white" />
      </div>
    </div>
  );
}

type DiagnosticFormProps = {
  backHref?: string;
};

/** Client-only mount avoids hydration mismatches from extensions and localStorage drafts. */
export function DiagnosticForm({ backHref = "/" }: DiagnosticFormProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <DiagnosticFormSkeleton />;
  }

  return <DiagnosticFormInner backHref={backHref} />;
}
