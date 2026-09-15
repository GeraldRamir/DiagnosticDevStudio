import { nanoid } from "nanoid";
import {
  DEFAULT_BUSINESS,
  DEFAULT_STATS,
  DEFAULT_THEME,
  DEFAULT_VISIBILITY,
} from "@/lib/tools/menu/defaults";
import { uniqueSlug } from "@/lib/tools/menu/slug";
import type { DigitalMenu, MenuCategory, MenuProduct } from "@/lib/tools/menu/types";

const STORAGE_KEY = "dst.menus.v2";

/** El navegador se quedó sin espacio: normalmente por fotos muy pesadas. */
export class MenuStorageFullError extends Error {
  constructor() {
    super("El almacenamiento del navegador está lleno.");
    this.name = "MenuStorageFullError";
  }
}

/**
 * Repositorio de menús. Hoy escribe en localStorage; la interfaz es la misma
 * que necesitaría una API, así que el editor no cambia cuando exista backend.
 */
export interface MenuRepository {
  list(): DigitalMenu[];
  get(id: string): DigitalMenu | null;
  getBySlug(slug: string): DigitalMenu | null;
  save(menu: DigitalMenu): DigitalMenu;
  create(name: string): DigitalMenu;
  duplicate(id: string): DigitalMenu | null;
  remove(id: string): void;
}

function read(): DigitalMenu[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is DigitalMenu =>
        typeof item === "object" && item !== null && "id" in item && "slug" in item,
    );
  } catch {
    return [];
  }
}

function write(menus: DigitalMenu[]): DigitalMenu[] {
  if (typeof window === "undefined") return menus;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(menus));
  } catch {
    /* Cuota llena: el menú sigue en memoria durante la sesión. */
  }
  return menus;
}

export function createEmptyMenu(name: string, existingSlugs: string[]): DigitalMenu {
  const now = new Date().toISOString();
  return {
    id: nanoid(10),
    slug: uniqueSlug(name || "menu", existingSlugs),
    name: name.trim() || "Menú principal",
    status: "draft",
    business: { ...DEFAULT_BUSINESS, schedule: DEFAULT_BUSINESS.schedule.map((d) => ({ ...d })) },
    categories: [],
    products: [],
    theme: { ...DEFAULT_THEME },
    settings: { ...DEFAULT_VISIBILITY },
    stats: { ...DEFAULT_STATS, productViews: {} },
    createdAt: now,
    updatedAt: now,
    publishedAt: null,
  };
}

export const menuRepository: MenuRepository = {
  list() {
    return read().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  },

  get(id) {
    return read().find((menu) => menu.id === id) ?? null;
  },

  getBySlug(slug) {
    return read().find((menu) => menu.slug === slug) ?? null;
  },

  save(menu) {
    const menus = read();
    const index = menus.findIndex((item) => item.id === menu.id);
    const next: DigitalMenu = { ...menu, updatedAt: new Date().toISOString() };
    if (index >= 0) menus[index] = next;
    else menus.unshift(next);
    write(menus);
    return next;
  },

  create(name) {
    const menus = read();
    const menu = createEmptyMenu(
      name,
      menus.map((item) => item.slug),
    );
    write([menu, ...menus]);
    return menu;
  },

  duplicate(id) {
    const menus = read();
    const source = menus.find((item) => item.id === id);
    if (!source) return null;
    const now = new Date().toISOString();
    const copy: DigitalMenu = {
      ...structuredClone(source),
      id: nanoid(10),
      name: `${source.name} (copia)`,
      slug: uniqueSlug(
        `${source.business.name || source.name}`,
        menus.map((item) => item.slug),
      ),
      status: "draft",
      publishedAt: null,
      stats: { ...DEFAULT_STATS, productViews: {} },
      createdAt: now,
      updatedAt: now,
    };
    write([copy, ...menus]);
    return copy;
  },

  remove(id) {
    write(read().filter((menu) => menu.id !== id));
  },
};

/* ── Helpers de contenido ───────────────────────────────────────── */

export function createCategory(name: string, order: number): MenuCategory {
  return { id: nanoid(8), name: name.trim(), icon: "", order, visible: true };
}

export function createProduct(categoryId: string, order: number): MenuProduct {
  return {
    id: nanoid(8),
    name: "",
    description: "",
    price: 0,
    compareAtPrice: 0,
    image: null,
    categoryId,
    tags: [],
    prepTime: 0,
    servings: "",
    calories: 0,
    allergens: [],
    sku: "",
    available: true,
    featured: false,
    variants: [],
    addons: [],
    order,
  };
}

/** Reordena un arreglo moviendo un elemento de una posición a otra. */
export function moveItem<T>(items: T[], from: number, to: number): T[] {
  if (to < 0 || to >= items.length || from === to) return items;
  const next = [...items];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
}

export function reindex<T extends { order: number }>(items: T[]): T[] {
  return items.map((item, index) => ({ ...item, order: index }));
}
