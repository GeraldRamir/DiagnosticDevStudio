"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  ExternalLink,
  Loader,
  TriangleAlert,
  Monitor,
  Smartphone,
  Tablet,
} from "lucide-react";
import { BusinessStep } from "@/components/tools/menu/editor/business-step";
import { ContentStep } from "@/components/tools/menu/editor/content-step";
import { PublishStep } from "@/components/tools/menu/editor/publish-step";
import { ThemeStep } from "@/components/tools/menu/editor/theme-step";
import { PhoneFrame } from "@/components/tools/menu/phone-frame";
import { MenuPublic } from "@/components/tools/menu/public/menu-public";
import { useMenuEditor } from "@/components/tools/menu/use-menu-editor";
import { inputClass } from "@/components/tools/menu/editor/menu-form-ui";
import { menuPath } from "@/lib/tools/menu/slug";
import { MENU_STATUS_LABEL } from "@/lib/tools/menu/types";
import { cn } from "@/lib/utils";

type Step = "negocio" | "menu" | "diseno" | "publicar";

const STEPS: { id: Step; number: string; label: string }[] = [
  { id: "negocio", number: "01", label: "Negocio" },
  { id: "menu", number: "02", label: "Menú" },
  { id: "diseno", number: "03", label: "Diseño" },
  { id: "publicar", number: "04", label: "Publicar" },
];

/** Editor del menú: pasos a la izquierda, teléfono con la vista real a la derecha. */
export function MenuEditor({ menuId }: { menuId: string }) {
  const editor = useMenuEditor(menuId);
  const [step, setStep] = useState<Step>("negocio");
  const [mobilePreview, setMobilePreview] = useState(false);
  const [device, setDevice] = useState<"phone" | "tablet">("phone");
  const { menu, loading, saveState } = editor;

  if (loading) {
    return (
      <p className="py-20 text-center text-[0.9rem] text-[#16161c]/60">Cargando tu menú…</p>
    );
  }

  if (!menu) {
    return (
      <div className="rounded-2xl border border-dashed border-[#16161c]/15 bg-white px-6 py-16 text-center">
        <h1 className="text-[1.2rem] font-semibold text-[#16161c]">
          No encontramos este menú
        </h1>
        <p className="mx-auto mt-2 max-w-md text-[0.85rem] leading-relaxed text-[#16161c]/60">
          Los menús se guardan en el navegador donde se crearon. Abre el enlace en ese mismo
          dispositivo o crea uno nuevo.
        </p>
        <Link
          href="/tools/menu-digital"
          className="mt-6 inline-flex h-10 items-center rounded-lg bg-[#16161c] px-4 text-[0.85rem] font-semibold text-white"
        >
          Volver a mis menús
        </Link>
      </div>
    );
  }

  const preview = <MenuPublic menu={menu} scale="phone" />;

  return (
    <div>
      {/* Barra superior */}
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href="/tools/menu-digital"
          className="inline-flex items-center gap-2 text-[0.82rem] text-[#16161c]/65 transition-colors hover:text-[#16161c]"
        >
          <ArrowLeft className="size-4" strokeWidth={1.8} aria-hidden />
          Mis menús
        </Link>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[0.72rem] font-medium text-[#16161c]">
          <span
            className="size-1.5 rounded-full"
            style={{ backgroundColor: menu.status === "published" ? "#1F6B3A" : "#C9861A" }}
            aria-hidden
          />
          {MENU_STATUS_LABEL[menu.status]}
        </span>

        <span
          className="ml-auto inline-flex items-center gap-1.5 text-[0.75rem] text-[#16161c]/55"
          role="status"
          aria-live="polite"
        >
          {saveState === "error" ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F7E7E6] px-2.5 py-1 text-[#B4231F]">
              <TriangleAlert className="size-3.5" strokeWidth={1.8} aria-hidden />
              Sin espacio para guardar: usa fotos más livianas
            </span>
          ) : saveState === "saving" ? (
            <>
              <Loader className="size-3.5 animate-spin" strokeWidth={1.8} aria-hidden />
              Guardando…
            </>
          ) : saveState === "saved" ? (
            <>
              <Check className="size-3.5 text-[#1F6B3A]" strokeWidth={2} aria-hidden />
              Guardado
            </>
          ) : (
            "Guardado automático activo"
          )}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <input
          value={menu.name}
          onChange={(event) => editor.rename(event.target.value.slice(0, 60))}
          className={cn(inputClass, "h-11 max-w-sm text-[1rem] font-medium")}
          aria-label="Nombre del menú"
        />
        <button
          type="button"
          onClick={() => setMobilePreview((value) => !value)}
          className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-lg border border-[#16161c]/15 bg-white px-4 text-[0.82rem] font-medium text-[#16161c] xl:hidden"
        >
          <Smartphone className="size-4" strokeWidth={1.8} aria-hidden />
          {mobilePreview ? "Seguir editando" : "Ver preview"}
        </button>
      </div>

      {/* Pasos */}
      <nav aria-label="Pasos del editor" className="mt-5">
        <ol className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {STEPS.map((item) => {
            const active = step === item.id;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => {
                    setStep(item.id);
                    setMobilePreview(false);
                  }}
                  aria-current={active ? "step" : undefined}
                  className={cn(
                    "inline-flex h-11 cursor-pointer items-center gap-2 rounded-full px-4 text-[0.82rem] font-medium whitespace-nowrap transition-colors",
                    active ? "bg-[#16161c] text-white" : "bg-white text-[#16161c] hover:bg-[#F1ECE8]",
                  )}
                >
                  <span className={active ? "text-white/60" : "text-[#16161c]/45"}>
                    {item.number}
                  </span>
                  {item.label}
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      <div className="mt-4 grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_23rem]">
        <div className={cn(mobilePreview && "hidden xl:block")}>
          {step === "negocio" ? <BusinessStep menu={menu} editor={editor} /> : null}
          {step === "menu" ? <ContentStep menu={menu} editor={editor} /> : null}
          {step === "diseno" ? <ThemeStep menu={menu} editor={editor} /> : null}
          {step === "publicar" ? <PublishStep menu={menu} editor={editor} /> : null}
        </div>

        <aside
          className={cn("xl:sticky xl:top-24", mobilePreview ? "block" : "hidden xl:block")}
          aria-label="Vista previa del menú"
        >
          <div className="rounded-[1.75rem] border border-[#16161c]/8 bg-white p-4 shadow-[0_1px_2px_rgba(22,19,15,0.04)]">
            {/* Barra de herramientas de la preview */}
            <div className="mb-4 flex items-center justify-between gap-2">
              <div
                className="inline-flex items-center gap-0.5 rounded-lg bg-[#F1ECE8] p-0.5"
                role="group"
                aria-label="Tamaño de la vista previa"
              >
                {(
                  [
                    { id: "phone", label: "Móvil", icon: Smartphone },
                    { id: "tablet", label: "Tablet", icon: Tablet },
                  ] as const
                ).map((item) => {
                  const Icon = item.icon;
                  const active = device === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setDevice(item.id)}
                      title={item.label}
                      className={cn(
                        "inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-md px-2.5 text-[0.72rem] font-medium transition-colors",
                        active ? "bg-white text-[#16161c] shadow-sm" : "text-[#16161c]/60",
                      )}
                    >
                      <Icon className="size-3.5" strokeWidth={1.8} aria-hidden />
                      {item.label}
                    </button>
                  );
                })}
              </div>

              <Link
                href={menuPath(menu.slug)}
                target="_blank"
                onClick={() => editor.flush()}
                className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[#16161c]/15 px-2.5 text-[0.72rem] font-medium text-[#16161c] transition-colors hover:border-[#16161c]/35"
              >
                <ExternalLink className="size-3.5" strokeWidth={1.8} aria-hidden />
                Abrir
              </Link>
            </div>

            <PhoneFrame device={device}>{preview}</PhoneFrame>

            <p className="mt-4 flex items-center gap-1.5 text-center text-[0.72rem] text-[#16161c]/55">
              <Monitor className="size-3.5 shrink-0" strokeWidth={1.8} aria-hidden />
              Así lo verá tu cliente. Se actualiza mientras editas.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
