import type { DigitalMenu, MenuProduct } from "@/lib/tools/menu/types";

export type FieldErrors = Record<string, string>;

const INSTAGRAM_RE = /^[a-z0-9._]{1,30}$/i;
const URL_RE = /^https?:\/\/.+\..+/i;

export function normalizeInstagram(value: string): string {
  return value
    .trim()
    .replace(/^https?:\/\/(www\.)?instagram\.com\//i, "")
    .replace(/^@/, "")
    .replace(/\/+$/, "");
}

export function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

/** Valida los datos del negocio (paso 1 del editor). */
export function validateBusiness(menu: DigitalMenu): FieldErrors {
  const errors: FieldErrors = {};
  const { business } = menu;

  if (!business.name.trim()) {
    errors.name = "Escribe el nombre de tu negocio.";
  }

  if (business.whatsapp.trim()) {
    const digits = digitsOnly(business.whatsapp);
    if (digits.length < 8) errors.whatsapp = "Incluye el código de país, por ejemplo 1809…";
  }

  if (business.phone.trim() && digitsOnly(business.phone).length < 7) {
    errors.phone = "Ese teléfono parece incompleto.";
  }

  if (business.instagram.trim() && !INSTAGRAM_RE.test(normalizeInstagram(business.instagram))) {
    errors.instagram = "Usuario inválido: solo letras, números, punto y guion bajo.";
  }

  if (business.mapsUrl.trim() && !URL_RE.test(business.mapsUrl.trim())) {
    errors.mapsUrl = "Pega el enlace completo de Google Maps.";
  }

  return errors;
}

/** Valida un producto del editor. */
export function validateProduct(product: MenuProduct): FieldErrors {
  const errors: FieldErrors = {};

  if (!product.name.trim()) errors.name = "El producto necesita un nombre.";
  if (!product.categoryId) errors.categoryId = "Elige una categoría.";
  if (product.price < 0) errors.price = "El precio no puede ser negativo.";
  if (product.variants.length > 0) {
    if (product.variants.some((variant) => !variant.name.trim())) {
      errors.variants = "Cada variante necesita un nombre.";
    } else if (product.variants.some((variant) => variant.price < 0)) {
      errors.variants = "Los precios de las variantes no pueden ser negativos.";
    }
  }

  return errors;
}

/** Requisitos mínimos para publicar el menú. */
export function publishChecklist(menu: DigitalMenu): { label: string; done: boolean }[] {
  const visibleCategories = menu.categories.filter((category) => category.visible);
  return [
    { label: "Nombre del negocio", done: Boolean(menu.business.name.trim()) },
    { label: "Al menos una categoría", done: visibleCategories.length > 0 },
    { label: "Al menos un producto", done: menu.products.length > 0 },
    {
      label: "Un canal de contacto (WhatsApp, teléfono o dirección)",
      done: Boolean(
        menu.business.whatsapp.trim() ||
          menu.business.phone.trim() ||
          menu.business.address.trim(),
      ),
    },
  ];
}

export function canPublish(menu: DigitalMenu): boolean {
  return publishChecklist(menu).every((item) => item.done);
}

export function hasErrors(errors: FieldErrors): boolean {
  return Object.keys(errors).length > 0;
}
