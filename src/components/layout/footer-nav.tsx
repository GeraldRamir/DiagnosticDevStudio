"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

/** Enlaces del footer, compactos en 2 columnas como la referencia. */
const LINKS = [
  { href: "/sobre", label: "Nosotros" },
  { href: "/tools", label: "Herramientas" },
  { href: "/como-funciona", label: "Cómo funciona" },
  { href: "/guias", label: "Guías" },
  { href: "/ayuda", label: "Ayuda" },
  { href: "/glosario", label: "Glosario" },
  { href: "/contacto", label: "Contacto" },
] as const;

export function FooterNav() {
  const pathname = usePathname();

  return (
    <div className="grid grid-cols-2 gap-x-8 gap-y-2">
      {LINKS.map((link) => {
        const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "inline-flex items-center gap-2 text-[0.84rem] transition-colors duration-200",
              active ? "text-white" : "text-white/55 hover:text-white",
            )}
          >
            {active ? (
              <span className="size-1.5 shrink-0 rounded-full bg-[#a78bfa]" aria-hidden />
            ) : null}
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}
