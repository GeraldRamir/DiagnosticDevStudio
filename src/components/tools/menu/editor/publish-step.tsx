"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Check, Copy, ExternalLink, QrCode, Share2, X } from "lucide-react";
import {
  EditorSection,
  Field,
  Segmented,
  inputClass,
} from "@/components/tools/menu/editor/menu-form-ui";
import type { MenuEditorState } from "@/components/tools/menu/use-menu-editor";
import { menuPath, menuUrl } from "@/lib/tools/menu/slug";
import { menuQrHref, shareMenu } from "@/lib/tools/menu/sharing";
import type { DigitalMenu, MenuStatus } from "@/lib/tools/menu/types";
import { canPublish, publishChecklist } from "@/lib/tools/menu/validators";
import { copyToClipboard } from "@/lib/utils/clipboard";
import { cn } from "@/lib/utils";

/** Paso 04: dirección pública, estado y formas de compartir. */
export function PublishStep({
  menu,
  editor,
}: {
  menu: DigitalMenu;
  editor: MenuEditorState;
}) {
  const [slugDraft, setSlugDraft] = useState(menu.slug);
  const checklist = publishChecklist(menu);
  const ready = canPublish(menu);
  const url = menuUrl(menu.slug);

  async function handleCopy() {
    const ok = await copyToClipboard(url);
    toast[ok ? "success" : "error"](ok ? "Enlace copiado." : "No pudimos copiar el enlace.");
  }

  async function handleShare() {
    const result = await shareMenu({
      url,
      title: menu.business.name || menu.name,
      text: "Mira nuestro menú digital",
    });
    if (result === "copied") toast.success("Enlace copiado.");
    if (result === "failed") toast.error("No pudimos compartir el enlace.");
  }

  return (
    <div className="space-y-4">
      <EditorSection
        title="Antes de publicar"
        description="Lo mínimo para que el menú se entienda desde el celular de un cliente."
      >
        <ul className="space-y-2">
          {checklist.map((item) => (
            <li key={item.label} className="flex items-center gap-2.5 text-[0.85rem]">
              <span
                className={cn(
                  "inline-flex size-6 shrink-0 items-center justify-center rounded-full",
                  item.done ? "bg-[#90BF53] text-[#13200a]" : "bg-[#F1ECE8] text-[#16161c]/40",
                )}
              >
                {item.done ? (
                  <Check className="size-3.5" strokeWidth={2.2} aria-hidden />
                ) : (
                  <X className="size-3.5" strokeWidth={2.2} aria-hidden />
                )}
              </span>
              <span className={item.done ? "text-[#16161c]" : "text-[#16161c]/60"}>
                {item.label}
              </span>
            </li>
          ))}
        </ul>
      </EditorSection>

      <EditorSection
        title="Dirección del menú"
        description="Esta es la dirección que compartes con tus clientes."
      >
        <Field
          label="Enlace"
          htmlFor="menu-slug"
          hint="Solo letras, números y guiones. Si ya existe, le agregamos un número."
        >
          <div className="flex items-center gap-2">
            <span className="shrink-0 text-[0.8rem] text-[#16161c]/55">/menu/</span>
            <input
              id="menu-slug"
              value={slugDraft}
              onChange={(event) => setSlugDraft(event.target.value)}
              onBlur={() => {
                editor.updateSlug(slugDraft);
                toast.success("Dirección actualizada.");
              }}
              className={inputClass}
              placeholder="burger-house"
            />
          </div>
        </Field>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void handleCopy()}
            className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-[#16161c]/15 bg-white px-4 text-[0.82rem] font-medium text-[#16161c] hover:border-[#16161c]/35"
          >
            <Copy className="size-4" strokeWidth={1.8} aria-hidden />
            Copiar enlace
          </button>
          <button
            type="button"
            onClick={() => void handleShare()}
            className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-[#16161c]/15 bg-white px-4 text-[0.82rem] font-medium text-[#16161c] hover:border-[#16161c]/35"
          >
            <Share2 className="size-4" strokeWidth={1.8} aria-hidden />
            Compartir
          </button>
          <Link
            href={menuPath(menu.slug)}
            target="_blank"
            onClick={() => editor.flush()}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#16161c]/15 bg-white px-4 text-[0.82rem] font-medium text-[#16161c] hover:border-[#16161c]/35"
          >
            <ExternalLink className="size-4" strokeWidth={1.8} aria-hidden />
            Ver menú
          </Link>
          <Link
            href={menuQrHref(menu)}
            onClick={() => editor.flush()}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#16161c] px-4 text-[0.82rem] font-semibold text-white"
          >
            <QrCode className="size-4" strokeWidth={1.8} aria-hidden />
            Generar QR
          </Link>
        </div>

        <p className="mt-3 text-[0.72rem] leading-relaxed text-[#16161c]/55">
          El menú se guarda en este navegador. Para que tus clientes lo abran desde sus
          teléfonos hace falta la versión con servidor, que ya está contemplada en el código.
        </p>
      </EditorSection>

      <EditorSection title="Estado" description="Controla si el menú está disponible.">
        <Segmented<MenuStatus>
          label="Estado del menú"
          value={menu.status}
          onChange={(status) => {
            if (status === "published" && !ready) {
              toast.error("Completa la lista de arriba antes de publicar.");
              return;
            }
            editor.setStatus(status);
            toast.success(
              status === "published"
                ? "Menú publicado."
                : status === "draft"
                  ? "Menú guardado como borrador."
                  : "Menú desactivado.",
            );
          }}
          options={[
            { id: "draft", label: "Borrador" },
            { id: "published", label: "Publicado" },
            { id: "disabled", label: "Desactivado" },
          ]}
          hint={
            menu.status === "published"
              ? "Cualquiera con el enlace puede verlo."
              : menu.status === "disabled"
                ? "El enlace muestra un aviso de menú no disponible."
                : "Solo tú lo ves mientras lo preparas."
          }
        />
      </EditorSection>
    </div>
  );
}
