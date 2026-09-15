import type { QrStyle } from "@/lib/tools/qr/types";

/**
 * Render propio sobre la matriz que devuelve `qrcode`.
 * Dibujamos módulo a módulo para poder aplicar estilo, logo y pie de texto
 * sin tocar la geometría del código (los ojos siempre quedan cuadrados).
 */

type Matrix = { size: number; get: (x: number, y: number) => boolean };

async function createMatrix(value: string, ecc: QrStyle["errorCorrection"]): Promise<Matrix> {
  const QRCode = (await import("qrcode")).default;
  const qr = QRCode.create(value, { errorCorrectionLevel: ecc });
  const size = qr.modules.size;
  const data = qr.modules.data;
  return {
    size,
    get: (x, y) => Boolean(data[y * size + x]),
  };
}

/** Los tres ojos ocupan 7x7 módulos en las esquinas. */
function isFinder(x: number, y: number, size: number): boolean {
  return (
    (x < 7 && y < 7) || (x >= size - 7 && y < 7) || (x < 7 && y >= size - 7)
  );
}

function captionBandHeight(style: QrStyle): number {
  return style.caption.trim() ? Math.round(style.captionSize * 2.4) : 0;
}

type Geometry = {
  matrix: Matrix;
  scale: number;
  qrSide: number;
  width: number;
  height: number;
  offset: number;
  band: number;
};

async function geometry(value: string, style: QrStyle): Promise<Geometry> {
  const matrix = await createMatrix(value, style.errorCorrection);
  const total = matrix.size + style.margin * 2;
  const scale = Math.max(1, Math.floor(style.size / total));
  const qrSide = total * scale;
  const band = captionBandHeight(style);
  return {
    matrix,
    scale,
    qrSide,
    width: qrSide,
    height: qrSide + band,
    offset: style.margin * scale,
    band,
  };
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("No se pudo cargar el logo."));
    image.src = src;
  });
}

function captionX(style: QrStyle, width: number): number {
  const pad = Math.round(width * 0.06);
  if (style.captionAlign === "left") return pad;
  if (style.captionAlign === "right") return width - pad;
  return width / 2;
}

/**
 * Canvas listo para exportar a PNG o JPG.
 * Se dibuja con escala entera (módulos nítidos) y luego se lleva
 * al tamaño exacto elegido por el usuario, sin suavizado.
 */
export async function renderQrCanvas(
  value: string,
  style: QrStyle,
): Promise<HTMLCanvasElement> {
  const geo = await geometry(value, style);
  const canvas = document.createElement("canvas");
  canvas.width = geo.width;
  canvas.height = geo.height;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas no disponible.");

  ctx.fillStyle = style.background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = style.foreground;

  const { matrix, scale, offset } = geo;
  const radius = scale * 0.32;

  for (let y = 0; y < matrix.size; y += 1) {
    for (let x = 0; x < matrix.size; x += 1) {
      if (!matrix.get(x, y)) continue;
      const px = offset + x * scale;
      const py = offset + y * scale;
      const finder = isFinder(x, y, matrix.size);

      if (finder || style.moduleStyle === "square") {
        ctx.fillRect(px, py, scale, scale);
        continue;
      }

      if (style.moduleStyle === "dots") {
        ctx.beginPath();
        ctx.arc(px + scale / 2, py + scale / 2, scale * 0.45, 0, Math.PI * 2);
        ctx.fill();
        continue;
      }

      ctx.beginPath();
      if (typeof ctx.roundRect === "function") {
        ctx.roundRect(px, py, scale, scale, radius);
      } else {
        ctx.rect(px, py, scale, scale);
      }
      ctx.fill();
    }
  }

  if (style.logoEnabled && style.logoDataUrl) {
    const image = await loadImage(style.logoDataUrl);
    const logoSide = Math.round(geo.qrSide * style.logoScale);
    const x = (geo.width - logoSide) / 2;
    const y = (geo.qrSide - logoSide) / 2;
    const pad = Math.round(logoSide * 0.12);

    ctx.fillStyle = style.background;
    ctx.beginPath();
    if (typeof ctx.roundRect === "function") {
      ctx.roundRect(x - pad, y - pad, logoSide + pad * 2, logoSide + pad * 2, pad * 1.4);
    } else {
      ctx.rect(x - pad, y - pad, logoSide + pad * 2, logoSide + pad * 2);
    }
    ctx.fill();
    ctx.drawImage(image, x, y, logoSide, logoSide);
  }

  const caption = style.caption.trim();
  if (caption && geo.band) {
    const fontSize = Math.round((style.captionSize / 512) * geo.qrSide);
    ctx.fillStyle = style.foreground;
    ctx.font = `600 ${fontSize}px Inter, system-ui, sans-serif`;
    ctx.textAlign = style.captionAlign === "center" ? "center" : style.captionAlign;
    ctx.textBaseline = "middle";
    ctx.fillText(
      caption,
      captionX(style, geo.width),
      geo.qrSide + geo.band / 2,
      geo.width * 0.9,
    );
  }

  if (geo.width === style.size) return canvas;

  const scaled = document.createElement("canvas");
  const ratio = style.size / geo.width;
  scaled.width = style.size;
  scaled.height = Math.round(geo.height * ratio);
  const scaledCtx = scaled.getContext("2d");
  if (!scaledCtx) return canvas;
  scaledCtx.imageSmoothingEnabled = false;
  scaledCtx.fillStyle = style.background;
  scaledCtx.fillRect(0, 0, scaled.width, scaled.height);
  scaledCtx.drawImage(canvas, 0, 0, scaled.width, scaled.height);
  return scaled;
}

export async function renderQrDataUrl(
  value: string,
  style: QrStyle,
  mime: "image/png" | "image/jpeg" = "image/png",
): Promise<string> {
  const canvas = await renderQrCanvas(value, style);
  return canvas.toDataURL(mime, mime === "image/jpeg" ? 0.92 : undefined);
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** SVG vectorial con la misma geometría que el canvas. */
export async function renderQrSvg(value: string, style: QrStyle): Promise<string> {
  const geo = await geometry(value, style);
  const { matrix, scale, offset } = geo;
  const radius = (scale * 0.32).toFixed(2);
  const parts: string[] = [];

  for (let y = 0; y < matrix.size; y += 1) {
    for (let x = 0; x < matrix.size; x += 1) {
      if (!matrix.get(x, y)) continue;
      const px = offset + x * scale;
      const py = offset + y * scale;
      const finder = isFinder(x, y, matrix.size);

      if (!finder && style.moduleStyle === "dots") {
        parts.push(
          `<circle cx="${px + scale / 2}" cy="${py + scale / 2}" r="${(scale * 0.45).toFixed(2)}"/>`,
        );
        continue;
      }

      const rx = !finder && style.moduleStyle === "rounded" ? ` rx="${radius}"` : "";
      parts.push(`<rect x="${px}" y="${py}" width="${scale}" height="${scale}"${rx}/>`);
    }
  }

  let overlay = "";
  if (style.logoEnabled && style.logoDataUrl) {
    const logoSide = Math.round(geo.qrSide * style.logoScale);
    const x = (geo.width - logoSide) / 2;
    const y = (geo.qrSide - logoSide) / 2;
    const pad = Math.round(logoSide * 0.12);
    overlay += `<rect x="${x - pad}" y="${y - pad}" width="${logoSide + pad * 2}" height="${
      logoSide + pad * 2
    }" rx="${pad * 1.4}" fill="${style.background}"/>`;
    overlay += `<image x="${x}" y="${y}" width="${logoSide}" height="${logoSide}" href="${style.logoDataUrl}" preserveAspectRatio="xMidYMid meet"/>`;
  }

  const caption = style.caption.trim();
  if (caption && geo.band) {
    const fontSize = Math.round((style.captionSize / 512) * geo.qrSide);
    const anchor =
      style.captionAlign === "left" ? "start" : style.captionAlign === "right" ? "end" : "middle";
    overlay += `<text x="${captionX(style, geo.width)}" y="${
      geo.qrSide + geo.band / 2
    }" fill="${style.foreground}" font-family="Inter, system-ui, sans-serif" font-size="${fontSize}" font-weight="600" text-anchor="${anchor}" dominant-baseline="middle">${escapeXml(
      caption,
    )}</text>`;
  }

  const ratio = style.size / geo.width;
  const outWidth = style.size;
  const outHeight = Math.round(geo.height * ratio);

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${outWidth}" height="${outHeight}" viewBox="0 0 ${geo.width} ${geo.height}" shape-rendering="crispEdges">`,
    `<rect width="${geo.width}" height="${geo.height}" fill="${style.background}"/>`,
    `<g fill="${style.foreground}">${parts.join("")}</g>`,
    overlay,
    `</svg>`,
  ].join("");
}
