"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Camera,
  Clock,
  Flame,
  MapPin,
  MessageCircle,
  Phone,
  Search,
  Star,
  Users,
} from "lucide-react";
import { FONT_STACKS } from "@/lib/tools/menu/defaults";
import { formatPrice } from "@/lib/tools/menu/money";
import {
  generateWhatsAppOrderLink,
  instagramHref,
  mapsHref,
  phoneHref,
} from "@/lib/tools/menu/sharing";
import {
  PRODUCT_ALLERGENS,
  WEEK_DAYS,
  type DigitalMenu,
  type MenuProduct,
} from "@/lib/tools/menu/types";
import { cn } from "@/lib/utils";

type Palette = {
  bg: string;
  surface: string;
  text: string;
  muted: string;
  border: string;
};

/**
 * Menú público del negocio.
 * Es el mismo componente que se ve en la preview del editor y en /menu/[slug],
 * así que lo que el dueño ve mientras edita es exactamente lo que verá su cliente.
 */
export function MenuPublic({
  menu,
  scale = "full",
}: {
  menu: DigitalMenu;
  /** "phone" ajusta tipografías y espacios para el mockup del editor. */
  scale?: "full" | "phone";
}) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme, settings, business } = menu;
  const dark = theme.background === "dark";
  const compact = scale === "phone";

  const palette: Palette = dark
    ? {
        bg: "#0F0F10",
        surface: "#17171A",
        text: "#F7F5F2",
        muted: "#A9A5A0",
        border: "#2A2A2E",
      }
    : {
        bg: "#FFFFFF",
        surface: "#F7F4F1",
        text: "#16130F",
        muted: "#6E6561",
        border: "#E8E2DC",
      };

  const categories = useMemo(
    () =>
      [...menu.categories]
        .filter((category) => category.visible)
        .sort((a, b) => a.order - b.order),
    [menu.categories],
  );

  const normalizedQuery = query.trim().toLowerCase();

  const productsByCategory = useMemo(() => {
    const map = new Map<string, MenuProduct[]>();
    const sorted = [...menu.products].sort((a, b) => a.order - b.order);
    for (const product of sorted) {
      if (
        normalizedQuery &&
        !`${product.name} ${product.description}`.toLowerCase().includes(normalizedQuery)
      ) {
        continue;
      }
      const list = map.get(product.categoryId) ?? [];
      list.push(product);
      map.set(product.categoryId, list);
    }
    return map;
  }, [menu.products, normalizedQuery]);

  const featured = useMemo(
    () =>
      menu.products
        .filter((product) => product.featured && product.available)
        .sort((a, b) => a.order - b.order),
    [menu.products],
  );

  /* Resalta la categoría que se está viendo mientras el cliente hace scroll. */
  useEffect(() => {
    const root = containerRef.current;
    if (!root || categories.length === 0) return;

    const sections = categories
      .map((category) => root.querySelector<HTMLElement>(`[data-category="${category.id}"]`))
      .filter((section): section is HTMLElement => section !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActiveCategory(visible.target.getAttribute("data-category"));
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [categories, productsByCategory]);

  const whatsappLink = settings.whatsapp
    ? generateWhatsAppOrderLink({
        whatsapp: business.whatsapp,
        businessName: business.name,
      })
    : null;
  const igLink = settings.instagram ? instagramHref(business.instagram) : null;
  const telLink = settings.phone ? phoneHref(business.phone) : null;
  const mapLink = settings.address
    ? mapsHref({ mapsUrl: business.mapsUrl, address: business.address, name: business.name })
    : null;

  function scrollToCategory(id: string) {
    const target = containerRef.current?.querySelector<HTMLElement>(`[data-category="${id}"]`);
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveCategory(id);
  }

  const hasAnyProduct = menu.products.length > 0;
  const showingResults = normalizedQuery.length > 0;
  const showCover = theme.heroStyle === "cover" && Boolean(business.cover);

  return (
    <div
      ref={containerRef}
      style={{
        backgroundColor: palette.bg,
        color: palette.text,
        fontFamily: FONT_STACKS[theme.font],
        ["--m-primary" as string]: theme.primaryColor,
        ["--m-secondary" as string]: theme.secondaryColor,
        ["--m-surface" as string]: palette.surface,
        ["--m-border" as string]: palette.border,
        ["--m-muted" as string]: palette.muted,
      }}
      className="min-h-full w-full"
    >
      {/* Aviso del negocio */}
      {business.announcement.trim() ? (
        <p
          className={cn(
            "px-4 py-2 text-center font-medium text-white",
            compact ? "text-[0.68rem]" : "text-[0.8rem]",
          )}
          style={{ backgroundColor: theme.primaryColor }}
        >
          {business.announcement}
        </p>
      ) : null}

      <Hero
        menu={menu}
        palette={palette}
        compact={compact}
        showCover={showCover}
        links={{ whatsappLink, igLink, telLink, mapLink }}
      />

      {/* Navegación de categorías */}
      {categories.length > 0 ? (
        <nav
          aria-label="Categorías del menú"
          className="sticky top-0 z-20 border-b px-3 py-2 backdrop-blur-md"
          style={{ borderColor: palette.border, backgroundColor: `${palette.bg}F2` }}
        >
          <div className="flex gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {categories.map((category) => {
              const active = activeCategory === category.id;
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => scrollToCategory(category.id)}
                  aria-current={active ? "true" : undefined}
                  className={cn(
                    "shrink-0 cursor-pointer rounded-full border px-3.5 font-medium whitespace-nowrap transition-colors",
                    compact ? "h-8 text-[0.72rem]" : "h-9 text-[0.82rem]",
                  )}
                  style={
                    active
                      ? {
                          backgroundColor: theme.primaryColor,
                          borderColor: theme.primaryColor,
                          color: "#FFFFFF",
                        }
                      : { borderColor: palette.border, color: palette.text }
                  }
                >
                  {category.icon ? `${category.icon} ` : ""}
                  {category.name}
                </button>
              );
            })}
          </div>
        </nav>
      ) : null}

      {/* Buscador */}
      {settings.search && hasAnyProduct ? (
        <div className={cn("px-5", compact ? "pt-3" : "pt-4")}>
          <label className="relative block">
            <span className="sr-only">Buscar en el menú</span>
            <Search
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
              style={{ color: palette.muted }}
              strokeWidth={1.8}
              aria-hidden
            />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar en el menú"
              className={cn(
                "w-full rounded-full border pr-4 pl-9 outline-none",
                compact ? "h-9 text-[0.78rem]" : "h-11 text-[0.9rem]",
              )}
              style={{
                borderColor: palette.border,
                backgroundColor: palette.surface,
                color: palette.text,
              }}
            />
          </label>
        </div>
      ) : null}

      <div className={cn("px-5 pb-12", compact ? "pt-4" : "pt-6")}>
        {/* Destacados */}
        {settings.featured && featured.length > 0 && !showingResults ? (
          <section className={compact ? "mb-7" : "mb-10"}>
            <SectionTitle
              icon={<Star className="size-4" strokeWidth={1.8} aria-hidden />}
              title="Recomendados"
              menu={menu}
              compact={compact}
              palette={palette}
            />
            <div className="mt-3 flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {featured.map((product) => (
                <FeaturedCard
                  key={product.id}
                  product={product}
                  menu={menu}
                  compact={compact}
                  palette={palette}
                />
              ))}
            </div>
          </section>
        ) : null}

        {/* Categorías con productos */}
        {categories.map((category) => {
          const products = productsByCategory.get(category.id) ?? [];
          if (showingResults && products.length === 0) return null;

          return (
            <section
              key={category.id}
              data-category={category.id}
              className={cn("scroll-mt-16", compact ? "mb-7" : "mb-10")}
            >
              <SectionTitle
                title={`${category.icon ? `${category.icon} ` : ""}${category.name}`}
                menu={menu}
                compact={compact}
                palette={palette}
                count={products.length}
              />

              {products.length === 0 ? (
                <p className="mt-3 text-[0.82rem]" style={{ color: palette.muted }}>
                  Pronto agregaremos productos en esta categoría.
                </p>
              ) : (
                <div
                  className={cn(
                    "mt-3",
                    theme.cardStyle === "image"
                      ? cn("grid gap-3", compact ? "grid-cols-1" : "grid-cols-2")
                      : "flex flex-col gap-3",
                  )}
                >
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      menu={menu}
                      compact={compact}
                      palette={palette}
                    />
                  ))}
                </div>
              )}
            </section>
          );
        })}

        {showingResults &&
        [...productsByCategory.values()].every((list) => list.length === 0) ? (
          <p className="py-10 text-center text-[0.9rem]" style={{ color: palette.muted }}>
            No encontramos productos con “{query}”.
          </p>
        ) : null}

        {!hasAnyProduct ? (
          <p className="py-10 text-center text-[0.9rem]" style={{ color: palette.muted }}>
            Este menú todavía no tiene productos.
          </p>
        ) : null}
      </div>

      {/* Barra fija de pedido */}
      {whatsappLink && hasAnyProduct ? (
        <div
          className="sticky bottom-0 z-20 border-t px-5 py-3 backdrop-blur-md"
          style={{ borderColor: palette.border, backgroundColor: `${palette.bg}F2` }}
        >
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "flex w-full items-center justify-center gap-2 rounded-full font-semibold text-white",
              compact ? "h-10 text-[0.8rem]" : "h-12 text-[0.9rem]",
            )}
            style={{ backgroundColor: theme.primaryColor }}
          >
            <MessageCircle className="size-4" strokeWidth={1.8} aria-hidden />
            Ordenar por WhatsApp
          </a>
        </div>
      ) : null}
    </div>
  );
}

/* ── Encabezado ─────────────────────────────────────────────────── */

function Hero({
  menu,
  palette,
  compact,
  showCover,
  links,
}: {
  menu: DigitalMenu;
  palette: Palette;
  compact: boolean;
  showCover: boolean;
  links: {
    whatsappLink: string | null;
    igLink: string | null;
    telLink: string | null;
    mapLink: string | null;
  };
}) {
  const { business, theme, settings } = menu;
  const centered = theme.heroStyle !== "simple";
  const { whatsappLink, igLink, telLink, mapLink } = links;

  const logo = business.logo ? (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={business.logo}
      alt={business.name || "Logo del negocio"}
      className={cn("rounded-full object-cover", compact ? "size-14" : "size-20")}
      style={{
        border: `2px solid ${theme.primaryColor}`,
        boxShadow: showCover ? `0 0 0 4px ${palette.bg}` : undefined,
      }}
    />
  ) : null;

  return (
    <header
      className={cn(showCover ? "pb-6" : compact ? "px-5 pt-6 pb-5" : "px-5 pt-10 pb-6")}
      style={{
        background:
          theme.menuStyle === "modern" && !showCover
            ? `linear-gradient(180deg, ${theme.primaryColor}1A 0%, transparent 100%)`
            : undefined,
      }}
    >
      {showCover && business.cover ? (
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={business.cover}
            alt=""
            className={cn("w-full object-cover", compact ? "h-28" : "h-44")}
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(180deg, transparent 40%, ${palette.bg} 100%)`,
            }}
            aria-hidden
          />
          {logo ? (
            <div className="absolute inset-x-0 -bottom-8 flex justify-center">{logo}</div>
          ) : null}
        </div>
      ) : null}

      <div
        className={cn(
          showCover ? (compact ? "px-5 pt-11" : "px-5 pt-12") : "",
          centered ? "text-center" : "text-left",
        )}
      >
        {!showCover && logo ? (
          <div className={cn("mb-4", centered ? "flex justify-center" : "")}>{logo}</div>
        ) : null}

        <h1
          className={cn(
            "font-semibold tracking-tight",
            compact ? "text-[1.35rem]" : "text-[2rem]",
            theme.menuStyle === "elegant" && "tracking-[0.08em] uppercase",
          )}
        >
          {business.name || "Tu negocio"}
        </h1>

        {business.description ? (
          <p
            className={cn(
              "mt-2 leading-relaxed",
              centered && "mx-auto",
              compact ? "max-w-[22rem] text-[0.8rem]" : "max-w-md text-[0.95rem]",
            )}
            style={{ color: palette.muted }}
          >
            {business.description}
          </p>
        ) : null}

        {settings.schedule ? (
          <ScheduleLine menu={menu} palette={palette} centered={centered} />
        ) : null}

        {(whatsappLink || igLink || telLink || mapLink) && (
          <div
            className={cn(
              "mt-4 flex flex-wrap items-center gap-2",
              centered ? "justify-center" : "justify-start",
            )}
          >
            {whatsappLink ? (
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-4 font-semibold text-white",
                  compact ? "h-9 text-[0.75rem]" : "h-11 text-[0.85rem]",
                )}
                style={{ backgroundColor: theme.primaryColor }}
              >
                <MessageCircle className="size-4" strokeWidth={1.8} aria-hidden />
                Pedir por WhatsApp
              </a>
            ) : null}

            {igLink ? (
              <IconLink
                href={igLink}
                label="Instagram"
                compact={compact}
                palette={palette}
                icon={<Camera className="size-4" strokeWidth={1.8} aria-hidden />}
              />
            ) : null}

            {telLink ? (
              <IconLink
                href={telLink}
                label="Llamar"
                compact={compact}
                palette={palette}
                external={false}
                icon={<Phone className="size-4" strokeWidth={1.8} aria-hidden />}
              />
            ) : null}

            {mapLink ? (
              <IconLink
                href={mapLink}
                label="Cómo llegar"
                compact={compact}
                palette={palette}
                icon={<MapPin className="size-4" strokeWidth={1.8} aria-hidden />}
              />
            ) : null}
          </div>
        )}
      </div>
    </header>
  );
}

function IconLink({
  href,
  label,
  icon,
  compact,
  palette,
  external = true,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  compact: boolean;
  palette: Palette;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-4 font-medium",
        compact ? "h-9 text-[0.75rem]" : "h-11 text-[0.85rem]",
      )}
      style={{ borderColor: palette.border, color: palette.text }}
    >
      {icon}
      {label}
    </a>
  );
}

function ScheduleLine({
  menu,
  palette,
  centered,
}: {
  menu: DigitalMenu;
  palette: Palette;
  centered: boolean;
}) {
  const today = new Date().getDay();
  const index = today === 0 ? 6 : today - 1;
  const day = menu.business.schedule[index];
  if (!day) return null;
  const label = WEEK_DAYS[index]?.label ?? "";

  return (
    <div className={cn("mt-3 flex", centered ? "justify-center" : "justify-start")}>
      <span
        className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[0.72rem]"
        style={{ borderColor: palette.border, color: palette.muted }}
      >
        <span
          className="size-1.5 rounded-full"
          style={{ backgroundColor: day.open ? "#3BA55C" : "#B4231F" }}
          aria-hidden
        />
        {day.open ? `Hoy ${day.from} – ${day.to}` : `${label}: cerrado`}
      </span>
    </div>
  );
}

/* ── Piezas de producto ─────────────────────────────────────────── */

function SectionTitle({
  title,
  icon,
  menu,
  compact,
  palette,
  count,
}: {
  title: string;
  icon?: React.ReactNode;
  menu: DigitalMenu;
  compact: boolean;
  palette: Palette;
  count?: number;
}) {
  const style = menu.theme.menuStyle;
  return (
    <div
      className={cn(
        "flex items-center gap-2",
        style === "elegant" && "justify-center",
        style === "classic" && "border-b pb-2",
      )}
      style={style === "classic" ? { borderColor: palette.border } : undefined}
    >
      {icon ? <span style={{ color: menu.theme.primaryColor }}>{icon}</span> : null}
      <h2
        className={cn(
          "font-semibold tracking-tight",
          compact ? "text-[1rem]" : "text-[1.35rem]",
          style === "elegant" && "tracking-[0.12em] uppercase",
        )}
      >
        {title}
      </h2>
      {typeof count === "number" && count > 0 && style !== "elegant" ? (
        <span
          className="rounded-full px-2 py-0.5 text-[0.65rem] font-medium"
          style={{ backgroundColor: palette.surface, color: palette.muted }}
        >
          {count}
        </span>
      ) : null}
    </div>
  );
}

function PriceLabel({
  product,
  menu,
  compact,
  palette,
}: {
  product: MenuProduct;
  menu: DigitalMenu;
  compact: boolean;
  palette: Palette;
}) {
  const currency = menu.business.currency;
  const onSale = product.compareAtPrice > product.price && product.price > 0;

  if (product.variants.length > 0) {
    const min = Math.min(...product.variants.map((variant) => variant.price));
    return (
      <span
        className={cn("font-semibold whitespace-nowrap", compact ? "text-[0.82rem]" : "text-[1rem]")}
        style={{ color: menu.theme.primaryColor }}
      >
        Desde {formatPrice(min, currency)}
      </span>
    );
  }

  return (
    <span className="flex items-baseline gap-1.5 whitespace-nowrap">
      {onSale ? (
        <span
          className={cn("line-through", compact ? "text-[0.68rem]" : "text-[0.8rem]")}
          style={{ color: palette.muted }}
        >
          {formatPrice(product.compareAtPrice, currency)}
        </span>
      ) : null}
      <span
        className={cn("font-semibold", compact ? "text-[0.82rem]" : "text-[1rem]")}
        style={{ color: menu.theme.primaryColor }}
      >
        {formatPrice(product.price, currency)}
      </span>
    </span>
  );
}

function MetaRow({
  product,
  compact,
  palette,
}: {
  product: MenuProduct;
  compact: boolean;
  palette: Palette;
}) {
  const items: { icon: React.ReactNode; label: string }[] = [];
  if (product.prepTime > 0) {
    items.push({
      icon: <Clock className="size-3" strokeWidth={1.8} aria-hidden />,
      label: `${product.prepTime} min`,
    });
  }
  if (product.servings.trim()) {
    items.push({
      icon: <Users className="size-3" strokeWidth={1.8} aria-hidden />,
      label: product.servings,
    });
  }
  if (product.calories > 0) {
    items.push({
      icon: <Flame className="size-3" strokeWidth={1.8} aria-hidden />,
      label: `${product.calories} kcal`,
    });
  }
  if (items.length === 0) return null;

  return (
    <div
      className={cn(
        "mt-2 flex flex-wrap items-center gap-3",
        compact ? "text-[0.65rem]" : "text-[0.72rem]",
      )}
      style={{ color: palette.muted }}
    >
      {items.map((item) => (
        <span key={item.label} className="inline-flex items-center gap-1">
          {item.icon}
          {item.label}
        </span>
      ))}
    </div>
  );
}

function TagRow({
  product,
  compact,
  menu,
}: {
  product: MenuProduct;
  compact: boolean;
  menu: DigitalMenu;
}) {
  const onSale = product.compareAtPrice > product.price && product.price > 0;
  if (product.tags.length === 0 && product.available && !onSale) return null;

  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {!product.available ? (
        <span
          className={cn(
            "rounded-full border px-2 py-0.5 font-medium",
            compact ? "text-[0.6rem]" : "text-[0.68rem]",
          )}
          style={{ borderColor: "var(--m-border)", color: "var(--m-muted)" }}
        >
          Agotado
        </span>
      ) : null}

      {onSale ? (
        <span
          className={cn(
            "rounded-full px-2 py-0.5 font-semibold text-white",
            compact ? "text-[0.6rem]" : "text-[0.68rem]",
          )}
          style={{ backgroundColor: "#B4231F" }}
        >
          Oferta
        </span>
      ) : null}

      {product.tags.map((tag) => (
        <span
          key={tag}
          className={cn(
            "rounded-full px-2 py-0.5 font-medium capitalize",
            compact ? "text-[0.6rem]" : "text-[0.68rem]",
          )}
          style={{
            backgroundColor: `${menu.theme.primaryColor}1F`,
            color: menu.theme.primaryColor,
          }}
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

function AllergenLine({
  product,
  compact,
  palette,
}: {
  product: MenuProduct;
  compact: boolean;
  palette: Palette;
}) {
  if (product.allergens.length === 0) return null;
  const labels = product.allergens
    .map((id) => PRODUCT_ALLERGENS.find((item) => item.id === id)?.label ?? id)
    .join(" · ");

  return (
    <p
      className={cn("mt-1.5", compact ? "text-[0.62rem]" : "text-[0.7rem]")}
      style={{ color: palette.muted }}
    >
      Contiene: {labels}
    </p>
  );
}

function ProductCard({
  product,
  menu,
  compact,
  palette,
}: {
  product: MenuProduct;
  menu: DigitalMenu;
  compact: boolean;
  palette: Palette;
}) {
  const { cardStyle } = menu.theme;
  const dim = !product.available;
  const shadow =
    menu.theme.background === "dark" ? "none" : "0 1px 2px rgba(22,19,15,0.05)";

  if (cardStyle === "image") {
    return (
      <article
        className={cn("overflow-hidden rounded-2xl", dim && "opacity-60")}
        style={{ backgroundColor: palette.surface, boxShadow: shadow }}
      >
        <div
          className="relative aspect-[4/3] w-full overflow-hidden"
          style={{ backgroundColor: palette.border }}
        >
          {product.image ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              className="size-full object-cover"
            />
          ) : (
            <span
              className="flex size-full items-center justify-center text-[0.7rem]"
              style={{ color: palette.muted }}
            >
              Sin foto
            </span>
          )}
          {product.featured ? (
            <span
              className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.6rem] font-semibold text-white"
              style={{ backgroundColor: menu.theme.primaryColor }}
            >
              <Star className="size-2.5" strokeWidth={2.4} aria-hidden />
              Recomendado
            </span>
          ) : null}
        </div>

        <div className="p-3">
          <div className="flex items-start justify-between gap-2">
            <p className={cn("font-semibold", compact ? "text-[0.82rem]" : "text-[0.95rem]")}>
              {product.name}
            </p>
            <PriceLabel product={product} menu={menu} compact={compact} palette={palette} />
          </div>
          {product.description ? (
            <p
              className={cn(
                "mt-1 line-clamp-2 leading-snug",
                compact ? "text-[0.7rem]" : "text-[0.8rem]",
              )}
              style={{ color: palette.muted }}
            >
              {product.description}
            </p>
          ) : null}
          <MetaRow product={product} compact={compact} palette={palette} />
          <TagRow product={product} compact={compact} menu={menu} />
          <AllergenLine product={product} compact={compact} palette={palette} />
        </div>
      </article>
    );
  }

  return (
    <article
      className={cn(
        "flex items-start gap-3",
        cardStyle === "rounded" ? "rounded-2xl p-3" : "border-b pb-3",
        dim && "opacity-60",
      )}
      style={
        cardStyle === "rounded"
          ? { backgroundColor: palette.surface, boxShadow: shadow }
          : { borderColor: palette.border }
      }
    >
      {product.image ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className={cn("shrink-0 rounded-xl object-cover", compact ? "size-16" : "size-24")}
        />
      ) : null}

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-3">
          <p
            className={cn(
              "font-semibold",
              compact ? "text-[0.85rem]" : "text-[1rem]",
              menu.theme.menuStyle === "elegant" && "tracking-[0.04em]",
            )}
          >
            {product.name}
            {product.featured ? (
              <Star
                className="ml-1.5 inline size-3"
                style={{ color: menu.theme.primaryColor }}
                strokeWidth={2.4}
                aria-hidden
              />
            ) : null}
          </p>
          <PriceLabel product={product} menu={menu} compact={compact} palette={palette} />
        </div>

        {product.description ? (
          <p
            className={cn("mt-1 leading-snug", compact ? "text-[0.72rem]" : "text-[0.85rem]")}
            style={{ color: palette.muted }}
          >
            {product.description}
          </p>
        ) : null}

        {product.variants.length > 0 ? (
          <ul className="mt-2 space-y-1">
            {product.variants.map((variant) => (
              <li
                key={variant.id}
                className={cn(
                  "flex justify-between gap-3",
                  compact ? "text-[0.7rem]" : "text-[0.8rem]",
                )}
                style={{ color: palette.muted }}
              >
                <span>{variant.name}</span>
                <span style={{ color: palette.text }}>
                  {formatPrice(variant.price, menu.business.currency)}
                </span>
              </li>
            ))}
          </ul>
        ) : null}

        {product.addons.filter((addon) => addon.active).length > 0 ? (
          <p
            className={cn("mt-2", compact ? "text-[0.66rem]" : "text-[0.75rem]")}
            style={{ color: palette.muted }}
          >
            Extras:{" "}
            {product.addons
              .filter((addon) => addon.active)
              .map((addon) => `${addon.name} +${formatPrice(addon.price, menu.business.currency)}`)
              .join(" · ")}
          </p>
        ) : null}

        <MetaRow product={product} compact={compact} palette={palette} />
        <TagRow product={product} compact={compact} menu={menu} />
        <AllergenLine product={product} compact={compact} palette={palette} />
      </div>
    </article>
  );
}

function FeaturedCard({
  product,
  menu,
  compact,
  palette,
}: {
  product: MenuProduct;
  menu: DigitalMenu;
  compact: boolean;
  palette: Palette;
}) {
  return (
    <article
      className={cn("shrink-0 overflow-hidden rounded-2xl", compact ? "w-[11rem]" : "w-[15rem]")}
      style={{
        backgroundColor: palette.surface,
        boxShadow: menu.theme.background === "dark" ? "none" : "0 1px 2px rgba(22,19,15,0.05)",
      }}
    >
      <div
        className={cn("relative w-full overflow-hidden", compact ? "h-20" : "h-28")}
        style={{ backgroundColor: palette.border }}
      >
        {product.image ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="size-full object-cover"
          />
        ) : (
          <span
            className="flex size-full items-center justify-center text-[0.65rem]"
            style={{ color: palette.muted }}
          >
            Sin foto
          </span>
        )}
      </div>
      <div className="p-3">
        <p className={cn("truncate font-semibold", compact ? "text-[0.78rem]" : "text-[0.9rem]")}>
          {product.name}
        </p>
        <div className="mt-1.5">
          <PriceLabel product={product} menu={menu} compact={compact} palette={palette} />
        </div>
      </div>
    </article>
  );
}
