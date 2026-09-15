import { renderQrCanvas, renderQrSvg } from "@/lib/tools/qr/render";
import type { QrStyle } from "@/lib/tools/qr/types";

export type QrDownloadFormat = "png" | "svg" | "jpg";

/** Convierte el nombre del QR en un nombre de archivo seguro. */
export function toFileName(name: string, format: QrDownloadFormat): string {
  const slug =
    name
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48) || "codigo-qr";
  return `${slug}.${format}`;
}

function triggerDownload(href: string, filename: string, revoke = false): void {
  const anchor = document.createElement("a");
  anchor.href = href;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  if (revoke) URL.revokeObjectURL(href);
}

/**
 * Genera el archivo real desde la configuración actual (no es una captura del DOM):
 * PNG y JPG se rasterizan en canvas, SVG se serializa como vector.
 */
export async function downloadQr(input: {
  value: string;
  style: QrStyle;
  name: string;
  format: QrDownloadFormat;
}): Promise<void> {
  const filename = toFileName(input.name, input.format);

  if (input.format === "svg") {
    const svg = await renderQrSvg(input.value, input.style);
    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    triggerDownload(URL.createObjectURL(blob), filename, true);
    return;
  }

  const canvas = await renderQrCanvas(input.value, input.style);
  const mime = input.format === "jpg" ? "image/jpeg" : "image/png";
  const dataUrl = canvas.toDataURL(mime, input.format === "jpg" ? 0.92 : undefined);
  triggerDownload(dataUrl, filename);
}

/** Copia la imagen al portapapeles. Devuelve false si el navegador no lo permite. */
export async function copyQrImage(value: string, style: QrStyle): Promise<boolean> {
  try {
    if (typeof ClipboardItem === "undefined" || !navigator.clipboard?.write) return false;
    const canvas = await renderQrCanvas(value, style);
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((result) => resolve(result), "image/png"),
    );
    if (!blob) return false;
    await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
    return true;
  } catch {
    return false;
  }
}

/** Comparte el PNG con la Web Share API cuando el dispositivo lo soporta. */
export async function shareQrImage(input: {
  value: string;
  style: QrStyle;
  name: string;
}): Promise<"shared" | "unsupported" | "cancelled"> {
  if (typeof navigator === "undefined" || typeof navigator.share !== "function") {
    return "unsupported";
  }

  try {
    const canvas = await renderQrCanvas(input.value, input.style);
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((result) => resolve(result), "image/png"),
    );

    if (blob && typeof File === "function") {
      const file = new File([blob], toFileName(input.name, "png"), { type: "image/png" });
      const data: ShareData = { files: [file], title: input.name };
      if (!navigator.canShare || navigator.canShare(data)) {
        await navigator.share(data);
        return "shared";
      }
    }

    await navigator.share({ title: input.name, text: input.value });
    return "shared";
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") return "cancelled";
    return "unsupported";
  }
}
