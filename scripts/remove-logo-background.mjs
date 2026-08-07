/**
 * Genera PNG con fondo transparente a partir del logo DevStudio.
 *
 * Uso:
 *   npm run logo:transparent              → quita fondo negro (Logo-Black.jpeg)
 *   npm run logo:transparent -- --white   → quita fondo blanco (Logo-DevStudio-source.png)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const contentDir = path.join(root, "public/DevStudio-Content");

const whiteMode = process.argv.includes("--white");

const INPUT = whiteMode
  ? path.join(contentDir, "Logo-DevStudio-source.png")
  : path.join(contentDir, "Logo-Black.jpeg");

const OUTPUT = whiteMode
  ? path.join(contentDir, "Logo-DevStudio.png")
  : path.join(contentDir, "Logo-Black.png");

/** Umbral para fondo negro */
const BLACK_THRESHOLD = 42;
const BLACK_FEATHER_MAX = 90;

/** Umbral para fondo blanco (luminancia alta → transparente) */
const WHITE_THRESHOLD = 248;
const WHITE_FEATHER_MIN = 220;

function luminance(r, g, b) {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function alphaForBlackBg(r, g, b) {
  const lum = luminance(r, g, b);
  if (lum <= BLACK_THRESHOLD) return 0;
  if (lum >= BLACK_FEATHER_MAX) return 255;
  return Math.round(((lum - BLACK_THRESHOLD) / (BLACK_FEATHER_MAX - BLACK_THRESHOLD)) * 255);
}

function alphaForWhiteBg(r, g, b, existingAlpha) {
  const lum = luminance(r, g, b);
  if (lum >= WHITE_THRESHOLD) return 0;
  if (lum <= WHITE_FEATHER_MIN) return existingAlpha;
  const t = (lum - WHITE_FEATHER_MIN) / (WHITE_THRESHOLD - WHITE_FEATHER_MIN);
  return Math.round(existingAlpha * (1 - t));
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
    const a = pixels[i + 3];
    pixels[i + 3] = whiteMode
      ? alphaForWhiteBg(r, g, b, a)
      : alphaForPixelBlack(r, g, b);
  }

  await sharp(pixels, { raw: { width, height, channels: 4 } })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(OUTPUT);

  console.log(`✓ Logo sin fondo guardado en:\n  ${OUTPUT}`);
  console.log(`  ${width}×${height}px · modo=${whiteMode ? "blanco" : "negro"}`);
}

function alphaForPixelBlack(r, g, b) {
  return alphaForBlackBg(r, g, b);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
