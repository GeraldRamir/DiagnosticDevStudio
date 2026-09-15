import { imageValidationMessage, validateImageFile } from "@/lib/utils/files";

/**
 * Capa de imágenes del menú.
 * Hoy comprime en el navegador y guarda un data URL; el día que exista
 * almacenamiento externo (S3, Cloudinary) solo cambia `storeImage`.
 */

export type ImageSlot = "logo" | "product" | "cover";

const MAX_SIDE: Record<ImageSlot, number> = {
  logo: 320,
  product: 720,
  cover: 1200,
};

const QUALITY: Record<ImageSlot, number> = {
  logo: 0.9,
  product: 0.78,
  cover: 0.75,
};

export type ImageResult = { ok: true; dataUrl: string } | { ok: false; error: string };

function loadImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("No se pudo leer la imagen."));
    image.src = dataUrl;
  });
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("No se pudo leer el archivo."));
    reader.readAsDataURL(file);
  });
}

/**
 * Redimensiona y comprime antes de guardar: localStorage no aguanta
 * fotos de 4 MB y el menú público debe cargar rápido en datos móviles.
 */
export async function storeImage(file: File, slot: ImageSlot): Promise<ImageResult> {
  const invalid = validateImageFile(file);
  if (invalid) return { ok: false, error: imageValidationMessage(invalid) };

  try {
    const original = await readAsDataUrl(file);
    const image = await loadImage(original);
    const maxSide = MAX_SIDE[slot];
    const scale = Math.min(1, maxSide / Math.max(image.width, image.height));

    if (scale === 1 && original.length < 120_000) {
      return { ok: true, dataUrl: original };
    }

    const canvas = document.createElement("canvas");
    canvas.width = Math.round(image.width * scale);
    canvas.height = Math.round(image.height * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) return { ok: true, dataUrl: original };

    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    /* PNG con transparencia (logos) se conserva; el resto va a JPEG. */
    const keepsAlpha = file.type === "image/png" && slot === "logo";
    const dataUrl = keepsAlpha
      ? canvas.toDataURL("image/png")
      : canvas.toDataURL("image/jpeg", QUALITY[slot]);

    return { ok: true, dataUrl };
  } catch {
    return { ok: false, error: "No pudimos procesar esa imagen. Prueba con otra." };
  }
}
