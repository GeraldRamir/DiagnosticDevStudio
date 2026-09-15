import type { QrStyle } from "@/lib/tools/qr/types";

export type ScanStatus = "ok" | "warn";

export type ScanReport = {
  status: ScanStatus;
  /** Avisos concretos y accionables; vacío cuando todo está bien. */
  warnings: string[];
  contrast: number;
};

/** Área máxima que puede tapar el logo según el nivel de corrección. */
const MAX_LOGO_SCALE: Record<QrStyle["errorCorrection"], number> = {
  L: 0.1,
  M: 0.15,
  Q: 0.2,
  H: 0.25,
};

function channel(value: number): number {
  const c = value / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string): number {
  const normalized = hex.replace("#", "");
  const full =
    normalized.length === 3
      ? normalized
          .split("")
          .map((char) => char + char)
          .join("")
      : normalized;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  if ([r, g, b].some(Number.isNaN)) return 0;
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/** Relación de contraste WCAG entre los dos colores del código. */
export function contrastRatio(foreground: string, background: string): number {
  const a = luminance(foreground);
  const b = luminance(background);
  const light = Math.max(a, b);
  const dark = Math.min(a, b);
  return (light + 0.05) / (dark + 0.05);
}

/**
 * Evalúa si la personalización puede comprometer el escaneo.
 * Es orientativo: apunta a las causas habituales de un QR que no lee.
 */
export function evaluateScannability(input: {
  style: QrStyle;
  valueLength: number;
}): ScanReport {
  const { style, valueLength } = input;
  const warnings: string[] = [];
  const contrast = contrastRatio(style.foreground, style.background);

  if (contrast < 3) {
    warnings.push(
      "El contraste entre los colores es muy bajo. Usa un color oscuro sobre fondo claro.",
    );
  } else if (contrast < 5) {
    warnings.push("El contraste es justo. Un color más oscuro se lee mejor en impresión.");
  }

  if (luminance(style.foreground) > luminance(style.background)) {
    warnings.push(
      "El color del código es más claro que el fondo. Muchos lectores no leen códigos invertidos.",
    );
  }

  if (style.logoEnabled && style.logoDataUrl) {
    const max = MAX_LOGO_SCALE[style.errorCorrection];
    if (style.logoScale > max) {
      warnings.push(
        `Tu logo es demasiado grande para el nivel ${style.errorCorrection}. Redúcelo o sube la corrección de errores.`,
      );
    }
    if (style.errorCorrection === "L" || style.errorCorrection === "M") {
      warnings.push("Con logo conviene usar corrección Q o H para no perder legibilidad.");
    }
  }

  if (style.margin < 2) {
    warnings.push("Deja al menos 2 módulos de margen para que el lector encuentre el código.");
  }

  if (style.moduleStyle === "dots" && style.errorCorrection === "L") {
    warnings.push("El estilo de puntos con corrección L es frágil. Sube a M o Q.");
  }

  if (valueLength > 900) {
    warnings.push(
      "El contenido es muy largo: el código queda denso y cuesta escanearlo desde lejos.",
    );
  }

  return {
    status: warnings.length ? "warn" : "ok",
    warnings,
    contrast,
  };
}
