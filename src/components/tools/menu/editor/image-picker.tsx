"use client";

import { useId, useRef, useState } from "react";
import { ImagePlus, Loader, RefreshCw, Trash2 } from "lucide-react";
import { storeImage, type ImageSlot } from "@/lib/tools/menu/images";
import { cn } from "@/lib/utils";

/**
 * Selector de imagen con arrastrar y soltar.
 * Comprime antes de guardar, así que el menú puede vivir en localStorage
 * sin que las fotos lo revienten ni ralenticen la carga del cliente.
 */
export function ImagePicker({
  label,
  hint,
  value,
  slot,
  aspect = "square",
  onChange,
}: {
  label: string;
  hint?: string;
  value: string | null;
  slot: ImageSlot;
  /** Proporción del recuadro de vista previa. */
  aspect?: "square" | "wide" | "card";
  onChange: (dataUrl: string | null) => void;
}) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setLoading(true);
    const result = await storeImage(file, slot);
    setLoading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setError(null);
    onChange(result.dataUrl);
  }

  const ratio =
    aspect === "wide" ? "aspect-[16/7]" : aspect === "card" ? "aspect-[4/3]" : "aspect-square";

  return (
    <div>
      <p className="text-[0.78rem] font-semibold text-[#16161c]">{label}</p>

      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          void handleFile(event.dataTransfer.files?.[0]);
        }}
        className={cn(
          "mt-1.5 overflow-hidden rounded-xl border transition-colors",
          dragging ? "border-[#90BF53] bg-[#90BF53]/8" : "border-[#16161c]/12 bg-white",
        )}
      >
        {value ? (
          <div className="flex items-stretch gap-3 p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt={`${label}: vista previa`}
              className={cn("w-24 shrink-0 rounded-lg object-cover", ratio)}
            />
            <div className="flex min-w-0 flex-1 flex-col justify-center gap-2">
              <p className="text-[0.75rem] leading-snug text-[#16161c]/55">
                Imagen lista. La comprimimos para que cargue rápido en el celular del cliente.
              </p>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-lg border border-[#16161c]/15 px-2.5 text-[0.75rem] font-medium text-[#16161c] hover:border-[#16161c]/35"
                >
                  <RefreshCw className="size-3.5" strokeWidth={1.8} aria-hidden />
                  Cambiar
                </button>
                <button
                  type="button"
                  onClick={() => onChange(null)}
                  className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-lg px-2.5 text-[0.75rem] font-medium text-[#B4231F] hover:bg-[#F7E7E6]"
                >
                  <Trash2 className="size-3.5" strokeWidth={1.8} aria-hidden />
                  Quitar
                </button>
              </div>
            </div>
          </div>
        ) : (
          <label
            htmlFor={inputId}
            className="flex cursor-pointer flex-col items-center justify-center gap-2 px-4 py-6 text-center"
          >
            <span className="inline-flex size-10 items-center justify-center rounded-full bg-[#F1ECE8] text-[#16161c]">
              {loading ? (
                <Loader className="size-4 animate-spin" strokeWidth={1.8} aria-hidden />
              ) : (
                <ImagePlus className="size-4" strokeWidth={1.8} aria-hidden />
              )}
            </span>
            <span className="text-[0.8rem] font-medium text-[#16161c]">
              {loading ? "Procesando imagen…" : "Arrastra una foto o haz clic"}
            </span>
            <span className="text-[0.72rem] text-[#16161c]/55">
              {hint ?? "JPG, PNG o WEBP · hasta 2 MB"}
            </span>
          </label>
        )}

        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="sr-only"
          onChange={(event) => {
            void handleFile(event.target.files?.[0]);
            event.target.value = "";
          }}
        />
      </div>

      {error ? (
        <p role="alert" className="mt-1.5 text-[0.75rem] font-medium text-[#B4231F]">
          {error}
        </p>
      ) : null}
    </div>
  );
}
