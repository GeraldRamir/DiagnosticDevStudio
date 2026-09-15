"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Check,
  ChevronRight,
  Copy,
  ExternalLink,
  LayoutGrid,
  Pencil,
  Plus,
  QrCode,
  Share2,
  Sparkles,
  Trash2,
  UtensilsCrossed,
} from "lucide-react";
import { LOGO_SRC } from "@/lib/brand";
import { menuPath, menuUrl } from "@/lib/tools/menu/slug";
import { menuQrHref, shareMenu } from "@/lib/tools/menu/sharing";
import { menuRepository } from "@/lib/tools/menu/storage";
import {
  MENU_STATUS_LABEL,
  type DigitalMenu,
  type MenuStatus,
} from "@/lib/tools/menu/types";
import { cn } from "@/lib/utils";

const SURFACES = ["#F8D7D3", "#FBE3C0", "#D8EFE4", "#D7D8F7", "#F5DCEA", "#DCEBF8"];
const ACCENTS = ["#E08A80", "#D79A47", "#4BA37C", "#7C7BD6", "#C76FA0", "#5B8FBF"];

const FILTERS: { id: MenuStatus | "all"; label: string }[] = [
  { id: "all", label: "Todos" },
  { id: "published", label: "Publicados" },
  { id: "draft", label: "Borradores" },
  { id: "disabled", label: "Desactivados" },
];

/** Pantalla "Mis menús": catálogo de menús con el mismo lenguaje visual del catálogo de herramientas. */
export function MenusDashboard() {
  const router = useRouter();
  const [menus, setMenus] = useState<DigitalMenu[]>([]);
  const [filter, setFilter] = useState<MenuStatus | "all">("all");
  const [ready, setReady] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<DigitalMenu | null>(null);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("Menú principal");

  useEffect(() => {
    setMenus(menuRepository.list());
    setReady(true);
  }, []);

  const filtered = useMemo(
    () => (filter === "all" ? menus : menus.filter((menu) => menu.status === filter)),
    [menus, filter],
  );

  const totals = useMemo(
    () => ({
      published: menus.filter((menu) => menu.status === "published").length,
      draft: menus.filter((menu) => menu.status === "draft").length,
      products: menus.reduce((sum, menu) => sum + menu.products.length, 0),
    }),
    [menus],
  );

  function handleCreate() {
    const menu = menuRepository.create(newName);
    toast.success("Menú creado. Empieza por los datos del negocio.");
    router.push(`/tools/menu-digital/${menu.id}`);
  }

  function handleDuplicate(menu: DigitalMenu) {
    const copy = menuRepository.duplicate(menu.id);
    if (!copy) return;
    setMenus(menuRepository.list());
    toast.success(`“${copy.name}” duplicado.`);
  }

  function handleDelete() {
    if (!pendingDelete) return;
    menuRepository.remove(pendingDelete.id);
    setMenus(menuRepository.list());
    setPendingDelete(null);
    toast.success("Menú eliminado.");
  }

  async function handleShare(menu: DigitalMenu) {
    const result = await shareMenu({
      url: menuUrl(menu.slug),
      title: menu.business.name || menu.name,
      text: "Mira nuestro menú digital",
    });
    if (result === "shared") return;
    if (result === "copied") toast.success("Enlace copiado.");
    if (result === "failed") toast.error("No pudimos copiar el enlace.");
  }

  return (
    <div className="grid w-full items-start gap-6 xl:grid-cols-[minmax(0,1fr)_23.5rem] xl:gap-8">
      <div className="min-w-0">
        <h1 className="max-w-[12ch] text-[2.75rem] leading-[1.05] font-normal tracking-[-0.03em] text-[#16161c] sm:text-[3.5rem] lg:text-[4rem]">
          Crea tu menú digital
        </h1>
        <p className="mt-4 max-w-xl text-[0.95rem] leading-relaxed text-[#16161c]/70">
          Diseña un menú profesional para que tus clientes puedan verlo desde cualquier
          dispositivo, compartirlo por WhatsApp o escanearlo con un QR.
        </p>

        <div className="relative mt-8">
          <div className="flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {FILTERS.map((item) => {
              const active = filter === item.id;
              const count =
                item.id === "all"
                  ? menus.length
                  : menus.filter((menu) => menu.status === item.id).length;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFilter(item.id)}
                  className={cn(
                    "inline-flex h-[3.4rem] shrink-0 cursor-pointer items-center gap-3 rounded-full py-1.5 pr-7 pl-1.5 text-[0.88rem] font-medium whitespace-nowrap transition-colors",
                    active ? "bg-[#16161c] text-white" : "bg-[#F5EBE6] text-[#16161c]",
                  )}
                >
                  <span className="inline-flex size-11 items-center justify-center rounded-[0.9rem] bg-white text-[0.8rem] font-semibold text-[#16161c]">
                    {count}
                  </span>
                  {item.label}
                </button>
              );
            })}
          </div>
          <div
            className="pointer-events-none absolute inset-y-0 right-0 w-14 bg-gradient-to-l from-[#FAF8F7] to-transparent"
            aria-hidden
          />
        </div>

        <p className="mt-7 text-[0.95rem] text-[#16161c]/70">
          {filter === "all" ? "Tus menús" : FILTERS.find((item) => item.id === filter)?.label}
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setCreating(true)}
            className="group flex min-h-[10.5rem] cursor-pointer flex-col justify-between rounded-[1.25rem] border-2 border-dashed border-[#16161c]/15 bg-white/60 p-5 text-left transition-colors hover:border-[#16161c]/35"
          >
            <span className="inline-flex size-10 items-center justify-center rounded-xl bg-[#16161c] text-white">
              <Plus className="size-5" strokeWidth={1.8} aria-hidden />
            </span>
            <span>
              <span className="block text-[1.3rem] font-normal tracking-[-0.025em] text-[#16161c]">
                Crear mi menú
              </span>
              <span className="mt-1 block text-[0.8rem] text-[#16161c]/60">
                Empieza con los datos de tu negocio
              </span>
            </span>
          </button>

          {ready && filtered.length === 0 && menus.length > 0 ? (
            <p className="self-center text-[0.85rem] text-[#16161c]/60">
              No hay menús con ese estado.
            </p>
          ) : null}

          {filtered.map((menu, index) => (
            <MenuCard
              key={menu.id}
              menu={menu}
              surface={SURFACES[index % SURFACES.length]}
              accent={ACCENTS[index % ACCENTS.length]}
              onDuplicate={() => handleDuplicate(menu)}
              onDelete={() => setPendingDelete(menu)}
              onShare={() => void handleShare(menu)}
            />
          ))}
        </div>
      </div>

      {/* Rail derecho */}
      <aside
        className="flex flex-col gap-4 rounded-[1.75rem] bg-[#F7EDE8] p-5"
        aria-label="Resumen de tus menús"
      >
        <div className="flex flex-col items-center pb-1">
          <span className="flex size-[4.25rem] items-center justify-center rounded-full bg-white">
            <Image
              src={LOGO_SRC}
              alt=""
              width={819}
              height={1024}
              className="h-9 w-auto object-contain"
              sizes="48px"
            />
          </span>
          <p className="mt-3 text-[1.3rem] font-medium tracking-[-0.025em] text-[#16161c]">
            Menú Digital
          </p>
          <p className="mt-1 text-center text-[0.78rem] text-[#16161c]/60">
            Gratis, sin cuenta y listo para compartir
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-[1.1rem] bg-white px-3 py-3">
          <span className="inline-flex size-9 items-center justify-center rounded-full bg-[#F7EDE8]">
            <LayoutGrid className="size-4 text-[#16161c]" strokeWidth={1.8} aria-hidden />
          </span>
          <span className="flex-1 text-[0.9rem] font-medium text-[#16161c]">
            {menus.length} <span className="font-normal text-[#16161c]/70">menús</span>
          </span>
          <span className="flex -space-x-2" aria-hidden>
            {SURFACES.slice(0, 3).map((color) => (
              <span
                key={color}
                className="size-6 rounded-full border-2 border-white"
                style={{ backgroundColor: color }}
              />
            ))}
          </span>
          <ChevronRight className="size-4 text-[#16161c]/50" strokeWidth={1.8} aria-hidden />
        </div>

        <div className="rounded-[1.1rem] bg-white p-4">
          <p className="text-[0.88rem] font-medium text-[#16161c]">Tu progreso</p>
          <p className="mt-3 flex items-center gap-2 text-[1.45rem] font-normal tracking-[-0.025em] text-[#16161c]">
            {totals.products} productos
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="rounded-xl bg-[#D8EFE4] p-3">
              <p className="text-[1.25rem] font-medium text-[#16161c]">{totals.published}</p>
              <p className="text-[0.7rem] text-[#16161c]/70">Publicados</p>
            </div>
            <div className="rounded-xl bg-[#FBE3C0] p-3">
              <p className="text-[1.25rem] font-medium text-[#16161c]">{totals.draft}</p>
              <p className="text-[0.7rem] text-[#16161c]/70">Borradores</p>
            </div>
          </div>
        </div>

        <p className="text-[0.95rem] text-[#16161c]/70">Cómo funciona</p>
        <ol className="flex flex-col gap-2">
          {[
            { icon: UtensilsCrossed, label: "Carga tu carta", body: "Categorías y productos" },
            { icon: Sparkles, label: "Elige el estilo", body: "Colores y tipografía" },
            { icon: QrCode, label: "Publica y comparte", body: "Enlace + QR + WhatsApp" },
          ].map((step) => {
            const Icon = step.icon;
            return (
              <li
                key={step.label}
                className="flex items-center gap-3 rounded-[1.1rem] bg-white px-3 py-3"
              >
                <span className="inline-flex size-9 items-center justify-center rounded-lg bg-[#F7EDE8]">
                  <Icon className="size-4 text-[#16161c]" strokeWidth={1.8} aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className="block text-[0.85rem] font-medium text-[#16161c]">
                    {step.label}
                  </span>
                  <span className="block text-[0.72rem] text-[#16161c]/60">{step.body}</span>
                </span>
              </li>
            );
          })}
        </ol>
      </aside>

      {/* Modal: crear menú */}
      {creating ? (
        <Modal
          title="¿Cómo se llama este menú?"
          description="Es un nombre interno para que lo reconozcas: “Menú principal”, “Menú de desayuno”…"
          onClose={() => setCreating(false)}
        >
          <label htmlFor="menu-name" className="text-[0.8rem] font-semibold text-[#16161c]">
            Nombre del menú
          </label>
          <input
            id="menu-name"
            value={newName}
            onChange={(event) => setNewName(event.target.value.slice(0, 60))}
            className="mt-2 h-11 w-full rounded-xl border border-[#16161c]/15 px-3 text-[0.9rem] outline-none focus-visible:border-[#16161c]/50"
            autoFocus
          />
          <div className="mt-5 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setCreating(false)}
              className="h-10 cursor-pointer rounded-lg px-4 text-[0.85rem] font-medium text-[#16161c]/70 hover:text-[#16161c]"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleCreate}
              className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg bg-[#16161c] px-4 text-[0.85rem] font-semibold text-white"
            >
              <Check className="size-4" strokeWidth={1.8} aria-hidden />
              Crear menú
            </button>
          </div>
        </Modal>
      ) : null}

      {/* Modal: eliminar */}
      {pendingDelete ? (
        <Modal
          title="¿Seguro que quieres eliminar este menú?"
          description={`“${pendingDelete.name}” y todos sus productos se borrarán de este navegador. No se puede deshacer.`}
          onClose={() => setPendingDelete(null)}
        >
          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setPendingDelete(null)}
              className="h-10 cursor-pointer rounded-lg px-4 text-[0.85rem] font-medium text-[#16161c]/70 hover:text-[#16161c]"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg bg-[#B4231F] px-4 text-[0.85rem] font-semibold text-white"
            >
              <Trash2 className="size-4" strokeWidth={1.8} aria-hidden />
              Eliminar
            </button>
          </div>
        </Modal>
      ) : null}
    </div>
  );
}

function MenuCard({
  menu,
  surface,
  accent,
  onDuplicate,
  onDelete,
  onShare,
}: {
  menu: DigitalMenu;
  surface: string;
  accent: string;
  onDuplicate: () => void;
  onDelete: () => void;
  onShare: () => void;
}) {
  const published = menu.status === "published";

  return (
    <article
      className="flex min-h-[10.5rem] flex-col rounded-[1.25rem] p-5"
      style={{ backgroundColor: surface }}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-3 text-[0.8rem] font-medium text-[#16161c]">
          <span className="inline-flex size-9 items-center justify-center rounded-[0.7rem] bg-white">
            <UtensilsCrossed className="size-4" style={{ color: accent }} strokeWidth={1.8} aria-hidden />
          </span>
          {menu.products.length} productos
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[0.72rem] font-medium text-[#16161c]">
          <span
            className="size-1.5 rounded-full"
            style={{ backgroundColor: published ? "#1F6B3A" : "#C9861A" }}
            aria-hidden
          />
          {MENU_STATUS_LABEL[menu.status]}
        </span>
      </div>

      <h2 className="mt-auto pt-6 text-[1.3rem] leading-[1.2] font-normal tracking-[-0.025em] text-[#16161c]">
        {menu.business.name || menu.name}
      </h2>
      <p className="mt-1 truncate text-[0.75rem] text-[#16161c]/55">
        {menu.name} · /menu/{menu.slug}
      </p>

      <div className="mt-4 flex items-center gap-1.5">
        <Link
          href={`/tools/menu-digital/${menu.id}`}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#16161c] px-3 text-[0.78rem] font-semibold text-white transition-transform hover:-translate-y-0.5"
        >
          <Pencil className="size-3.5" strokeWidth={1.8} aria-hidden />
          Editar
        </Link>

        {published ? (
          <Link
            href={menuPath(menu.slug)}
            target="_blank"
            aria-label={`Ver ${menu.name} publicado`}
            title="Ver menú"
            className="inline-flex size-9 items-center justify-center rounded-lg bg-white/70 text-[#16161c] transition-colors hover:bg-white"
          >
            <ExternalLink className="size-4" strokeWidth={1.8} aria-hidden />
          </Link>
        ) : null}

        <a
          href={menuQrHref(menu)}
          aria-label={`Generar QR de ${menu.name}`}
          title="Generar QR"
          className="inline-flex size-9 items-center justify-center rounded-lg bg-white/70 text-[#16161c] transition-colors hover:bg-white"
        >
          <QrCode className="size-4" strokeWidth={1.8} aria-hidden />
        </a>

        <button
          type="button"
          onClick={onShare}
          aria-label={`Compartir ${menu.name}`}
          title="Compartir"
          className="inline-flex size-9 cursor-pointer items-center justify-center rounded-lg bg-white/70 text-[#16161c] transition-colors hover:bg-white"
        >
          <Share2 className="size-4" strokeWidth={1.8} aria-hidden />
        </button>

        <button
          type="button"
          onClick={onDuplicate}
          aria-label={`Duplicar ${menu.name}`}
          title="Duplicar"
          className="inline-flex size-9 cursor-pointer items-center justify-center rounded-lg bg-white/70 text-[#16161c] transition-colors hover:bg-white"
        >
          <Copy className="size-4" strokeWidth={1.8} aria-hidden />
        </button>

        <button
          type="button"
          onClick={onDelete}
          aria-label={`Eliminar ${menu.name}`}
          title="Eliminar"
          className="ml-auto inline-flex size-9 cursor-pointer items-center justify-center rounded-lg text-[#B4231F] transition-colors hover:bg-white/70"
        >
          <Trash2 className="size-4" strokeWidth={1.8} aria-hidden />
        </button>
      </div>
    </article>
  );
}

function Modal({
  title,
  description,
  children,
  onClose,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#16161c]/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-[0_24px_60px_rgba(22,19,15,0.25)]">
        <h2 className="text-[1.15rem] font-medium tracking-tight text-[#16161c]">{title}</h2>
        {description ? (
          <p className="mt-2 text-[0.85rem] leading-relaxed text-[#16161c]/65">{description}</p>
        ) : null}
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
