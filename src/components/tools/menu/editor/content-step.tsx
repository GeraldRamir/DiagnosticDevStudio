"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  ListPlus,
  Plus,
  Trash2,
} from "lucide-react";
import { ProductEditor } from "@/components/tools/menu/editor/product-editor";
import {
  EditorSection,
  Field,
  inputClass,
} from "@/components/tools/menu/editor/menu-form-ui";
import { LayoutList } from "lucide-react";
import type { MenuEditorState } from "@/components/tools/menu/use-menu-editor";
import { formatPrice } from "@/lib/tools/menu/money";
import { parseQuickImport } from "@/lib/tools/menu/quick-import";
import type { DigitalMenu } from "@/lib/tools/menu/types";
import { cn } from "@/lib/utils";

const SUGGESTED = ["Entradas", "Platos fuertes", "Hamburguesas", "Bebidas", "Postres"];

/** Paso 02: categorías y productos del menú. */
export function ContentStep({
  menu,
  editor,
}: {
  menu: DigitalMenu;
  editor: MenuEditorState;
}) {
  const [newCategory, setNewCategory] = useState("");
  const [openProduct, setOpenProduct] = useState<string | null>(null);
  const [importTarget, setImportTarget] = useState<string | null>(null);
  const [importText, setImportText] = useState("");

  const categories = [...menu.categories].sort((a, b) => a.order - b.order);

  function handleAddCategory(name: string) {
    const clean = name.trim();
    if (!clean) return;
    editor.addCategory(clean);
    setNewCategory("");
  }

  function handleAddProduct(categoryId: string) {
    const created = editor.addProduct(categoryId);
    if (created) setOpenProduct(created.id);
  }

  function handleImport(categoryId: string) {
    const parsed = parseQuickImport(importText);
    if (parsed.length === 0) {
      toast.error("No encontramos productos en esa lista.");
      return;
    }
    editor.addProducts(
      parsed.map((item) => ({
        name: item.name,
        description: item.description,
        price: item.price,
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
      })),
      categoryId,
    );
    setImportText("");
    setImportTarget(null);
    toast.success(`${parsed.length} productos agregados.`);
  }

  return (
    <div className="space-y-4">
      <EditorSection
        title="Categorías"
        description="El orden de esta lista es el orden que verá tu cliente."
        icon={<LayoutList className="size-4" strokeWidth={1.8} aria-hidden />}
      >
        <div className="flex flex-wrap gap-2">
          <input
            value={newCategory}
            onChange={(event) => setNewCategory(event.target.value.slice(0, 40))}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                handleAddCategory(newCategory);
              }
            }}
            className={cn(inputClass, "max-w-xs flex-1")}
            placeholder="Nueva categoría (Hamburguesas…)"
            aria-label="Nombre de la nueva categoría"
          />
          <button
            type="button"
            onClick={() => handleAddCategory(newCategory)}
            className="inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-lg bg-[#16161c] px-4 text-[0.82rem] font-semibold text-white"
          >
            <Plus className="size-4" strokeWidth={1.8} aria-hidden />
            Agregar
          </button>
        </div>

        {categories.length === 0 ? (
          <div className="mt-4">
            <p className="text-[0.8rem] text-[#16161c]/55">
              Sugerencias rápidas para empezar:
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {SUGGESTED.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => handleAddCategory(name)}
                  className="h-8 cursor-pointer rounded-full border border-[#16161c]/15 px-3 text-[0.75rem] font-medium text-[#16161c] hover:border-[#16161c]/35"
                >
                  + {name}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </EditorSection>

      {categories.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#16161c]/15 bg-white px-5 py-10 text-center">
          <p className="text-[0.95rem] font-semibold text-[#16161c]">
            Todavía no tienes categorías
          </p>
          <p className="mx-auto mt-2 max-w-sm text-[0.82rem] leading-relaxed text-[#16161c]/55">
            Crea una categoría (por ejemplo “Hamburguesas”) y después agrega tus productos.
          </p>
        </div>
      ) : null}

      {categories.map((category, index) => {
        const products = editor.productsByCategory.get(category.id) ?? [];
        return (
          <section
            key={category.id}
            className="rounded-2xl border border-[#16161c]/8 bg-white p-4 sm:p-5"
          >
            <div className="flex flex-wrap items-center gap-2">
              <input
                value={category.icon}
                onChange={(event) =>
                  editor.updateCategory(category.id, { icon: event.target.value.slice(0, 2) })
                }
                className={cn(inputClass, "w-14 text-center")}
                placeholder="🍔"
                aria-label={`Emoji de ${category.name}`}
              />
              <input
                value={category.name}
                onChange={(event) =>
                  editor.updateCategory(category.id, { name: event.target.value.slice(0, 40) })
                }
                className={cn(inputClass, "max-w-xs flex-1 font-medium")}
                aria-label={`Nombre de la categoría ${category.name}`}
              />

              <div className="ml-auto flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => editor.moveCategory(category.id, -1)}
                  disabled={index === 0}
                  aria-label={`Subir ${category.name}`}
                  className="inline-flex size-9 cursor-pointer items-center justify-center rounded-lg text-[#16161c] hover:bg-[#F1ECE8] disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <ChevronUp className="size-4" strokeWidth={1.8} aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => editor.moveCategory(category.id, 1)}
                  disabled={index === categories.length - 1}
                  aria-label={`Bajar ${category.name}`}
                  className="inline-flex size-9 cursor-pointer items-center justify-center rounded-lg text-[#16161c] hover:bg-[#F1ECE8] disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <ChevronDown className="size-4" strokeWidth={1.8} aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    editor.updateCategory(category.id, { visible: !category.visible })
                  }
                  aria-label={category.visible ? `Ocultar ${category.name}` : `Mostrar ${category.name}`}
                  title={category.visible ? "Ocultar en el menú" : "Mostrar en el menú"}
                  className="inline-flex size-9 cursor-pointer items-center justify-center rounded-lg text-[#16161c] hover:bg-[#F1ECE8]"
                >
                  {category.visible ? (
                    <Eye className="size-4" strokeWidth={1.8} aria-hidden />
                  ) : (
                    <EyeOff className="size-4" strokeWidth={1.8} aria-hidden />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => editor.removeCategory(category.id)}
                  aria-label={`Eliminar ${category.name}`}
                  className="inline-flex size-9 cursor-pointer items-center justify-center rounded-lg text-[#B4231F] hover:bg-[#F7E7E6]"
                >
                  <Trash2 className="size-4" strokeWidth={1.8} aria-hidden />
                </button>
              </div>
            </div>

            {/* Productos de la categoría */}
            <div className="mt-4 space-y-2">
              {products.length === 0 ? (
                <p className="rounded-xl bg-[#FBF9F7] px-4 py-5 text-center text-[0.82rem] text-[#16161c]/55">
                  Todavía no hay productos aquí. Agrega el primero para comenzar.
                </p>
              ) : null}

              {products.map((product, productIndex) => {
                const open = openProduct === product.id;
                return (
                  <div
                    key={product.id}
                    className="rounded-xl border border-[#16161c]/10 bg-white"
                  >
                    <div className="flex items-center gap-2 p-2.5">
                      <button
                        type="button"
                        onClick={() => setOpenProduct(open ? null : product.id)}
                        aria-expanded={open}
                        className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 rounded-lg px-1.5 py-1 text-left"
                      >
                        {product.image ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={product.image}
                            alt=""
                            className="size-9 shrink-0 rounded-lg object-cover"
                          />
                        ) : (
                          <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#F1ECE8] text-[0.7rem] text-[#16161c]/50">
                            {productIndex + 1}
                          </span>
                        )}
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[0.85rem] font-medium text-[#16161c]">
                            {product.name || "Producto sin nombre"}
                          </span>
                          <span className="block text-[0.72rem] text-[#16161c]/55">
                            {formatPrice(
                              product.variants.length
                                ? Math.min(...product.variants.map((v) => v.price))
                                : product.price,
                              menu.business.currency,
                            )}
                            {product.featured ? " · Destacado" : ""}
                            {product.available ? "" : " · Agotado"}
                          </span>
                        </span>
                        {open ? (
                          <ChevronUp className="size-4 shrink-0 text-[#16161c]/50" strokeWidth={1.8} aria-hidden />
                        ) : (
                          <ChevronDown className="size-4 shrink-0 text-[#16161c]/50" strokeWidth={1.8} aria-hidden />
                        )}
                      </button>

                      <div className="flex shrink-0 items-center">
                        <button
                          type="button"
                          onClick={() => editor.moveProduct(product.id, -1)}
                          disabled={productIndex === 0}
                          aria-label={`Subir ${product.name || "producto"}`}
                          className="inline-flex size-8 cursor-pointer items-center justify-center rounded-lg text-[#16161c] hover:bg-[#F1ECE8] disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          <ChevronUp className="size-3.5" strokeWidth={1.8} aria-hidden />
                        </button>
                        <button
                          type="button"
                          onClick={() => editor.moveProduct(product.id, 1)}
                          disabled={productIndex === products.length - 1}
                          aria-label={`Bajar ${product.name || "producto"}`}
                          className="inline-flex size-8 cursor-pointer items-center justify-center rounded-lg text-[#16161c] hover:bg-[#F1ECE8] disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          <ChevronDown className="size-3.5" strokeWidth={1.8} aria-hidden />
                        </button>
                      </div>
                    </div>

                    {open ? (
                      <div className="border-t border-[#16161c]/10 p-3">
                        <ProductEditor
                          product={product}
                          menu={menu}
                          onChange={(patch) => editor.updateProduct(product.id, patch)}
                          onRemove={() => {
                            editor.removeProduct(product.id);
                            setOpenProduct(null);
                            toast.success("Producto eliminado.");
                          }}
                        />
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleAddProduct(category.id)}
                className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg bg-[#90BF53] px-3 text-[0.78rem] font-semibold text-[#13200a]"
              >
                <Plus className="size-4" strokeWidth={1.8} aria-hidden />
                Agregar producto
              </button>
              <button
                type="button"
                onClick={() =>
                  setImportTarget(importTarget === category.id ? null : category.id)
                }
                className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-[#16161c]/15 px-3 text-[0.78rem] font-medium text-[#16161c] hover:border-[#16161c]/35"
              >
                <ListPlus className="size-4" strokeWidth={1.8} aria-hidden />
                Agregar varios
              </button>
            </div>

            {importTarget === category.id ? (
              <div className="mt-3 rounded-xl border border-[#16161c]/10 bg-[#FBF9F7] p-3">
                <Field
                  label="Pega tu lista de productos"
                  htmlFor={`import-${category.id}`}
                  hint="Un producto por línea: Nombre | Precio | Descripción (la descripción es opcional)."
                >
                  <textarea
                    id={`import-${category.id}`}
                    value={importText}
                    onChange={(event) => setImportText(event.target.value)}
                    rows={5}
                    className={cn(inputClass, "h-auto py-2 font-mono text-[0.78rem] leading-relaxed")}
                    placeholder={"Classic Burger | RD$450\nDouble Burger | RD$550\nPapas Fritas | RD$150"}
                  />
                </Field>
                <div className="mt-3 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setImportTarget(null)}
                    className="h-9 cursor-pointer rounded-lg px-3 text-[0.78rem] font-medium text-[#16161c]/70 hover:text-[#16161c]"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleImport(category.id)}
                    className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg bg-[#16161c] px-3 text-[0.78rem] font-semibold text-white"
                  >
                    Agregar productos
                  </button>
                </div>
              </div>
            ) : null}
          </section>
        );
      })}
    </div>
  );
}
