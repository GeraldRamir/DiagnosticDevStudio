export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

export const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

export type ImageValidationError = "type" | "size" | "empty";

export function validateImageFile(file: File): ImageValidationError | null {
  if (!file || file.size === 0) return "empty";
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type as (typeof ACCEPTED_IMAGE_TYPES)[number])) {
    return "type";
  }
  if (file.size > MAX_IMAGE_BYTES) return "size";
  return null;
}

export function imageValidationMessage(error: ImageValidationError): string {
  switch (error) {
    case "type":
      return "Solo se permiten imágenes JPG, PNG o WEBP.";
    case "size":
      return "Cada archivo debe pesar 2 MB o menos.";
    case "empty":
      return "El archivo está vacío.";
  }
}

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }
      reject(new Error("No se pudo leer el archivo."));
    };
    reader.onerror = () => reject(new Error("No se pudo leer el archivo."));
    reader.readAsDataURL(file);
  });
}
