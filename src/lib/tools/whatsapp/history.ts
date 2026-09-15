export type WhatsappHistoryEntry = {
  id: string;
  name: string;
  countryId: string;
  countryCode: string;
  phone: string;
  message: string;
  url: string;
  createdAt: string;
};

const STORAGE_KEY = "dst.whatsapp.links.v1";
const MAX_ENTRIES = 20;

function createId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `wa-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function readStorage(): WhatsappHistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is WhatsappHistoryEntry =>
        typeof item === "object" &&
        item !== null &&
        "id" in item &&
        "url" in item &&
        "phone" in item,
    );
  } catch {
    return [];
  }
}

function writeStorage(entries: WhatsappHistoryEntry[]): WhatsappHistoryEntry[] {
  if (typeof window === "undefined") return entries;
  const trimmed = entries.slice(0, MAX_ENTRIES);
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    /* Cuota llena o modo privado: el historial no persiste. */
  }
  return trimmed;
}

export function listWhatsappHistory(): WhatsappHistoryEntry[] {
  return readStorage();
}

export function saveWhatsappLink(input: {
  id?: string | null;
  name: string;
  countryId: string;
  countryCode: string;
  phone: string;
  message: string;
  url: string;
}): WhatsappHistoryEntry[] {
  const entries = readStorage();
  const now = new Date().toISOString();
  const existingIndex = input.id ? entries.findIndex((item) => item.id === input.id) : -1;
  const sameUrl = entries.findIndex((item) => item.url === input.url && existingIndex < 0);

  const entry: WhatsappHistoryEntry = {
    id:
      input.id && existingIndex >= 0
        ? input.id
        : sameUrl >= 0
          ? entries[sameUrl].id
          : createId(),
    name: input.name.trim() || "WhatsApp",
    countryId: input.countryId,
    countryCode: input.countryCode,
    phone: input.phone,
    message: input.message,
    url: input.url,
    createdAt: existingIndex >= 0 ? entries[existingIndex].createdAt : now,
  };

  const index = entries.findIndex((item) => item.id === entry.id);
  if (index >= 0) entries.splice(index, 1);
  entries.unshift(entry);
  return writeStorage(entries);
}

export function removeWhatsappLink(id: string): WhatsappHistoryEntry[] {
  return writeStorage(readStorage().filter((item) => item.id !== id));
}
