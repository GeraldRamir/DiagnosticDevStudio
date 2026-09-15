"use client";

import { useState } from "react";
import { toast } from "sonner";
import { motion } from "motion/react";
import {
  AtSign,
  Camera,
  Globe,
  MapPin,
  MessageCircle,
  MessageSquare,
  Phone,
  RotateCcw,
  Store,
  Type,
  UtensilsCrossed,
  Wifi,
} from "lucide-react";
import { QrFields } from "@/components/tools/qr/qr-fields";
import { QrHistoryPanel } from "@/components/tools/qr/qr-history-panel";
import { QrPreviewPanel } from "@/components/tools/qr/qr-preview-panel";
import { QrStylePanel } from "@/components/tools/qr/qr-style-panel";
import { qrInputClass } from "@/components/tools/qr/qr-ui";
import { useQrStudio } from "@/components/tools/qr/use-qr-studio";
import { SectionSwitch } from "@/components/ui/section-switch";
import { QR_BUSINESS_PRESETS, QR_TEMPLATES } from "@/lib/tools/qr/presets";
import { QR_TYPES, getQrType, type QrType } from "@/lib/tools/qr/types";
import { cn } from "@/lib/utils";

const PRESET_ICONS = {
  menu: UtensilsCrossed,
  whatsapp: MessageCircle,
  maps: MapPin,
  instagram: Camera,
  store: Store,
  wifi: Wifi,
} as const;

const TYPE_ICONS = {
  whatsapp: MessageCircle,
  link: Globe,
  instagram: Camera,
  menu: UtensilsCrossed,
  maps: MapPin,
  text: Type,
  email: AtSign,
  phone: Phone,
  sms: MessageSquare,
  wifi: Wifi,
} as const;

type Tab = "contenido" | "diseno" | "codigos";

const TABS: { id: Tab; label: string }[] = [
  { id: "contenido", label: "Contenido" },
  { id: "diseno", label: "Diseño" },
  { id: "codigos", label: "Mis códigos" },
];

/** Aplicación del generador: configuración a la izquierda, vista previa a la derecha. */
export function QrApp() {
  const studio = useQrStudio();
  const [tab, setTab] = useState<Tab>("contenido");
  const definition = getQrType(studio.type);

  async function handleDownload(format: "png" | "svg" | "jpg") {
    studio.touchAll();
    if (!studio.isValid) {
      toast.error("Revisa los datos antes de descargar.");
      return;
    }
    try {
      await studio.download(format);
      toast.success(`Código descargado en ${format.toUpperCase()}`);
    } catch {
      toast.error("No pudimos generar el archivo. Inténtalo otra vez.");
    }
  }

  async function handleCopyContent() {
    const ok = await studio.copyContent();
    if (ok) toast.success("Contenido copiado.");
    else toast.error("Tu navegador no permitió copiar.");
  }

  async function handleCopyImage() {
    const ok = await studio.copyImage();
    if (ok) {
      toast.success("Imagen copiada.");
      return;
    }
    const fallback = await studio.copyContent();
    toast[fallback ? "success" : "error"](
      fallback
        ? "Tu navegador no permite copiar imágenes: copiamos el contenido."
        : "Tu navegador no permite copiar desde aquí. Descarga el PNG.",
    );
  }

  async function handleShare() {
    const result = await studio.share();
    if (result === "shared") return;
    if (result === "cancelled") return;
    const copied = await studio.copyContent();
    toast.message("Este navegador no tiene compartir directo", {
      description: copied
        ? "Copiamos el contenido para que lo pegues donde quieras, o descarga el PNG."
        : "Descarga el PNG y compártelo como una imagen normal.",
    });
  }

  function handleSave() {
    studio.touchAll();
    if (!studio.saveToHistory()) {
      toast.error("Completa los datos antes de guardar.");
      return;
    }
    toast.success("Guardado en “Mis códigos”.");
    setTab("codigos");
  }

  return (
    <div className="space-y-3">
      <section aria-labelledby="qr-presets" className="rounded-2xl bg-[#FBF5F1] px-4 py-3.5">
        <p id="qr-presets" className="text-[0.78rem] font-semibold text-[#171311]">
          ¿Para qué necesitas tu QR?
        </p>
        <div className="mt-2.5 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {QR_BUSINESS_PRESETS.map((preset) => {
            const Icon = PRESET_ICONS[preset.icon];
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => {
                  studio.applyTemplateById(preset.templateId);
                  setTab("contenido");
                  toast.success(`Listo para tu QR de ${preset.label.toLowerCase()}.`);
                }}
                className="group flex cursor-pointer items-center gap-2.5 rounded-xl bg-white px-3 py-2.5 text-left transition-colors hover:bg-[#F6E3E0] focus-visible:ring-2 focus-visible:ring-[#A61E22]/30 focus-visible:outline-none"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#F1ECE8] transition-colors group-hover:bg-white">
                  <Icon className="size-4 text-[#A61E22]" strokeWidth={1.8} aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[0.78rem] font-semibold text-[#171311]">
                    {preset.label}
                  </span>
                  <span className="block truncate text-[0.68rem] text-[#6E6561]">
                    {preset.description}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_21rem]">
      <section className="rounded-2xl bg-[#FBF5F1] p-4 sm:p-5">
        {/* Encabezado: nombre + tipo */}
        <div className="grid gap-3 sm:grid-cols-[1fr_minmax(0,14rem)]">
          <div>
            <label
              htmlFor="qr-name"
              className="text-[0.78rem] font-semibold text-[#171311]"
            >
              Nombre del código
            </label>
            <input
              id="qr-name"
              value={studio.name}
              onChange={(event) => studio.setName(event.target.value.slice(0, 60))}
              className={cn(qrInputClass, "mt-1.5")}
              placeholder="QR menú principal"
              maxLength={60}
            />
          </div>
          <div>
            <label
              htmlFor="qr-type"
              className="text-[0.78rem] font-semibold text-[#171311]"
            >
              Tipo de QR
            </label>
            <select
              id="qr-type"
              value={studio.type}
              onChange={(event) => studio.changeType(event.target.value as QrType)}
              className={cn(qrInputClass, "mt-1.5 cursor-pointer")}
            >
              {QR_TYPES.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Accesos rápidos por tipo */}
        <div
          className="mt-3 flex gap-1.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="group"
          aria-label="Tipos de código QR"
        >
          {QR_TYPES.map((item) => {
            const Icon = TYPE_ICONS[item.icon];
            const active = item.id === studio.type;
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={active}
                onClick={() => studio.changeType(item.id)}
                className={cn(
                  "inline-flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-full px-3 text-[0.76rem] font-medium transition-colors focus-visible:ring-2 focus-visible:ring-[#A61E22]/30 focus-visible:outline-none",
                  active
                    ? "bg-[#171311] text-white"
                    : "bg-white text-[#171311] hover:bg-[#F1ECE8]",
                )}
              >
                <Icon
                  className="size-3.5"
                  strokeWidth={1.8}
                  style={{ color: active ? "#E8A9A5" : "#A61E22" }}
                  aria-hidden
                />
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Pestañas */}
        <div className="mt-4 flex items-center gap-1 border-b border-[#171311]/10">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              aria-current={tab === item.id ? "page" : undefined}
              className={cn(
                "relative -mb-px cursor-pointer px-3 py-2 text-[0.82rem] font-medium transition-colors focus-visible:ring-2 focus-visible:ring-[#A61E22]/30 focus-visible:outline-none",
                tab === item.id ? "text-[#171311]" : "text-[#6E6561] hover:text-[#171311]",
              )}
            >
              {item.label}
              {item.id === "codigos" && studio.history.length > 0 ? (
                <span className="ml-1.5 rounded-full bg-[#F1ECE8] px-1.5 py-0.5 text-[0.65rem] text-[#171311]">
                  {studio.history.length}
                </span>
              ) : null}
              {tab === item.id ? (
                <motion.span
                  layoutId="qr-tab-underline"
                  className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-[#A61E22]"
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                />
              ) : null}
            </button>
          ))}

          <button
            type="button"
            onClick={() => {
              studio.reset();
              toast.success("Formulario reiniciado.");
            }}
            className="ml-auto inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg px-2.5 text-[0.76rem] font-medium text-[#6E6561] transition-colors hover:text-[#171311] focus-visible:ring-2 focus-visible:ring-[#A61E22]/30 focus-visible:outline-none"
          >
            <RotateCcw className="size-3.5" strokeWidth={1.8} aria-hidden />
            Reiniciar
          </button>
        </div>

        {/* Contenido de la pestaña (altura acotada para no alargar la página) */}
        <div className="rp-scrollbar mt-4 max-h-[26rem] overflow-y-auto overflow-x-clip pr-1 lg:max-h-[24rem]">
          <SectionSwitch sectionKey={tab}>
          {tab === "contenido" ? (
            <div className="space-y-4">
              <p className="text-[0.76rem] text-[#6E6561]">{definition.helper}</p>
              <QrFields
                type={studio.type}
                form={studio.form}
                errors={studio.errors}
                onChange={studio.updateForm}
              />

              <div>
                <p className="text-[0.78rem] font-semibold text-[#171311]">
                  Plantillas rápidas
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {QR_TEMPLATES.map((template) => (
                    <button
                      key={template.id}
                      type="button"
                      onClick={() => {
                        studio.applyTemplate(template);
                        setTab("contenido");
                        toast.success(`Plantilla “${template.label}” aplicada.`);
                      }}
                      title={template.description}
                      className="inline-flex h-8 cursor-pointer items-center rounded-full border border-[#171311]/12 bg-white px-3 text-[0.74rem] font-medium text-[#171311] transition-colors hover:border-[#A61E22]/50 focus-visible:ring-2 focus-visible:ring-[#A61E22]/30 focus-visible:outline-none"
                    >
                      {template.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {tab === "diseno" ? (
            <QrStylePanel style={studio.style} onChange={studio.updateStyle} />
          ) : null}

          {tab === "codigos" ? (
            <QrHistoryPanel
              history={studio.history}
              activeEntryId={studio.activeEntryId}
              onOpen={(entry) => {
                studio.openEntry(entry);
                setTab("contenido");
                toast.success(`“${entry.name}” cargado.`);
              }}
              onDuplicate={(id) => {
                studio.duplicate(id);
                toast.success("Código duplicado.");
              }}
              onRemove={(id) => {
                studio.remove(id);
                toast.success("Código eliminado.");
              }}
            />
          ) : null}
          </SectionSwitch>
        </div>
      </section>

        <QrPreviewPanel
          studio={studio}
          onDownload={(format) => void handleDownload(format)}
          onCopyContent={() => void handleCopyContent()}
          onCopyImage={() => void handleCopyImage()}
          onShare={() => void handleShare()}
          onSave={handleSave}
        />
      </div>
    </div>
  );
}
