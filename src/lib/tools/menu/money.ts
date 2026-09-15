/** Formatea un precio con la moneda del negocio: "RD$450" o "RD$1,250.50". */
export function formatPrice(value: number, currency: string): string {
  if (!Number.isFinite(value)) return `${currency}0`;
  const rounded = Math.round(value * 100) / 100;
  const formatted = Number.isInteger(rounded)
    ? rounded.toLocaleString("es-DO")
    : rounded.toLocaleString("es-DO", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return `${currency}${formatted}`;
}

/**
 * Convierte lo que escribe el usuario en número.
 * Acepta "450", "RD$ 1,250.50", "1.250,50" y descarta negativos o texto.
 */
export function parsePrice(input: string): number {
  /* Un signo negativo delante invalida el precio, no se ignora. */
  if (/^\s*-/.test(input)) return 0;

  const digitsAndSeparators = input.replace(/[^\d.,]/g, "");
  if (!digitsAndSeparators) return 0;

  const lastComma = digitsAndSeparators.lastIndexOf(",");
  const lastDot = digitsAndSeparators.lastIndexOf(".");
  let normalized = digitsAndSeparators;

  if (lastComma >= 0 && lastDot >= 0) {
    /* El separador decimal es el último que aparece; el otro son miles. */
    const decimalSeparator = lastComma > lastDot ? "," : ".";
    const thousandsSeparator = decimalSeparator === "," ? "." : ",";
    normalized = digitsAndSeparators
      .split(thousandsSeparator)
      .join("")
      .replace(decimalSeparator, ".");
  } else if (lastComma >= 0 || lastDot >= 0) {
    const separator = lastComma >= 0 ? "," : ".";
    const index = lastComma >= 0 ? lastComma : lastDot;
    const decimals = digitsAndSeparators.length - index - 1;
    const isThousands = decimals === 3 && digitsAndSeparators.split(separator).length >= 2;
    normalized = isThousands
      ? digitsAndSeparators.split(separator).join("")
      : digitsAndSeparators.split(separator).join("").slice(0, index) +
        "." +
        digitsAndSeparators.slice(index + 1);
  }

  const value = Number.parseFloat(normalized);
  if (!Number.isFinite(value) || value < 0) return 0;
  return Math.round(value * 100) / 100;
}
