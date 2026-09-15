import {
  WEEK_DAYS,
  type DigitalMenu,
  type MenuBusiness,
  type MenuTheme,
  type MenuVisibility,
  type ScheduleDay,
} from "@/lib/tools/menu/types";

export function defaultSchedule(): ScheduleDay[] {
  return WEEK_DAYS.map((day) => ({
    day: day.id,
    open: day.id !== "sunday",
    from: "09:00",
    to: "22:00",
  }));
}

export const DEFAULT_BUSINESS: MenuBusiness = {
  name: "",
  description: "",
  logo: null,
  cover: null,
  announcement: "",
  phone: "",
  whatsapp: "",
  instagram: "",
  address: "",
  mapsUrl: "",
  currency: "RD$",
  schedule: defaultSchedule(),
};

export const DEFAULT_VISIBILITY: MenuVisibility = {
  whatsapp: true,
  instagram: true,
  phone: false,
  address: true,
  schedule: true,
  search: true,
  featured: true,
};

export const DEFAULT_THEME: MenuTheme = {
  primaryColor: "#B4472C",
  secondaryColor: "#1C1917",
  background: "light",
  font: "sans",
  cardStyle: "rounded",
  menuStyle: "modern",
  heroStyle: "cover",
};

/** Presets visuales listos para aplicar de un clic. */
export const THEME_PRESETS: { id: string; label: string; description: string; theme: MenuTheme }[] =
  [
    {
      id: "moderno",
      label: "Moderno",
      description: "Tarjetas con foto y acento cálido.",
      theme: {
        primaryColor: "#B4472C",
        secondaryColor: "#1C1917",
        background: "light",
        font: "sans",
        cardStyle: "image",
        menuStyle: "modern",
        heroStyle: "cover",
      },
    },
    {
      id: "clasico",
      label: "Clásico",
      description: "Lista sobria, ideal para carta de comida.",
      theme: {
        primaryColor: "#1F6B3A",
        secondaryColor: "#14281D",
        background: "light",
        font: "serif",
        cardStyle: "minimal",
        menuStyle: "classic",
        heroStyle: "simple",
      },
    },
    {
      id: "elegante",
      label: "Elegante",
      description: "Fondo oscuro con detalles dorados.",
      theme: {
        primaryColor: "#C9A227",
        secondaryColor: "#0F0F10",
        background: "dark",
        font: "serif",
        cardStyle: "rounded",
        menuStyle: "elegant",
        heroStyle: "centered",
      },
    },
    {
      id: "fresco",
      label: "Fresco",
      description: "Colores suaves para cafés y reposterías.",
      theme: {
        primaryColor: "#2F7D8C",
        secondaryColor: "#123038",
        background: "light",
        font: "rounded",
        cardStyle: "rounded",
        menuStyle: "modern",
        heroStyle: "cover",
      },
    },
  ];

export const DEFAULT_STATS: DigitalMenu["stats"] = {
  views: 0,
  whatsappClicks: 0,
  instagramClicks: 0,
  qrScans: 0,
  productViews: {},
  lastViewedAt: null,
};

export const FONT_STACKS: Record<MenuTheme["font"], string> = {
  sans: "var(--font-inter), system-ui, sans-serif",
  serif: "Georgia, 'Times New Roman', serif",
  rounded: "'Trebuchet MS', 'Segoe UI', system-ui, sans-serif",
};

export const CURRENCIES = ["RD$", "US$", "€", "MX$", "COP$", "S/", "₡", "Q", "L", "₲"];
