"use client";

import { Trash2, Upload } from "lucide-react";
import {
  QrColorField,
  QrField,
  QrRange,
  QrSegmented,
  qrInputClass,
} from "@/components/tools/qr/qr-ui";
import {
  QR_ERROR_LEVELS,
  QR_MODULE_STYLES,
  QR_SIZES,
  type QrCaptionAlign,
  type QrErrorCorrection,
  type QrModuleStyle,
  type QrStyle,
} from "@/lib/tools/qr/types";
import { imageValidationMessage, validateImageFile } from "@/lib/utils/files";
import { cn } from "@/lib/utils";
import { useState } from "react";

/** Panel de personalización: color, tamaño, corrección, logo y pie de texto. */
export function QrStylePanel({
  style,
  onChange,
}: {
  style: QrStyle;
  onChange: (patch: Partial<QrStyle>) => void;
}) {
  const [logoError, setLogoError] = useState<string | null>(null);

  async function handleLogo(file: File | undefined) {
    if (!file) return;
    const invalid = validateImageFile(file);
    if (invalid) {
      setLogoError(imageValidationMessage(invalid));
      return;
    }
    setLogoError(null);
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error("read"));
      reader.readAsDataURL(file);
    });
    onChange({
      logoDataUrl: dataUrl,
      logoEnabled: true,
      errorCorrection: style.errorCorrection === "L" || style.errorCorrection === "M"
        ? "Q"
        : style.errorCorrection,
    });
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <QrColorField
          id="qr-fg"
          label="Color del código"
          value={style.foreground}
          onChange={(foreground) => onChange({ foreground })}
        />
        <QrColorField
          id="qr-bg"
          label="Color de fondo"
          value={style.background}
          onChange={(background) => onChange({ background })}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <QrField label="Tamaño de descarga" htmlFor="qr-size">
          <select
            id="qr-size"
            value={style.size}
            onChange={(event) => onChange({ size: Number(event.target.value) })}
            className={cn(qrInputClass, "cursor-pointer")}
          >
            {QR_SIZES.map((size) => (
              <option key={size} value={size}>
                {size} × {size} px
              </option>
            ))}
          </select>
        </QrField>

        <QrRange
          id="qr-margin"
          label="Margen"
          min={0}
          max={8}
          value={style.margin}
          display={`${style.margin} módulos`}
          onChange={(margin) => onChange({ margin })}
        />
      </div>

      <QrSegmented<QrModuleStyle>
        label="Forma de los módulos"
        value={style.moduleStyle}
        onChange={(moduleStyle) => onChange({ moduleStyle })}
        options={QR_MODULE_STYLES}
        hint="Los ojos de las esquinas se mantienen cuadrados para no afectar la lectura."
      />

      <QrSegmented<QrErrorCorrection>
        label="Corrección de errores"
        value={style.errorCorrection}
        onChange={(errorCorrection) => onChange({ errorCorrection })}
        options={QR_ERROR_LEVELS.map((level) => ({ id: level.id, label: level.label }))}
        hint={`Un nivel mayor permite recuperar el QR si parte del código está dañada (recupera ${
          QR_ERROR_LEVELS.find((level) => level.id === style.errorCorrection)?.recovery ?? ""
        }).`}
      />

      <div className="rounded-xl border border-dashed border-[#171311]/15 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[0.82rem] font-semibold text-[#171311]">Logo en el centro</p>
            <p className="mt-1 text-[0.72rem] leading-snug text-[#6E6561]">
              PNG, JPG o WEBP hasta 2 MB. Se reserva un espacio blanco alrededor.
            </p>
          </div>
          {style.logoDataUrl ? (
            <label className="flex cursor-pointer items-center gap-2 text-[0.75rem] font-medium text-[#171311]">
              <input
                type="checkbox"
                checked={style.logoEnabled}
                onChange={(event) => onChange({ logoEnabled: event.target.checked })}
                className="size-4 accent-[#A61E22]"
              />
              Mostrar
            </label>
          ) : null}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          {style.logoDataUrl ? (
            <span className="flex size-12 items-center justify-center overflow-hidden rounded-lg border border-[#171311]/10 bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={style.logoDataUrl} alt="Logo cargado" className="max-h-10 w-auto" />
            </span>
          ) : null}

          <label className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-[#171311]/15 bg-white px-3 text-[0.78rem] font-medium text-[#171311] transition-colors hover:border-[#171311]/35 focus-within:ring-2 focus-within:ring-[#A61E22]/30">
            <Upload className="size-4" strokeWidth={1.8} aria-hidden />
            {style.logoDataUrl ? "Cambiar logo" : "Subir logo"}
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="sr-only"
              onChange={(event) => void handleLogo(event.target.files?.[0])}
            />
          </label>

          {style.logoDataUrl ? (
            <button
              type="button"
              onClick={() => onChange({ logoDataUrl: null, logoEnabled: false })}
              className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg px-3 text-[0.78rem] font-medium text-[#A61E22] transition-colors hover:bg-[#F6E3E0]"
            >
              <Trash2 className="size-4" strokeWidth={1.8} aria-hidden />
              Quitar
            </button>
          ) : null}
        </div>

        {logoError ? (
          <p role="alert" className="mt-2 text-[0.75rem] font-medium text-[#A61E22]">
            {logoError}
          </p>
        ) : null}

        {style.logoDataUrl && style.logoEnabled ? (
          <div className="mt-4">
            <QrRange
              id="qr-logo-scale"
              label="Tamaño del logo"
              min={10}
              max={30}
              value={Math.round(style.logoScale * 100)}
              display={`${Math.round(style.logoScale * 100)}% del código`}
              onChange={(next) => onChange({ logoScale: next / 100 })}
            />
          </div>
        ) : null}
      </div>

      <div className="space-y-4">
        <QrField
          label="Texto debajo del código (opcional)"
          htmlFor="qr-caption"
          hint="Ejemplo: “Escanea para ordenar”. Se dibuja fuera del código, sin taparlo."
        >
          <input
            id="qr-caption"
            value={style.caption}
            onChange={(event) => onChange({ caption: event.target.value.slice(0, 60) })}
            className={qrInputClass}
            maxLength={60}
            placeholder="Escanea para ver el menú"
          />
        </QrField>

        {style.caption.trim() ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <QrRange
              id="qr-caption-size"
              label="Tamaño del texto"
              min={12}
              max={32}
              value={style.captionSize}
              display={`${style.captionSize} px`}
              onChange={(captionSize) => onChange({ captionSize })}
            />
            <QrSegmented<QrCaptionAlign>
              label="Alineación"
              value={style.captionAlign}
              onChange={(captionAlign) => onChange({ captionAlign })}
              options={[
                { id: "left", label: "Izquierda" },
                { id: "center", label: "Centro" },
                { id: "right", label: "Derecha" },
              ]}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
