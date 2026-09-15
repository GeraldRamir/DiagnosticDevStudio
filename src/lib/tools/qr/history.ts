import type { QrFormValues, QrHistoryEntry, QrStyle, QrType } from "@/lib/tools/qr/types";

const STORAGE_KEY = "dst.qr.history.v1";
const MAX_ENTRIES = 30;
/** Un logo muy pesado llenaría el localStorage: se guarda la config sin la imagen. */
const MAX_LOGO_CHARS = 120_000;

function readStorage(): QrHistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is QrHistoryEntry =>
        typeof item === "object" && item !== null && "id" in item && "type" in item,
    );
  } catch {
    return [];
  }
}

function writeStorage(entries: QrHistoryEntry[]): QrHistoryEntry[] {
  if (typeof window === "undefined") return entries;
  const trimmed = entries.slice(0, MAX_ENTRIES);
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    /* Cuota llena o modo privado: el historial simplemente no persiste. */
  }
  return trimmed;
}

function lightStyle(style: QrStyle): QrStyle {
  if (style.logoDataUrl && style.logoDataUrl.length > MAX_LOGO_CHARS) {
    return { ...style, logoDataUrl: null, logoEnabled: false };
  }
  return style;
}

function createId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `qr-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

export function listHistory(): QrHistoryEntry[] {
  return readStorage().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function saveEntry(input: {
  id?: string | null;
  name: string;
  type: QrType;
  value: string;
  form: QrFormValues;
  style: QrStyle;
}): QrHistoryEntry[] {
  const entries = readStorage();
  const now = new Date().toISOString();
  const existingIndex = input.id ? entries.findIndex((item) => item.id === input.id) : -1;

  const entry: QrHistoryEntry = {
    id: input.id && existingIndex >= 0 ? input.id : createId(),
    name: input.name.trim() || "Código sin nombre",
    type: input.type,
    value: input.value,
    form: input.form,
    style: lightStyle(input.style),
    createdAt: existingIndex >= 0 ? entries[existingIndex].createdAt : now,
    updatedAt: now,
  };

  if (existingIndex >= 0) {
    entries[existingIndex] = entry;
  } else {
    entries.unshift(entry);
  }

  return writeStorage(entries).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function duplicateEntry(id: string): QrHistoryEntry[] {
  const entries = readStorage();
  const source = entries.find((item) => item.id === id);
  if (!source) return listHistory();
  const now = new Date().toISOString();
  entries.unshift({
    ...source,
    id: createId(),
    name: `${source.name} (copia)`,
    createdAt: now,
    updatedAt: now,
  });
  return writeStorage(entries);
}

export function removeEntry(id: string): QrHistoryEntry[] {
  return writeStorage(readStorage().filter((item) => item.id !== id));
}

export function clearHistory(): QrHistoryEntry[] {
  return writeStorage([]);
}

/** "Hace 2 días" para la lista del historial. */
export function relativeTime(iso: string): string {
  const date = new Date(iso).getTime();
  if (Number.isNaN(date)) return "";
  const diff = Date.now() - date;
  const minutes = Math.round(diff / 60000);
  if (minutes < 1) return "Hace un momento";
  if (minutes < 60) return `Hace ${minutes} min`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `Hace ${hours} h`;
  const days = Math.round(hours / 24);
  if (days === 1) return "Hace 1 día";
  if (days < 30) return `Hace ${days} días`;
  const months = Math.round(days / 30);
  return months === 1 ? "Hace 1 mes" : `Hace ${months} meses`;
}
