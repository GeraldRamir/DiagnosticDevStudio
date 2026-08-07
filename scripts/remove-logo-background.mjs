/**
 * Quita el fondo negro del logo DevStudio y genera PNG con transparencia.
 *
 * Uso: npm run logo:transparent
 * Entrada: public/DevStudio-Content/Logo-Black.jpeg
 * Salida:  public/DevStudio-Content/Logo-Black.png
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const INPUT = path.join(root, "public/DevStudio-Content/Logo-Black.jpeg");
const OUTPUT = path.join(root, "public/DevStudio-Content/Logo-Black.png");

/** Píxeles con luminancia por debajo de este umbral → transparentes */
const BLACK_THRESHOLD = 42;

/** Suaviza el borde alpha en píxeles grises intermedios */
const FEATHER_MAX = 90;

function luminance(r, g, b) {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function alphaForPixel(r, g, b) {
  const lum = luminance(r, g, b);
  if (lum <= BLACK_THRESHOLD) return 0;
  if (lum >= FEATHER_MAX) return 255;
  return Math.round(((lum - BLACK_THRESHOLD) / (FEATHER_MAX - BLACK_THRESHOLD)) * 255);
}

async function main() {
  if (!fs.existsSync(INPUT)) {
    console.error(`No se encontró: ${INPUT}`);
    process.exit(1);
  }

  const { data, info } = await sharp(INPUT)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const pixels = Buffer.from(data);

  for (let i = 0; i < pixels.length; i += channels) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    pixels[i + 3] = alphaForPixel(r, g, b);
  }

  await sharp(pixels, { raw: { width, height, channels: 4 } })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(OUTPUT);

  console.log(`✓ Logo sin fondo guardado en:\n  ${OUTPUT}`);
  console.log(`  ${width}×${height}px · umbral negro=${BLACK_THRESHOLD}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
