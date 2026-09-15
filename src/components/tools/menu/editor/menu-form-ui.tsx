"use client";

import { useId, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Átomos de formulario del editor de menú. */

export const inputClass =
  "h-10 w-full rounded-lg border border-[#16161c]/15 bg-white px-3 text-[0.875rem] text-[#16161c] outline-none transition-colors placeholder:text-[#16161c]/35 focus-visible:border-[#90BF53] focus-visible:ring-2 focus-visible:ring-[#90BF53]/25";

export function Field({
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
      <label htmlFor={htmlFor} className="text-[0.78rem] font-semibold text-[#16161c]">
        {label}
      </label>
      <div className="mt-1.5">{children}</div>
      {error ? (
        <p role="alert" className="mt-1.5 text-[0.75rem] font-medium text-[#B4231F]">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-[0.72rem] leading-snug text-[#16161c]/55">{hint}</p>
      ) : null}
    </div>
  );
}

export function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  const id = useId();
  return (
    <label
      htmlFor={id}
      className={cn(
        "flex cursor-pointer items-start justify-between gap-3 rounded-xl border p-3 transition-colors",
        checked ? "border-[#90BF53]/50 bg-[#90BF53]/8" : "border-[#16161c]/10 bg-white",
      )}
    >
      <span className="min-w-0">
        <span className="block text-[0.82rem] font-medium text-[#16161c]">{label}</span>
        {description ? (
          <span className="mt-0.5 block text-[0.72rem] leading-snug text-[#16161c]/55">
            {description}
          </span>
        ) : null}
      </span>

      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="peer sr-only"
      />
      <span
        aria-hidden
        className={cn(
          "mt-0.5 inline-flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-[#90BF53]/50",
          checked ? "bg-[#90BF53]" : "bg-[#16161c]/15",
        )}
      >
        <span
          className={cn(
            "size-4 rounded-full bg-white shadow-sm transition-transform",
            checked ? "translate-x-4" : "translate-x-0",
          )}
        />
      </span>
    </label>
  );
}

/**
 * Selector visual de opciones: cada opción muestra una miniatura
 * en vez de solo texto, para que se entienda sin leer.
 */
export function OptionCards<T extends string>({
  label,
  options,
  value,
  onChange,
  hint,
  columns = 3,
}: {
  label: string;
  options: { id: T; label: string; description?: string; preview: ReactNode }[];
  value: T;
  onChange: (next: T) => void;
  hint?: string;
  columns?: 2 | 3;
}) {
  const groupId = useId();
  return (
    <div role="group" aria-labelledby={groupId}>
      <p id={groupId} className="text-[0.78rem] font-semibold text-[#16161c]">
        {label}
      </p>
      <div
        className={cn(
          "mt-2 grid gap-2",
          columns === 2 ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-3",
        )}
      >
        {options.map((option) => {
          const active = option.id === value;
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(option.id)}
              className={cn(
                "cursor-pointer overflow-hidden rounded-xl border p-2 text-left transition-colors focus-visible:ring-2 focus-visible:ring-[#90BF53]/40 focus-visible:outline-none",
                active
                  ? "border-[#16161c] bg-white ring-1 ring-[#16161c]"
                  : "border-[#16161c]/12 bg-white hover:border-[#16161c]/35",
              )}
            >
              <span className="block overflow-hidden rounded-lg bg-[#F5F1ED]">
                {option.preview}
              </span>
              <span className="mt-2 block px-0.5 text-[0.78rem] font-medium text-[#16161c]">
                {option.label}
              </span>
              {option.description ? (
                <span className="mt-0.5 block px-0.5 text-[0.68rem] leading-snug text-[#16161c]/55">
                  {option.description}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
      {hint ? (
        <p className="mt-1.5 text-[0.72rem] leading-snug text-[#16161c]/55">{hint}</p>
      ) : null}
    </div>
  );
}

export function Segmented<T extends string>({
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
      <p id={groupId} className="text-[0.78rem] font-semibold text-[#16161c]">
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
                "h-9 cursor-pointer rounded-lg px-3 text-[0.78rem] font-medium transition-colors focus-visible:ring-2 focus-visible:ring-[#90BF53]/40 focus-visible:outline-none",
                active
                  ? "bg-[#16161c] text-white"
                  : "bg-[#F1ECE8] text-[#16161c] hover:bg-[#E6DFD9]",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
      {hint ? (
        <p className="mt-1.5 text-[0.72rem] leading-snug text-[#16161c]/55">{hint}</p>
      ) : null}
    </div>
  );
}

export function ColorField({
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
    <Field label={label} htmlFor={id}>
      <div className="flex items-center gap-2">
        <input
          id={id}
          type="color"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="size-10 cursor-pointer rounded-lg border border-[#16161c]/15 bg-white p-1"
          aria-label={`${label}: selector de color`}
        />
        <input
          value={value.toUpperCase()}
          onChange={(event) => {
            const next = event.target.value.trim();
            if (/^#[0-9a-f]{0,6}$/i.test(next)) onChange(next);
          }}
          className={cn(inputClass, "font-mono text-[0.8rem] uppercase")}
          aria-label={`${label}: código hexadecimal`}
          maxLength={7}
        />
      </div>
    </Field>
  );
}

export function EditorSection({
  title,
  description,
  icon,
  aside,
  children,
}: {
  title: string;
  description?: string;
  icon?: ReactNode;
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-[#16161c]/8 bg-white p-4 shadow-[0_1px_2px_rgba(22,19,15,0.04)] sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          {icon ? (
            <span className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#F1ECE8] text-[#16161c]">
              {icon}
            </span>
          ) : null}
          <div className="min-w-0">
            <h2 className="text-[0.95rem] font-semibold tracking-tight text-[#16161c]">
              {title}
            </h2>
            {description ? (
              <p className="mt-1 text-[0.78rem] leading-relaxed text-[#16161c]/55">
                {description}
              </p>
            ) : null}
          </div>
        </div>
        {aside ? <div className="shrink-0">{aside}</div> : null}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}
