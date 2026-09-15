import { parsePrice } from "@/lib/tools/menu/money";

/**
 * Importación rápida de productos.
 * Acepta una línea por producto con separadores comunes:
 *   Classic Burger | RD$450
 *   Classic Burger, 450, Carne y queso
 *   Classic Burger; 450
 * También sirve para pegar un CSV simple exportado de una hoja de cálculo.
 */
export type ParsedProduct = {
  name: string;
  price: number;
  description: string;
};

const SEPARATORS = /[|;\t]|,(?=\s*[A-Za-z]*\s*\$?\d)/;

export function parseQuickImport(input: string): ParsedProduct[] {
  return input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split(SEPARATORS).map((part) => part.trim());
      const [name, price, description] = parts;
      return {
        name: (name ?? "").slice(0, 80),
        price: price ? parsePrice(price) : 0,
        description: (description ?? "").slice(0, 160),
      };
    })
    .filter((product) => product.name.length > 0)
    .slice(0, 100);
}
