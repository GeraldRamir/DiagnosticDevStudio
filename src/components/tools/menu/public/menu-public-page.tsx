"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MenuPublic } from "@/components/tools/menu/public/menu-public";
import { menuRepository } from "@/lib/tools/menu/storage";
import type { DigitalMenu } from "@/lib/tools/menu/types";

/**
 * Página pública del menú.
 * Lee el menú guardado y, mientras no exista backend, ajusta el título del
 * documento en el cliente para que la pestaña muestre el nombre del negocio.
 */
export function MenuPublicPage({ slug }: { slug: string }) {
  const [menu, setMenu] = useState<DigitalMenu | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const found = menuRepository.getBySlug(slug);
    setMenu(found);
    setReady(true);

    if (found?.business.name) {
      document.title = `${found.business.name} — Menú Digital`;
    }
  }, [slug]);

  if (!ready) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-white">
        <p className="text-[0.9rem] text-[#6E6561]">Cargando menú…</p>
      </div>
    );
  }

  if (!menu || menu.status === "disabled") {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-white px-6">
        <div className="max-w-sm text-center">
          <h1 className="text-[1.3rem] font-semibold text-[#16130F]">
            {menu ? "Este menú no está disponible" : "No encontramos este menú"}
          </h1>
          <p className="mt-3 text-[0.88rem] leading-relaxed text-[#6E6561]">
            {menu
              ? "El negocio lo desactivó temporalmente. Vuelve a intentarlo más tarde."
              : "Los menús se guardan en el navegador donde se crearon. Abre el enlace en ese mismo dispositivo o crea el tuyo gratis."}
          </p>
          <Link
            href="/tools/menu-digital"
            className="mt-6 inline-flex h-11 items-center rounded-full bg-[#16130F] px-5 text-[0.85rem] font-semibold text-white"
          >
            Crear mi menú digital
          </Link>
        </div>
      </div>
    );
  }

  const dark = menu.theme.background === "dark";

  return (
    <div className="min-h-dvh" style={{ backgroundColor: dark ? "#0F0F10" : "#FFFFFF" }}>
      <div className="mx-auto w-full max-w-2xl">
        <MenuPublic menu={menu} />

        <footer className="px-5 pb-8 text-center">
          <Link
            href="/tools/menu-digital"
            className="text-[0.7rem] transition-opacity hover:opacity-100"
            style={{ color: dark ? "#6F6B67" : "#A7A09B", opacity: 0.9 }}
          >
            Menú digital creado con Dev Studio
          </Link>
        </footer>
      </div>
    </div>
  );
}
