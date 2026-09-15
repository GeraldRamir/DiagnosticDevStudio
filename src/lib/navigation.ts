/**
 * Estructura de navegación del sitio.
 * El navbar y el footer leen de aquí para no desincronizarse.
 */
export type NavLink = {
  href: string;
  label: string;
  description?: string;
};

export type NavItem =
  | (NavLink & { type: "link" })
  | { type: "tools"; href: string; label: string }
  | { type: "menu"; label: string; items: NavLink[] };

export const NAV_ITEMS: readonly NavItem[] = [
  { type: "link", href: "/", label: "Inicio" },
  { type: "tools", href: "/tools", label: "Herramientas" },
  {
    type: "menu",
    label: "Aprende",
    items: [
      {
        href: "/guias",
        label: "Guías",
        description: "Pasos concretos para digitalizar tu negocio.",
      },
      {
        href: "/glosario",
        label: "Glosario",
        description: "Los términos digitales, explicados sin tecnicismos.",
      },
      {
        href: "/como-funciona",
        label: "Cómo funciona",
        description: "Qué hace la plataforma y qué pasa con tus datos.",
      },
    ],
  },
  { type: "link", href: "/ayuda", label: "Ayuda" },
  { type: "link", href: "/sobre", label: "Nosotros" },
] as const;

/** Secciones del footer, agrupadas. */
export const FOOTER_SECTIONS: readonly { title: string; links: NavLink[] }[] = [
  {
    title: "Plataforma",
    links: [
      { href: "/tools", label: "Herramientas" },
      { href: "/como-funciona", label: "Cómo funciona" },
      { href: "/sobre", label: "Nosotros" },
    ],
  },
  {
    title: "Recursos",
    links: [
      { href: "/guias", label: "Guías" },
      { href: "/glosario", label: "Glosario" },
      { href: "/ayuda", label: "Ayuda" },
    ],
  },
  {
    title: "Contacto",
    links: [
      { href: "/contacto", label: "Escríbenos" },
      { href: "/privacidad", label: "Privacidad" },
      { href: "/terminos", label: "Términos" },
    ],
  },
];
