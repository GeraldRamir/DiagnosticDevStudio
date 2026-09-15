import { describe, expect, it } from "vitest";
import { DEFAULT_BUSINESS, DEFAULT_THEME, DEFAULT_VISIBILITY } from "@/lib/tools/menu/defaults";
import { formatPrice, parsePrice } from "@/lib/tools/menu/money";
import { parseQuickImport } from "@/lib/tools/menu/quick-import";
import {
  generateWhatsAppOrderLink,
  instagramHref,
  mapsHref,
  phoneHref,
} from "@/lib/tools/menu/sharing";
import { menuPath, uniqueSlug } from "@/lib/tools/menu/slug";
import { createCategory, createProduct, moveItem, reindex } from "@/lib/tools/menu/storage";
import type { DigitalMenu } from "@/lib/tools/menu/types";
import { canPublish, validateBusiness, validateProduct } from "@/lib/tools/menu/validators";

function baseMenu(patch: Partial<DigitalMenu> = {}): DigitalMenu {
  return {
    id: "menu-1",
    slug: "burger-house",
    name: "Menú principal",
    status: "draft",
    business: { ...DEFAULT_BUSINESS, name: "Burger House" },
    categories: [createCategory("Hamburguesas", 0)],
    products: [],
    theme: { ...DEFAULT_THEME },
    settings: { ...DEFAULT_VISIBILITY },
    stats: {
      views: 0,
      whatsappClicks: 0,
      instagramClicks: 0,
      qrScans: 0,
      productViews: {},
      lastViewedAt: null,
    },
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    publishedAt: null,
    ...patch,
  };
}

describe("slug", () => {
  it("genera un slug legible y evita repetidos", () => {
    expect(uniqueSlug("Burger House", [])).toBe("burger-house");
    expect(uniqueSlug("Burger House", ["burger-house"])).toBe("burger-house-2");
    expect(uniqueSlug("Burger House", ["burger-house", "burger-house-2"])).toBe("burger-house-3");
    expect(menuPath("burger-house")).toBe("/menu/burger-house");
  });
});

describe("precios", () => {
  it("formatea con la moneda del negocio", () => {
    expect(formatPrice(450, "RD$")).toBe("RD$450");
    expect(formatPrice(1250.5, "RD$")).toBe("RD$1,250.50");
  });

  it("interpreta lo que escribe el usuario", () => {
    expect(parsePrice("450")).toBe(450);
    expect(parsePrice("RD$ 1,250.50")).toBe(1250.5);
    expect(parsePrice("1.250,50")).toBe(1250.5);
    expect(parsePrice("1,500")).toBe(1500);
    expect(parsePrice("450.75")).toBe(450.75);
    expect(parsePrice("-20")).toBe(0);
    expect(parsePrice("abc")).toBe(0);
  });
});

describe("importación rápida", () => {
  it("convierte una lista pegada en productos", () => {
    const parsed = parseQuickImport(
      ["Classic Burger | RD$450", "Double Burger | RD$550 ", "", "Papas Fritas | 150"].join("\n"),
    );
    expect(parsed).toHaveLength(3);
    expect(parsed[0]).toEqual({ name: "Classic Burger", price: 450, description: "" });
    expect(parsed[2].price).toBe(150);
  });

  it("acepta descripción como tercera columna", () => {
    const [product] = parseQuickImport("Pizza | 650 | Masa artesanal");
    expect(product.description).toBe("Masa artesanal");
  });
});

describe("enlaces del menú", () => {
  it("arma el pedido por WhatsApp", () => {
    const link = generateWhatsAppOrderLink({
      whatsapp: "1 809 555 1234",
      businessName: "Burger House",
    });
    expect(link).toBe(
      "https://wa.me/18095551234?text=Hola%20Burger%20House%2C%20quiero%20realizar%20un%20pedido.",
    );
  });

  it("incluye los productos cuando existan (preparado para carrito)", () => {
    const product = { ...createProduct("cat", 0), name: "Classic Burger", price: 450 };
    const link = generateWhatsAppOrderLink({
      whatsapp: "18095551234",
      businessName: "Burger House",
      currency: "RD$",
      items: [{ product, quantity: 2 }],
    });
    expect(decodeURIComponent(link ?? "")).toContain("2 × Classic Burger — RD$450");
  });

  it("devuelve null sin número", () => {
    expect(generateWhatsAppOrderLink({ whatsapp: "", businessName: "X" })).toBeNull();
  });

  it("normaliza Instagram, teléfono y Maps", () => {
    expect(instagramHref("@burger")).toBe("https://instagram.com/burger");
    expect(instagramHref("")).toBeNull();
    expect(phoneHref("809 555 1234")).toBe("tel:+8095551234");
    expect(mapsHref({ mapsUrl: "https://maps.app.goo.gl/x", address: "", name: "" })).toBe(
      "https://maps.app.goo.gl/x",
    );
    expect(mapsHref({ mapsUrl: "", address: "Av. Principal 12", name: "Burger House" })).toBe(
      "https://www.google.com/maps/search/?api=1&query=Burger%20House%2C%20Av.%20Principal%2012",
    );
  });
});

describe("validaciones", () => {
  it("exige nombre del negocio", () => {
    const menu = baseMenu({ business: { ...DEFAULT_BUSINESS, name: "" } });
    expect(validateBusiness(menu).name).toBeTruthy();
    expect(validateBusiness(baseMenu()).name).toBeUndefined();
  });

  it("valida WhatsApp e Instagram", () => {
    const menu = baseMenu({
      business: { ...DEFAULT_BUSINESS, name: "X", whatsapp: "123", instagram: "no válido" },
    });
    const errors = validateBusiness(menu);
    expect(errors.whatsapp).toBeTruthy();
    expect(errors.instagram).toBeTruthy();
  });

  it("no permite productos sin nombre ni precios negativos", () => {
    const product = createProduct("cat", 0);
    expect(validateProduct(product).name).toBeTruthy();
    expect(validateProduct({ ...product, name: "Burger", price: -5 }).price).toBeTruthy();
    expect(validateProduct({ ...product, name: "Burger", price: 450 }).name).toBeUndefined();
  });

  it("solo deja publicar con lo mínimo listo", () => {
    expect(canPublish(baseMenu())).toBe(false);
    const ready = baseMenu({
      business: { ...DEFAULT_BUSINESS, name: "Burger House", whatsapp: "18095551234" },
      products: [{ ...createProduct("cat", 0), name: "Classic Burger", price: 450 }],
    });
    expect(canPublish(ready)).toBe(true);
  });
});

describe("orden de categorías y productos", () => {
  it("mueve elementos y reindexa", () => {
    const items = [
      createCategory("A", 0),
      createCategory("B", 1),
      createCategory("C", 2),
    ];
    const moved = reindex(moveItem(items, 2, 0));
    expect(moved.map((item) => item.name)).toEqual(["C", "A", "B"]);
    expect(moved.map((item) => item.order)).toEqual([0, 1, 2]);
  });

  it("ignora movimientos fuera de rango", () => {
    const items = [createCategory("A", 0), createCategory("B", 1)];
    expect(moveItem(items, 0, -1)).toBe(items);
    expect(moveItem(items, 1, 2)).toBe(items);
  });
});
