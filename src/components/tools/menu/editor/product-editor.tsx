"use client";

import { useState } from "react";
import { nanoid } from "nanoid";
import { ChevronDown, Plus, Trash2 } from "lucide-react";
import { ImagePicker } from "@/components/tools/menu/editor/image-picker";
import { Field, Toggle, inputClass } from "@/components/tools/menu/editor/menu-form-ui";
import { formatPrice, parsePrice } from "@/lib/tools/menu/money";
import {
  PRODUCT_ALLERGENS,
  PRODUCT_TAGS,
  type DigitalMenu,
  type MenuProduct,
  type ProductAllergen,
  type ProductTag,
} from "@/lib/tools/menu/types";
import { validateProduct } from "@/lib/tools/menu/validators";
import { cn } from "@/lib/utils";

/** Formulario completo de un producto: foto, datos, detalles, variantes y extras. */
export function ProductEditor({
  product,
  menu,
  onChange,
  onRemove,
}: {
  product: MenuProduct;
  menu: DigitalMenu;
  onChange: (patch: Partial<MenuProduct>) => void;
  onRemove: () => void;
}) {
  const [priceText, setPriceText] = useState(product.price ? String(product.price) : "");
  const [compareText, setCompareText] = useState(
    product.compareAtPrice ? String(product.compareAtPrice) : "",
  );
  const [showDetails, setShowDetails] = useState(
    Boolean(product.prepTime || product.servings || product.calories || product.allergens.length),
  );
  const errors = validateProduct(product);
  const hasVariants = product.variants.length > 0;
  const onSale = product.compareAtPrice > product.price && product.price > 0;

  function toggleTag(tag: ProductTag) {
    const tags = product.tags.includes(tag)
      ? product.tags.filter((item) => item !== tag)
      : [...product.tags, tag];
    onChange({ tags });
  }

  function toggleAllergen(allergen: ProductAllergen) {
    const allergens = product.allergens.includes(allergen)
      ? product.allergens.filter((item) => item !== allergen)
      : [...product.allergens, allergen];
    onChange({ allergens });
  }

  return (
    <div className="space-y-5 rounded-xl border border-[#16161c]/10 bg-[#FBF9F7] p-4">
      {/* Foto + datos principales */}
      <div className="grid gap-4 md:grid-cols-[minmax(0,15rem)_1fr]">
        <ImagePicker
          label="Foto del producto"
          hint="Una foto real y bien iluminada vende más. JPG, PNG o WEBP."
          value={product.image}
          slot="product"
          aspect="card"
          onChange={(image) => onChange({ image })}
        />

        <div className="space-y-3">
          <Field label="Nombre" htmlFor={`p-name-${product.id}`} error={errors.name}>
            <input
              id={`p-name-${product.id}`}
              value={product.name}
              onChange={(event) => onChange({ name: event.target.value.slice(0, 80) })}
              className={inputClass}
              placeholder="Classic Burger"
            />
          </Field>

          <Field label="Descripción" htmlFor={`p-desc-${product.id}`}>
            <textarea
              id={`p-desc-${product.id}`}
              value={product.description}
              onChange={(event) => onChange({ description: event.target.value.slice(0, 220) })}
              rows={2}
              className={cn(inputClass, "h-auto py-2 leading-relaxed")}
              placeholder="Carne de res, queso cheddar, lechuga, tomate y salsa especial."
            />
          </Field>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field
              label={hasVariants ? "Precio base" : "Precio"}
              htmlFor={`p-price-${product.id}`}
              error={errors.price}
            >
              <input
                id={`p-price-${product.id}`}
                value={priceText}
                onChange={(event) => {
                  setPriceText(event.target.value);
                  onChange({ price: parsePrice(event.target.value) });
                }}
                className={inputClass}
                placeholder="450"
                inputMode="decimal"
              />
            </Field>

            <Field
              label="Precio anterior (opcional)"
              htmlFor={`p-compare-${product.id}`}
              hint={
                onSale
                  ? `Se muestra tachado: ${formatPrice(product.compareAtPrice, menu.business.currency)}`
                  : "Úsalo para mostrar una oferta."
              }
            >
              <input
                id={`p-compare-${product.id}`}
                value={compareText}
                onChange={(event) => {
                  setCompareText(event.target.value);
                  onChange({ compareAtPrice: parsePrice(event.target.value) });
                }}
                className={inputClass}
                placeholder="550"
                inputMode="decimal"
              />
            </Field>
          </div>

          <Field label="Categoría" htmlFor={`p-cat-${product.id}`} error={errors.categoryId}>
            <select
              id={`p-cat-${product.id}`}
              value={product.categoryId}
              onChange={(event) => onChange({ categoryId: event.target.value })}
              className={cn(inputClass, "cursor-pointer")}
            >
              {menu.categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </div>

      {/* Etiquetas y estado */}
      <div>
        <p className="text-[0.78rem] font-semibold text-[#16161c]">Etiquetas</p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {PRODUCT_TAGS.map((tag) => {
            const active = product.tags.includes(tag.id);
            return (
              <button
                key={tag.id}
                type="button"
                aria-pressed={active}
                onClick={() => toggleTag(tag.id)}
                className={cn(
                  "h-8 cursor-pointer rounded-full px-3 text-[0.74rem] font-medium transition-colors",
                  active ? "bg-[#16161c] text-white" : "bg-white text-[#16161c] hover:bg-[#F1ECE8]",
                )}
              >
                {tag.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <Toggle
          label="Disponible"
          description="Si lo apagas, aparece como “Agotado”."
          checked={product.available}
          onChange={(available) => onChange({ available })}
        />
        <Toggle
          label="Destacado"
          description="Aparece arriba, en “Recomendados”."
          checked={product.featured}
          onChange={(featured) => onChange({ featured })}
        />
      </div>

      {/* Detalles adicionales */}
      <div className="rounded-xl border border-[#16161c]/10 bg-white">
        <button
          type="button"
          onClick={() => setShowDetails((value) => !value)}
          aria-expanded={showDetails}
          className="flex w-full cursor-pointer items-center justify-between gap-3 px-3 py-2.5 text-left"
        >
          <span>
            <span className="block text-[0.82rem] font-medium text-[#16161c]">
              Detalles del plato
            </span>
            <span className="block text-[0.72rem] text-[#16161c]/55">
              Tiempo, porción, calorías, alérgenos y código interno
            </span>
          </span>
          <ChevronDown
            className={cn("size-4 shrink-0 text-[#16161c]/50 transition-transform", showDetails && "rotate-180")}
            strokeWidth={1.8}
            aria-hidden
          />
        </button>

        {showDetails ? (
          <div className="space-y-4 border-t border-[#16161c]/10 p-3">
            <div className="grid gap-3 sm:grid-cols-3">
              <Field label="Preparación (min)" htmlFor={`p-prep-${product.id}`}>
                <input
                  id={`p-prep-${product.id}`}
                  value={product.prepTime ? String(product.prepTime) : ""}
                  onChange={(event) =>
                    onChange({ prepTime: Math.max(0, Number(event.target.value) || 0) })
                  }
                  className={inputClass}
                  placeholder="15"
                  inputMode="numeric"
                />
              </Field>

              <Field label="Porción" htmlFor={`p-serv-${product.id}`}>
                <input
                  id={`p-serv-${product.id}`}
                  value={product.servings}
                  onChange={(event) => onChange({ servings: event.target.value.slice(0, 30) })}
                  className={inputClass}
                  placeholder="Para 2 personas"
                />
              </Field>

              <Field label="Calorías" htmlFor={`p-cal-${product.id}`}>
                <input
                  id={`p-cal-${product.id}`}
                  value={product.calories ? String(product.calories) : ""}
                  onChange={(event) =>
                    onChange({ calories: Math.max(0, Number(event.target.value) || 0) })
                  }
                  className={inputClass}
                  placeholder="680"
                  inputMode="numeric"
                />
              </Field>
            </div>

            <div>
              <p className="text-[0.78rem] font-semibold text-[#16161c]">Contiene</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {PRODUCT_ALLERGENS.map((allergen) => {
                  const active = product.allergens.includes(allergen.id);
                  return (
                    <button
                      key={allergen.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => toggleAllergen(allergen.id)}
                      className={cn(
                        "h-8 cursor-pointer rounded-full border px-3 text-[0.74rem] font-medium transition-colors",
                        active
                          ? "border-[#C9861A] bg-[#FBEFD8] text-[#6B4708]"
                          : "border-[#16161c]/12 bg-white text-[#16161c] hover:border-[#16161c]/30",
                      )}
                    >
                      {allergen.label}
                    </button>
                  );
                })}
              </div>
              <p className="mt-1.5 text-[0.72rem] text-[#16161c]/55">
                Se muestra como aviso para clientes con alergias.
              </p>
            </div>

            <Field
              label="Código interno (SKU)"
              htmlFor={`p-sku-${product.id}`}
              hint="Solo para ti: no aparece en el menú del cliente."
            >
              <input
                id={`p-sku-${product.id}`}
                value={product.sku}
                onChange={(event) => onChange({ sku: event.target.value.slice(0, 24) })}
                className={cn(inputClass, "font-mono text-[0.8rem]")}
                placeholder="BRG-001"
              />
            </Field>
          </div>
        ) : null}
      </div>

      {/* Variantes */}
      <div className="rounded-xl border border-[#16161c]/10 bg-white p-3">
        <Toggle
          label="Este producto tiene variantes"
          description="Tamaños o versiones con precios distintos."
          checked={hasVariants}
          onChange={(enabled) =>
            onChange({
              variants: enabled
                ? [
                    { id: nanoid(6), name: "Pequeña", price: product.price },
                    { id: nanoid(6), name: "Grande", price: product.price },
                  ]
                : [],
            })
          }
        />

        {hasVariants ? (
          <div className="mt-3 space-y-2">
            {product.variants.map((variant, index) => (
              <div key={variant.id} className="flex items-center gap-2">
                <input
                  value={variant.name}
                  onChange={(event) =>
                    onChange({
                      variants: product.variants.map((item, itemIndex) =>
                        itemIndex === index ? { ...item, name: event.target.value } : item,
                      ),
                    })
                  }
                  className={inputClass}
                  placeholder="Tamaño"
                  aria-label={`Nombre de la variante ${index + 1}`}
                />
                <input
                  value={variant.price ? String(variant.price) : ""}
                  onChange={(event) =>
                    onChange({
                      variants: product.variants.map((item, itemIndex) =>
                        itemIndex === index
                          ? { ...item, price: parsePrice(event.target.value) }
                          : item,
                      ),
                    })
                  }
                  className={cn(inputClass, "w-28")}
                  placeholder="450"
                  inputMode="decimal"
                  aria-label={`Precio de la variante ${index + 1}`}
                />
                <button
                  type="button"
                  onClick={() =>
                    onChange({
                      variants: product.variants.filter((_, itemIndex) => itemIndex !== index),
                    })
                  }
                  aria-label={`Eliminar variante ${index + 1}`}
                  className="inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-lg text-[#B4231F] hover:bg-[#F7E7E6]"
                >
                  <Trash2 className="size-4" strokeWidth={1.8} aria-hidden />
                </button>
              </div>
            ))}
            {errors.variants ? (
              <p role="alert" className="text-[0.75rem] font-medium text-[#B4231F]">
                {errors.variants}
              </p>
            ) : null}
            <button
              type="button"
              onClick={() =>
                onChange({
                  variants: [...product.variants, { id: nanoid(6), name: "", price: 0 }],
                })
              }
              className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-[#16161c]/15 px-3 text-[0.78rem] font-medium text-[#16161c] hover:border-[#16161c]/35"
            >
              <Plus className="size-4" strokeWidth={1.8} aria-hidden />
              Agregar variante
            </button>
          </div>
        ) : null}
      </div>

      {/* Extras */}
      <div className="rounded-xl border border-[#16161c]/10 bg-white p-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[0.82rem] font-medium text-[#16161c]">Extras</p>
            <p className="mt-0.5 text-[0.72rem] text-[#16161c]/55">
              Se muestran como sugerencia: “Agregar queso +{menu.business.currency}75”.
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              onChange({
                addons: [...product.addons, { id: nanoid(6), name: "", price: 0, active: true }],
              })
            }
            className="inline-flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-[#16161c]/15 px-3 text-[0.78rem] font-medium text-[#16161c] hover:border-[#16161c]/35"
          >
            <Plus className="size-4" strokeWidth={1.8} aria-hidden />
            Extra
          </button>
        </div>

        {product.addons.length > 0 ? (
          <div className="mt-3 space-y-2">
            {product.addons.map((addon, index) => (
              <div key={addon.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={addon.active}
                  onChange={(event) =>
                    onChange({
                      addons: product.addons.map((item, itemIndex) =>
                        itemIndex === index ? { ...item, active: event.target.checked } : item,
                      ),
                    })
                  }
                  className="size-4 accent-[#90BF53]"
                  aria-label={`Mostrar extra ${index + 1}`}
                />
                <input
                  value={addon.name}
                  onChange={(event) =>
                    onChange({
                      addons: product.addons.map((item, itemIndex) =>
                        itemIndex === index ? { ...item, name: event.target.value } : item,
                      ),
                    })
                  }
                  className={inputClass}
                  placeholder="Agregar queso"
                  aria-label={`Nombre del extra ${index + 1}`}
                />
                <input
                  value={addon.price ? String(addon.price) : ""}
                  onChange={(event) =>
                    onChange({
                      addons: product.addons.map((item, itemIndex) =>
                        itemIndex === index
                          ? { ...item, price: parsePrice(event.target.value) }
                          : item,
                      ),
                    })
                  }
                  className={cn(inputClass, "w-24")}
                  placeholder="75"
                  inputMode="decimal"
                  aria-label={`Precio del extra ${index + 1}`}
                />
                <button
                  type="button"
                  onClick={() =>
                    onChange({
                      addons: product.addons.filter((_, itemIndex) => itemIndex !== index),
                    })
                  }
                  aria-label={`Eliminar extra ${index + 1}`}
                  className="inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-lg text-[#B4231F] hover:bg-[#F7E7E6]"
                >
                  <Trash2 className="size-4" strokeWidth={1.8} aria-hidden />
                </button>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={onRemove}
          className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg px-3 text-[0.78rem] font-medium text-[#B4231F] hover:bg-[#F7E7E6]"
        >
          <Trash2 className="size-4" strokeWidth={1.8} aria-hidden />
          Eliminar producto
        </button>
      </div>
    </div>
  );
}
