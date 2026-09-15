"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { uniqueSlug } from "@/lib/tools/menu/slug";
import {
  createCategory,
  createProduct,
  menuRepository,
  moveItem,
  reindex,
} from "@/lib/tools/menu/storage";
import type {
  DigitalMenu,
  MenuBusiness,
  MenuCategory,
  MenuProduct,
  MenuStatus,
  MenuTheme,
  MenuVisibility,
} from "@/lib/tools/menu/types";

export type SaveState = "idle" | "saving" | "saved" | "error";

/**
 * Estado del editor con guardado automático.
 * Toda mutación actualiza el menú en memoria y programa la escritura en el repositorio.
 */
export function useMenuEditor(menuId: string) {
  const [menu, setMenu] = useState<DigitalMenu | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const saveTimer = useRef<number | null>(null);
  const savedTimer = useRef<number | null>(null);

  useEffect(() => {
    setMenu(menuRepository.get(menuId));
    setLoading(false);
  }, [menuId]);

  useEffect(() => {
    return () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
      if (savedTimer.current) window.clearTimeout(savedTimer.current);
    };
  }, []);

  /** Aplica un cambio y programa el guardado (debounce de 600 ms). */
  const update = useCallback((updater: (current: DigitalMenu) => DigitalMenu) => {
    setMenu((current) => {
      if (!current) return current;
      const next = updater(current);

      setSaveState("saving");
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
      saveTimer.current = window.setTimeout(() => {
        try {
          menuRepository.save(next);
          setSaveState("saved");
          if (savedTimer.current) window.clearTimeout(savedTimer.current);
          savedTimer.current = window.setTimeout(() => setSaveState("idle"), 2200);
        } catch {
          /* Sin espacio en el navegador: el cambio vive en memoria, no en disco. */
          setSaveState("error");
        }
      }, 600);

      return next;
    });
  }, []);

  /* ── Negocio, tema y visibilidad ─────────────────────────────── */

  const updateBusiness = useCallback(
    (patch: Partial<MenuBusiness>) =>
      update((current) => ({ ...current, business: { ...current.business, ...patch } })),
    [update],
  );

  const updateTheme = useCallback(
    (patch: Partial<MenuTheme>) =>
      update((current) => ({ ...current, theme: { ...current.theme, ...patch } })),
    [update],
  );

  const updateSettings = useCallback(
    (patch: Partial<MenuVisibility>) =>
      update((current) => ({ ...current, settings: { ...current.settings, ...patch } })),
    [update],
  );

  const rename = useCallback(
    (name: string) => update((current) => ({ ...current, name })),
    [update],
  );

  /* ── Categorías ──────────────────────────────────────────────── */

  const addCategory = useCallback(
    (name: string) =>
      update((current) => ({
        ...current,
        categories: [...current.categories, createCategory(name, current.categories.length)],
      })),
    [update],
  );

  const updateCategory = useCallback(
    (id: string, patch: Partial<MenuCategory>) =>
      update((current) => ({
        ...current,
        categories: current.categories.map((category) =>
          category.id === id ? { ...category, ...patch } : category,
        ),
      })),
    [update],
  );

  const removeCategory = useCallback(
    (id: string) =>
      update((current) => ({
        ...current,
        categories: reindex(current.categories.filter((category) => category.id !== id)),
        products: current.products.filter((product) => product.categoryId !== id),
      })),
    [update],
  );

  const moveCategory = useCallback(
    (id: string, direction: -1 | 1) =>
      update((current) => {
        const sorted = [...current.categories].sort((a, b) => a.order - b.order);
        const index = sorted.findIndex((category) => category.id === id);
        if (index < 0) return current;
        return { ...current, categories: reindex(moveItem(sorted, index, index + direction)) };
      }),
    [update],
  );

  /* ── Productos ───────────────────────────────────────────────── */

  const addProduct = useCallback(
    (categoryId: string): MenuProduct | null => {
      let created: MenuProduct | null = null;
      update((current) => {
        created = createProduct(categoryId, current.products.length);
        return { ...current, products: [...current.products, created] };
      });
      return created;
    },
    [update],
  );

  const addProducts = useCallback(
    (products: Omit<MenuProduct, "id" | "order">[], categoryId: string) =>
      update((current) => {
        const created = products.map((product, index) => ({
          ...createProduct(categoryId, current.products.length + index),
          ...product,
          categoryId,
          order: current.products.length + index,
        }));
        return { ...current, products: [...current.products, ...created] };
      }),
    [update],
  );

  const updateProduct = useCallback(
    (id: string, patch: Partial<MenuProduct>) =>
      update((current) => ({
        ...current,
        products: current.products.map((product) =>
          product.id === id ? { ...product, ...patch } : product,
        ),
      })),
    [update],
  );

  const removeProduct = useCallback(
    (id: string) =>
      update((current) => ({
        ...current,
        products: reindex(current.products.filter((product) => product.id !== id)),
      })),
    [update],
  );

  const moveProduct = useCallback(
    (id: string, direction: -1 | 1) =>
      update((current) => {
        const product = current.products.find((item) => item.id === id);
        if (!product) return current;
        const siblings = current.products
          .filter((item) => item.categoryId === product.categoryId)
          .sort((a, b) => a.order - b.order);
        const index = siblings.findIndex((item) => item.id === id);
        const reordered = moveItem(siblings, index, index + direction);
        const others = current.products.filter((item) => item.categoryId !== product.categoryId);
        return { ...current, products: reindex([...others, ...reordered]) };
      }),
    [update],
  );

  /* ── Publicación ─────────────────────────────────────────────── */

  const setStatus = useCallback(
    (status: MenuStatus) =>
      update((current) => ({
        ...current,
        status,
        publishedAt:
          status === "published" ? (current.publishedAt ?? new Date().toISOString()) : current.publishedAt,
      })),
    [update],
  );

  const updateSlug = useCallback(
    (value: string) =>
      update((current) => {
        const taken = menuRepository
          .list()
          .filter((item) => item.id !== current.id)
          .map((item) => item.slug);
        return { ...current, slug: uniqueSlug(value || current.name, taken) };
      }),
    [update],
  );

  /** Guarda de inmediato (por ejemplo antes de abrir la vista pública). */
  const flush = useCallback(() => {
    if (!menu) return;
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    try {
      menuRepository.save(menu);
      setSaveState("saved");
    } catch {
      setSaveState("error");
    }
  }, [menu]);

  const productsByCategory = useMemo(() => {
    const map = new Map<string, MenuProduct[]>();
    if (!menu) return map;
    for (const product of [...menu.products].sort((a, b) => a.order - b.order)) {
      const list = map.get(product.categoryId) ?? [];
      list.push(product);
      map.set(product.categoryId, list);
    }
    return map;
  }, [menu]);

  return {
    menu,
    loading,
    saveState,
    productsByCategory,
    rename,
    updateBusiness,
    updateTheme,
    updateSettings,
    addCategory,
    updateCategory,
    removeCategory,
    moveCategory,
    addProduct,
    addProducts,
    updateProduct,
    removeProduct,
    moveProduct,
    setStatus,
    updateSlug,
    flush,
  };
}

export type MenuEditorState = ReturnType<typeof useMenuEditor>;
