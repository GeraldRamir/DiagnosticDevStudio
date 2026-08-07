"use client";

import { Check } from "lucide-react";
import { copy } from "@/lib/copy";
import { cn } from "@/lib/utils";

type FormStepSidebarProps = {
  step: number;
  formId: string;
  businessName?: string;
  onStepClick?: (index: number) => void;
};

export function FormStepSidebar({
  step,
  formId,
  businessName,
  onStepClick,
}: FormStepSidebarProps) {
  const s = copy.form.sidebar;
  const steps = copy.form.steps;
  const pct = Math.round(((step + 1) / steps.length) * 100);

  return (
    <aside className="flex flex-col gap-6">
      <div className="rounded-xl border border-[#e2e8f0] bg-white p-5 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
        <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-[#64748b]">
          {s.title}
        </p>
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-[#64748b]">
            <span>{s.completion}</span>
            <span className="font-mono font-medium text-[#0f172a]">{pct}%</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#e2e8f0]">
            <div
              className="h-full rounded-full bg-[#0f172a] transition-all duration-500 ease-out"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        <ol className="mt-6 space-y-0">
          {steps.map((item, i) => {
            const done = i < step;
            const active = i === step;
            const isLast = i === steps.length - 1;

            return (
              <li key={item.id} className="relative flex gap-3">
                {!isLast ? (
                  <span
                    className={cn(
                      "absolute left-[0.6875rem] top-7 h-[calc(100%-0.25rem)] w-px",
                      done ? "bg-[#0f172a]" : "bg-[#e2e8f0]",
                    )}
                    aria-hidden
                  />
                ) : null}
                <button
                  type="button"
                  disabled={i > step}
                  onClick={() => i < step && onStepClick?.(i)}
                  className={cn(
                    "group relative flex w-full gap-3 pb-6 text-left transition-opacity",
                    i > step && "cursor-default opacity-50",
                    i < step && "cursor-pointer",
                  )}
                >
                  <span
                    className={cn(
                      "relative z-[1] flex size-6 shrink-0 items-center justify-center rounded-full border text-[0.6875rem] font-semibold transition-colors",
                      active && "border-[#0f172a] bg-[#0f172a] text-white",
                      done && "border-[#0f172a] bg-[#0f172a] text-white",
                      !active && !done && "border-[#cbd5e1] bg-white text-[#94a3b8]",
                    )}
                  >
                    {done ? <Check className="size-3.5" strokeWidth={2.5} /> : i + 1}
                  </span>
                  <span className="min-w-0 pt-0.5">
                    <span
                      className={cn(
                        "block text-sm font-semibold",
                        active || done ? "text-[#0f172a]" : "text-[#94a3b8]",
                      )}
                    >
                      {item.label}
                    </span>
                    {active ? (
                      <span className="mt-0.5 block text-xs leading-relaxed text-[#64748b]">
                        {item.description}
                      </span>
                    ) : null}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-5">
        <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-[#64748b]">
          {s.reference}
        </p>
        <p className="mt-2 font-mono text-sm font-medium text-[#0f172a]">
          {copy.form.idPrefix}-{formId}
        </p>
        {businessName ? (
          <p className="mt-2 text-sm text-[#475569]">{businessName}</p>
        ) : null}
        <p className="mt-4 text-xs leading-relaxed text-[#64748b]">{s.privacyNote}</p>
      </div>
    </aside>
  );
}
