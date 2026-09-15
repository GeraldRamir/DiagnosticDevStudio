"use client";

import { useId, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Átomos de formulario compartidos por los paneles del generador. */

export const qrInputClass =
  "h-10 w-full rounded-lg border border-[#171311]/15 bg-white px-3 text-[0.875rem] text-[#171311] outline-none transition-colors placeholder:text-[#6E6561]/60 focus-visible:border-[#A61E22] focus-visible:ring-2 focus-visible:ring-[#A61E22]/20 disabled:opacity-50";

export function QrField({
  label,
  htmlFor,
  hint,
  error,
  children,
  className,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="text-[0.78rem] font-semibold text-[#171311]">
        {label}
      </label>
      <div className="mt-1.5">{children}</div>
      {error ? (
        <p role="alert" className="mt-1.5 text-[0.75rem] font-medium text-[#A61E22]">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-[0.72rem] leading-snug text-[#6E6561]">{hint}</p>
      ) : null}
    </div>
  );
}

export function QrSegmented<T extends string>({
  label,
  options,
  value,
  onChange,
  hint,
}: {
  label: string;
  options: { id: T; label: string }[];
  value: T;
  onChange: (next: T) => void;
  hint?: string;
}) {
  const groupId = useId();
  return (
    <div role="group" aria-labelledby={groupId}>
      <p id={groupId} className="text-[0.78rem] font-semibold text-[#171311]">
        {label}
      </p>
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        {options.map((option) => {
          const active = option.id === value;
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(option.id)}
              className={cn(
                "h-9 cursor-pointer rounded-lg px-3 text-[0.78rem] font-medium transition-colors focus-visible:ring-2 focus-visible:ring-[#A61E22]/30 focus-visible:outline-none",
                active
                  ? "bg-[#171311] text-white"
                  : "bg-[#F1ECE8] text-[#171311] hover:bg-[#E5DDD7]",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
      {hint ? (
        <p className="mt-1.5 text-[0.72rem] leading-snug text-[#6E6561]">{hint}</p>
      ) : null}
    </div>
  );
}

export function QrColorField({
  label,
  value,
  onChange,
  id,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
  id: string;
}) {
  return (
    <QrField label={label} htmlFor={id}>
      <div className="flex items-center gap-2">
        <input
          id={id}
          type="color"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="size-10 cursor-pointer rounded-lg border border-[#171311]/15 bg-white p-1"
          aria-label={`${label}: selector de color`}
        />
        <input
          value={value.toUpperCase()}
          onChange={(event) => {
            const next = event.target.value.trim();
            if (/^#[0-9a-f]{0,6}$/i.test(next)) onChange(next);
          }}
          className={cn(qrInputClass, "font-mono text-[0.8rem] uppercase")}
          aria-label={`${label}: código hexadecimal`}
          maxLength={7}
        />
      </div>
    </QrField>
  );
}

export function QrRange({
  label,
  id,
  min,
  max,
  step = 1,
  value,
  onChange,
  display,
}: {
  label: string;
  id: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (next: number) => void;
  display: string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={id} className="text-[0.78rem] font-semibold text-[#171311]">
          {label}
        </label>
        <span className="text-[0.72rem] text-[#6E6561]">{display}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-2 w-full accent-[#A61E22]"
      />
    </div>
  );
}
