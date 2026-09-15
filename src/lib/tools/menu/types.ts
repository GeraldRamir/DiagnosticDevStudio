/**
 * Modelo de datos del Menú Digital.
 * Pensado para vivir hoy en localStorage y migrar a backend sin cambiar la UI:
 * cada entidad ya tiene id propio, orden explícito y marcas de tiempo.
 */

export type MenuStatus = "draft" | "published" | "disabled";

export type WeekDay =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export type ScheduleDay = {
  day: WeekDay;
  open: boolean;
  from: string;
  to: string;
};

export type MenuBusiness = {
  name: string;
  description: string;
  logo: string | null;
  /** Foto de portada del menú (fachada, plato estrella, ambiente). */
  cover: string | null;
  /** Aviso corto arriba del menú: "Delivery hasta las 11 PM". */
  announcement: string;
  phone: string;
  whatsapp: string;
  instagram: string;
  address: string;
  /** Enlace de Google Maps; si está vacío se busca por dirección. */
  mapsUrl: string;
  currency: string;
  schedule: ScheduleDay[];
};

/** Qué datos del negocio se muestran en el menú público. */
export type MenuVisibility = {
  whatsapp: boolean;
  instagram: boolean;
  phone: boolean;
  address: boolean;
  schedule: boolean;
  search: boolean;
  featured: boolean;
};

export type MenuCategory = {
  id: string;
  name: string;
  /** Emoji opcional que acompaña el nombre. */
  icon: string;
  order: number;
  visible: boolean;
};

export type ProductVariant = {
  id: string;
  name: string;
  price: number;
};

export type ProductAddon = {
  id: string;
  name: string;
  price: number;
  active: boolean;
};

export type ProductTag = "nuevo" | "popular" | "recomendado" | "picante" | "vegetariano";

export type ProductAllergen =
  | "gluten"
  | "lacteos"
  | "huevo"
  | "mani"
  | "mariscos"
  | "soya";

export type MenuProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  /** Precio anterior; si es mayor que `price` el menú muestra la oferta. */
  compareAtPrice: number;
  image: string | null;
  categoryId: string;
  tags: ProductTag[];
  /** Minutos de preparación aproximados; 0 = no mostrar. */
  prepTime: number;
  /** "Para 2 personas", "350 g"… texto corto de porción. */
  servings: string;
  calories: number;
  allergens: ProductAllergen[];
  /** Código interno del negocio; nunca se muestra al cliente. */
  sku: string;
  available: boolean;
  featured: boolean;
  variants: ProductVariant[];
  addons: ProductAddon[];
  order: number;
};

export type MenuBackground = "light" | "dark";
export type MenuFont = "sans" | "serif" | "rounded";
export type MenuCardStyle = "minimal" | "rounded" | "image";
export type MenuLayoutStyle = "modern" | "classic" | "elegant";
export type MenuHeroStyle = "simple" | "cover" | "centered";

export type MenuTheme = {
  primaryColor: string;
  secondaryColor: string;
  background: MenuBackground;
  font: MenuFont;
  cardStyle: MenuCardStyle;
  menuStyle: MenuLayoutStyle;
  /** Cómo se presenta el encabezado del menú público. */
  heroStyle: MenuHeroStyle;
};

/**
 * Métricas preparadas para la versión con backend.
 * Hoy no se registran: solo fija el contrato para no rehacer la UI después.
 */
export type MenuStats = {
  views: number;
  whatsappClicks: number;
  instagramClicks: number;
  qrScans: number;
  productViews: Record<string, number>;
  lastViewedAt: string | null;
};

export type DigitalMenu = {
  id: string;
  slug: string;
  /** Nombre interno del menú: "Menú principal", "Menú de desayuno"… */
  name: string;
  status: MenuStatus;
  business: MenuBusiness;
  categories: MenuCategory[];
  products: MenuProduct[];
  theme: MenuTheme;
  settings: MenuVisibility;
  stats: MenuStats;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
};

export const WEEK_DAYS: { id: WeekDay; label: string; short: string }[] = [
  { id: "monday", label: "Lunes", short: "Lun" },
  { id: "tuesday", label: "Martes", short: "Mar" },
  { id: "wednesday", label: "Miércoles", short: "Mié" },
  { id: "thursday", label: "Jueves", short: "Jue" },
  { id: "friday", label: "Viernes", short: "Vie" },
  { id: "saturday", label: "Sábado", short: "Sáb" },
  { id: "sunday", label: "Domingo", short: "Dom" },
];

export const PRODUCT_ALLERGENS: { id: ProductAllergen; label: string }[] = [
  { id: "gluten", label: "Gluten" },
  { id: "lacteos", label: "Lácteos" },
  { id: "huevo", label: "Huevo" },
  { id: "mani", label: "Maní" },
  { id: "mariscos", label: "Mariscos" },
  { id: "soya", label: "Soya" },
];

export const PRODUCT_TAGS: { id: ProductTag; label: string }[] = [
  { id: "nuevo", label: "Nuevo" },
  { id: "popular", label: "Popular" },
  { id: "recomendado", label: "Recomendado" },
  { id: "picante", label: "Picante" },
  { id: "vegetariano", label: "Vegetariano" },
];

export const MENU_STATUS_LABEL: Record<MenuStatus, string> = {
  draft: "Borrador",
  published: "Publicado",
  disabled: "Desactivado",
};
