"use client";

import {
  Check,
  Copy,
  Download,
  ExternalLink,
  ImageDown,
  Save,
  Share2,
  TriangleAlert,
} from "lucide-react";
import type { QrStudioState } from "@/components/tools/qr/use-qr-studio";
import { openableHref } from "@/lib/tools/qr/build";
import { cn } from "@/lib/utils";

const actionClass =
  "inline-flex h-10 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-[#171311]/15 bg-white px-3 text-[0.78rem] font-medium text-[#171311] transition-colors hover:border-[#171311]/35 focus-visible:ring-2 focus-visible:ring-[#A61E22]/30 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40";

/** Columna derecha: estado, vista previa en vivo y acciones. */
export function QrPreviewPanel({
  studio,
  onDownload,
  onCopyContent,
  onCopyImage,
  onShare,
  onSave,
}: {
  studio: QrStudioState;
  onDownload: (format: "png" | "svg" | "jpg") => void;
  onCopyContent: () => void;
  onCopyImage: () => void;
  onShare: () => void;
  onSave: () => void;
}) {
  const { isValid, preview, rendering, renderError, scan, value, type } = studio;
  const testHref = openableHref(type, value);
  const ok = isValid && scan.status === "ok";

  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-[#171311] p-4 lg:sticky lg:top-24">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[0.68rem] tracking-[0.16em] text-white/45 uppercase">
          Vista previa
        </p>
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.7rem] font-medium",
            !isValid
              ? "bg-white/10 text-white/60"
              : ok
                ? "bg-[#1F6B3A] text-white"
                : "bg-[#C9861A] text-white",
          )}
          role="status"
        >
          {isValid ? (
            ok ? (
              <Check className="size-3.5" strokeWidth={2} aria-hidden />
            ) : (
              <TriangleAlert className="size-3.5" strokeWidth={2} aria-hidden />
            )
          ) : null}
          {!isValid
            ? "Completa los datos"
            : ok
              ? "QR listo para escanear"
              : "Revisa la personalización"}
        </span>
      </div>

      <div className="flex min-h-[15rem] items-center justify-center rounded-xl bg-white p-4">
        {rendering && !preview ? (
          <p className="text-[0.8rem] text-[#6E6561]">Generando…</p>
        ) : null}
        {preview ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={preview}
            alt={`Código QR de ${studio.name}`}
            className="h-auto w-full max-w-[13rem] transition-opacity"
            style={{ opacity: rendering ? 0.6 : 1 }}
          />
        ) : null}
        {!preview && !rendering ? (
          <p className="max-w-[14rem] text-center text-[0.8rem] leading-relaxed text-[#6E6561]">
            {renderError ?? "Llena la información de la izquierda y el código aparece aquí."}
          </p>
        ) : null}
      </div>

      {isValid && scan.warnings.length > 0 ? (
        <ul className="space-y-1.5 rounded-xl bg-white/5 p-3">
          {scan.warnings.map((warning) => (
            <li key={warning} className="flex gap-2 text-[0.72rem] leading-snug text-white/70">
              <TriangleAlert
                className="mt-0.5 size-3.5 shrink-0 text-[#E3A951]"
                strokeWidth={1.8}
                aria-hidden
              />
              {warning}
            </li>
          ))}
        </ul>
      ) : null}

      {value ? (
        <p className="truncate rounded-lg bg-white/5 px-3 py-2 font-mono text-[0.7rem] text-white/60">
          {value}
        </p>
      ) : null}

      <button
        type="button"
        disabled={!isValid}
        onClick={() => onDownload("png")}
        className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#A61E22] px-4 text-[0.85rem] font-semibold text-white transition-colors hover:bg-[#8C181C] focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Download className="size-4" strokeWidth={1.8} aria-hidden />
        Descargar PNG
      </button>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          disabled={!isValid}
          onClick={() => onDownload("svg")}
          className={actionClass}
        >
          <Download className="size-4" strokeWidth={1.8} aria-hidden />
          SVG
        </button>
        <button
          type="button"
          disabled={!isValid}
          onClick={() => onDownload("jpg")}
          className={actionClass}
        >
          <Download className="size-4" strokeWidth={1.8} aria-hidden />
          JPG
        </button>
        <button
          type="button"
          disabled={!value}
          onClick={onCopyContent}
          className={actionClass}
        >
          <Copy className="size-4" strokeWidth={1.8} aria-hidden />
          Copiar enlace
        </button>
        <button
          type="button"
          disabled={!isValid}
          onClick={onCopyImage}
          className={actionClass}
        >
          <ImageDown className="size-4" strokeWidth={1.8} aria-hidden />
          Copiar imagen
        </button>
        <button type="button" disabled={!isValid} onClick={onShare} className={actionClass}>
          <Share2 className="size-4" strokeWidth={1.8} aria-hidden />
          Compartir
        </button>
        {testHref ? (
          <a
            href={testHref}
            target="_blank"
            rel="noopener noreferrer"
            className={actionClass}
          >
            <ExternalLink className="size-4" strokeWidth={1.8} aria-hidden />
            Probar QR
          </a>
        ) : (
          <button type="button" disabled className={actionClass}>
            <ExternalLink className="size-4" strokeWidth={1.8} aria-hidden />
            Probar QR
          </button>
        )}
      </div>

      <button
        type="button"
        disabled={!isValid}
        onClick={onSave}
        className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-white/20 px-4 text-[0.8rem] font-medium text-white transition-colors hover:border-white/50 focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Save className="size-4" strokeWidth={1.8} aria-hidden />
        Guardar en mis códigos
      </button>

      <p className="text-[0.7rem] leading-relaxed text-white/40">
        Todo se genera en tu navegador: ni el contenido ni el logo salen de tu dispositivo.
      </p>
    </div>
  );
}
