"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  AlertCircle,
  Check,
  Copy,
  ExternalLink,
  MessageCircle,
  QrCode,
  Share2,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SectionSwitch } from "@/components/ui/section-switch";
import { buildQrToolHref } from "@/lib/tools/cross-links";
import {
  DEFAULT_WHATSAPP_COUNTRY_ID,
  WHATSAPP_COUNTRIES,
  WHATSAPP_MESSAGE_MAX,
  WHATSAPP_PRESETS,
  displayWhatsAppUrl,
  generateWhatsAppLink,
  getWhatsappCountry,
  isValidWhatsAppNumber,
  normalizePhone,
  sanitizePhoneInput,
  type WhatsappCountryId,
} from "@/lib/tools/whatsapp/generator";
import {
  listWhatsappHistory,
  removeWhatsappLink,
  saveWhatsappLink,
  type WhatsappHistoryEntry,
} from "@/lib/tools/whatsapp/history";
import { copyToClipboard, shareOrCopy } from "@/lib/utils/clipboard";
import { sanitizeMultiline } from "@/lib/utils/sanitize";
import { trackEvent } from "@/lib/tracking";
import { cn } from "@/lib/utils";

const ERROR_TEXT = "Introduce un número de WhatsApp válido.";
const fieldClass =
  "mt-2 h-12 w-full rounded-2xl border border-[#16161c]/8 bg-[#f4f4f2] px-4 text-sm text-[#16161c] outline-none transition-[box-shadow,background-color] placeholder:text-[#8b9190] focus-visible:bg-white focus-visible:shadow-[0_0_0_2px_#90BF53]";

export function WhatsappGeneratorApp() {
  const router = useRouter();
  const resultRef = useRef<HTMLDivElement>(null);
  const [countryId, setCountryId] = useState<WhatsappCountryId>(DEFAULT_WHATSAPP_COUNTRY_ID);
  const [number, setNumber] = useState("");
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [clearOpen, setClearOpen] = useState(false);
  const [history, setHistory] = useState<WhatsappHistoryEntry[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const country = getWhatsappCountry(countryId);
  const cleanMessage = sanitizeMultiline(message, WHATSAPP_MESSAGE_MAX);
  const valid = isValidWhatsAppNumber(country.code, number);
  const phone = normalizePhone(country.code, number);
  const url = useMemo(
    () =>
      generateWhatsAppLink({
        countryCode: country.code,
        phoneNumber: number,
        message: cleanMessage,
      }),
    [country.code, number, cleanMessage],
  );

  useEffect(() => {
    setHistory(listWhatsappHistory());
  }, []);

  useEffect(() => {
    if (valid && error) setError(null);
  }, [valid, error]);

  function persistIfValid() {
    if (!valid) return;
    setHistory(
      saveWhatsappLink({
        id: editingId,
        name,
        countryId: country.id,
        countryCode: country.code,
        phone: number,
        message: cleanMessage,
        url,
      }),
    );
  }

  function ensureValid(): boolean {
    if (!valid) {
      setError(ERROR_TEXT);
      return false;
    }
    setError(null);
    persistIfValid();
    trackEvent("whatsapp_link_created", { toolId: "whatsapp-generator" });
    trackEvent("tool_completed", { toolId: "whatsapp-generator" });
    return true;
  }

  function revealResult() {
    resultRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function handleCreate(event: FormEvent) {
    event.preventDefault();
    if (!ensureValid()) return;
    revealResult();
  }

  async function copyLink() {
    if (!ensureValid()) return;
    const ok = await copyToClipboard(url);
    if (!ok) {
      toast.error("No se pudo copiar el enlace.");
      return;
    }
    toast.success("¡Enlace copiado!");
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  async function shareLink() {
    if (!ensureValid()) return;
    const result = await shareOrCopy({
      title: name.trim() || "WhatsApp de mi negocio",
      text: "Escríbenos por WhatsApp",
      url,
    });
    if (result === "shared") toast.success("Enlace compartido");
    if (result === "copied") {
      toast.success("¡Enlace copiado!");
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    }
  }

  function openLink() {
    if (!ensureValid()) return;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function goToQr() {
    if (!ensureValid()) return;
    router.push(
      buildQrToolHref({
        type: "whatsapp",
        phone,
        message: cleanMessage,
        name: name.trim() || "WhatsApp",
      }),
    );
  }

  const dirty = Boolean(number || message || name);

  function resetForm() {
    setCountryId(DEFAULT_WHATSAPP_COUNTRY_ID);
    setNumber("");
    setMessage("");
    setName("");
    setError(null);
    setEditingId(null);
    setCopied(false);
    setClearOpen(false);
  }

  function requestClear() {
    if (!dirty) {
      resetForm();
      return;
    }
    setClearOpen(true);
  }

  function loadEntry(entry: WhatsappHistoryEntry) {
    setCountryId(
      WHATSAPP_COUNTRIES.some((item) => item.id === entry.countryId)
        ? (entry.countryId as WhatsappCountryId)
        : DEFAULT_WHATSAPP_COUNTRY_ID,
    );
    setNumber(entry.phone);
    setMessage(entry.message);
    setName(entry.name);
    setEditingId(entry.id);
    setError(null);
    document.getElementById("generador")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <section id="generador" className="dst-container scroll-mt-24 pb-6">
      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(18rem,0.95fr)]">
        <form
          onSubmit={handleCreate}
          className="rounded-[1.8rem] bg-white p-5 shadow-[0_18px_50px_rgba(22,22,28,0.06)] sm:p-7"
        >
          <p className="text-[0.72rem] font-semibold tracking-[0.16em] text-[#6b716f] uppercase">
            Generador de Link de WhatsApp
          </p>
          <h2 className="mt-2 font-inter text-[1.65rem] leading-tight font-semibold tracking-[-0.035em] text-[#16161c]">
            Crea un enlace para que tus clientes puedan contactarte directamente por WhatsApp.
          </h2>

          <div className="mt-6 space-y-4">
            <div>
              <label htmlFor="wa-country" className="text-sm font-medium text-[#16161c]">
                Código de país
              </label>
              <select
                id="wa-country"
                value={countryId}
                onChange={(event) => setCountryId(event.target.value as WhatsappCountryId)}
                className={cn(fieldClass, "cursor-pointer")}
              >
                {WHATSAPP_COUNTRIES.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.flag} {item.name} (+{item.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="wa-phone" className="text-sm font-medium text-[#16161c]">
                Número de WhatsApp
              </label>
              <input
                id="wa-phone"
                inputMode="tel"
                autoComplete="tel-national"
                placeholder="809 555 1234"
                value={number}
                onChange={(event) => setNumber(sanitizePhoneInput(event.target.value))}
                className={fieldClass}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "wa-phone-error" : undefined}
              />
            </div>

            <div>
              <label htmlFor="wa-name" className="text-sm font-medium text-[#16161c]">
                Nombre del enlace{" "}
                <span className="font-normal text-[#8b9190]">(opcional)</span>
              </label>
              <input
                id="wa-name"
                value={name}
                onChange={(event) => setName(event.target.value.slice(0, 40))}
                placeholder="WhatsApp principal"
                className={fieldClass}
              />
            </div>

            <div>
              <div className="flex items-end justify-between gap-3">
                <label htmlFor="wa-message" className="text-sm font-medium text-[#16161c]">
                  Mensaje automático
                </label>
                <span className="text-[0.72rem] tabular-nums text-[#8b9190]">
                  {message.length} / {WHATSAPP_MESSAGE_MAX}
                </span>
              </div>
              <p className="mt-1 text-[0.75rem] leading-snug text-[#6b716f]">
                Este mensaje aparecerá escrito automáticamente cuando el cliente abra WhatsApp.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {WHATSAPP_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setMessage(preset.message)}
                    className={cn(
                      "inline-flex h-10 min-h-10 cursor-pointer items-center rounded-full px-3.5 text-[0.78rem] font-medium transition-colors",
                      message === preset.message
                        ? "bg-[#16161c] text-white"
                        : "bg-[#f4f4f2] text-[#16161c] hover:bg-[#90BF53]/25",
                    )}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
              <textarea
                id="wa-message"
                value={message}
                onChange={(event) => setMessage(event.target.value.slice(0, WHATSAPP_MESSAGE_MAX))}
                rows={4}
                maxLength={WHATSAPP_MESSAGE_MAX}
                placeholder="Hola, quiero información sobre sus productos."
                className="mt-3 min-h-28 w-full resize-none rounded-2xl border border-[#16161c]/8 bg-[#f4f4f2] px-4 py-3 text-sm outline-none transition-[box-shadow,background-color] placeholder:text-[#8b9190] focus-visible:bg-white focus-visible:shadow-[0_0_0_2px_#90BF53]"
              />
            </div>

            {error ? (
              <p
                id="wa-phone-error"
                role="alert"
                className="flex items-center gap-2 text-sm font-medium text-[#b42318]"
              >
                <AlertCircle className="size-4 shrink-0" strokeWidth={1.8} aria-hidden />
                {error}
              </p>
            ) : null}

            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="submit"
                className="inline-flex h-12 min-h-12 flex-1 cursor-pointer items-center justify-center rounded-full bg-[#90BF53] px-6 text-sm font-semibold text-[#13200a] transition-[filter,transform] duration-200 hover:-translate-y-0.5 hover:brightness-[0.97]"
              >
                Crear mi enlace
              </button>
              <button
                type="button"
                onClick={requestClear}
                className="inline-flex h-12 min-h-12 cursor-pointer items-center justify-center rounded-full px-5 text-sm font-medium text-[#6b716f] transition-colors hover:text-[#16161c]"
              >
                Limpiar
              </button>
            </div>

            <p className="text-[0.72rem] leading-snug text-[#8b9190]">
              Tu número se utiliza únicamente para generar el enlace en tu navegador.
            </p>
          </div>
        </form>

        <div ref={resultRef} className="lg:sticky lg:top-24">
          <SectionSwitch sectionKey={valid ? "ready" : "idle"}>
            {valid ? (
              <div className="rounded-[1.8rem] bg-[#16161c] p-5 text-white shadow-[0_24px_50px_rgba(22,22,28,0.16)] sm:p-6">
                <p className="inline-flex items-center gap-2 text-sm font-semibold text-[#90BF53]">
                  <Check className="size-4" strokeWidth={2.2} aria-hidden />
                  Tu enlace está listo
                </p>
                <p className="mt-3 text-[0.92rem] leading-relaxed text-white/55">
                  Los clientes podrán abrir una conversación contigo directamente en WhatsApp.
                </p>
                <div className="mt-5 rounded-[1.15rem] bg-white px-4 py-3">
                  <p className="font-mono text-[0.92rem] break-all text-[#16161c]">
                    {displayWhatsAppUrl(url)}
                  </p>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <ActionButton onClick={() => void copyLink()} icon={copied ? Check : Copy}>
                    {copied ? "Copiado" : "Copiar enlace"}
                  </ActionButton>
                  <ActionButton onClick={openLink} icon={ExternalLink}>
                    Probar enlace
                  </ActionButton>
                  <ActionButton onClick={() => void shareLink()} icon={Share2}>
                    Compartir
                  </ActionButton>
                  <ActionButton onClick={goToQr} icon={QrCode}>
                    Generar QR
                  </ActionButton>
                </div>
              </div>
            ) : (
              <div className="rounded-[1.8rem] border border-dashed border-[#16161c]/12 bg-white p-6">
                <span className="inline-flex size-11 items-center justify-center rounded-full bg-[#90BF53]/18 text-[#3d7a1f]">
                  <MessageCircle className="size-5" strokeWidth={1.8} aria-hidden />
                </span>
                <p className="mt-4 font-inter text-lg font-semibold tracking-[-0.03em] text-[#16161c]">
                  Tu enlace aparecerá aquí
                </p>
                <p className="mt-2 text-sm leading-relaxed text-[#6b716f]">
                  Escribe un número válido y el enlace se genera al momento. Luego cópialo, pruébalo
                  o crea un QR.
                </p>
              </div>
            )}
          </SectionSwitch>
        </div>
      </div>

      {history.length > 0 ? (
        <div className="mt-4 rounded-[1.6rem] bg-white p-5 sm:p-6">
          <h3 className="text-sm font-semibold text-[#16161c]">Mis enlaces</h3>
          <p className="mt-1 text-[0.75rem] text-[#8b9190]">
            Se guardan solo en este navegador.
          </p>
          <ul className="mt-4 space-y-2">
            {history.map((entry) => (
              <li
                key={entry.id}
                className="flex flex-col gap-2 rounded-2xl bg-[#f4f4f2] px-3 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-[#16161c]">{entry.name}</p>
                  <p className="truncate font-mono text-[0.72rem] text-[#6b716f]">
                    {displayWhatsAppUrl(entry.url)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1">
                  <GhostButton
                    onClick={() =>
                      void copyToClipboard(entry.url).then((ok) => {
                        if (ok) toast.success("¡Enlace copiado!");
                        else toast.error("No se pudo copiar el enlace.");
                      })
                    }
                  >
                    Copiar
                  </GhostButton>
                  <GhostButton onClick={() => window.open(entry.url, "_blank", "noopener,noreferrer")}>
                    Abrir
                  </GhostButton>
                  <GhostButton onClick={() => loadEntry(entry)}>Editar</GhostButton>
                  <button
                    type="button"
                    onClick={() => setHistory(removeWhatsappLink(entry.id))}
                    className="inline-flex h-10 min-h-10 cursor-pointer items-center gap-1 rounded-full px-3 text-[0.75rem] font-medium text-[#b42318]"
                    aria-label={`Eliminar ${entry.name}`}
                  >
                    <Trash2 className="size-3.5" strokeWidth={1.8} aria-hidden />
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <Dialog open={clearOpen} onOpenChange={setClearOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Limpiar el formulario?</DialogTitle>
            <DialogDescription>
              Se perderán el número y el mensaje que escribiste. Los enlaces guardados no se
              eliminan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setClearOpen(false)}>
              Cancelar
            </Button>
            <Button type="button" onClick={resetForm}>
              Limpiar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}

function ActionButton({
  children,
  onClick,
  icon: Icon,
}: {
  children: string;
  onClick: () => void;
  icon: typeof Copy;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-11 min-h-11 cursor-pointer items-center justify-center gap-1.5 rounded-full bg-white px-3 text-[0.78rem] font-semibold text-[#16161c] transition-transform duration-200 hover:-translate-y-0.5"
    >
      <Icon className="size-3.5" strokeWidth={1.8} aria-hidden />
      {children}
    </button>
  );
}

function GhostButton({
  children,
  onClick,
}: {
  children: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-10 min-h-10 cursor-pointer items-center rounded-full px-3 text-[0.75rem] font-medium text-[#16161c] hover:bg-white"
    >
      {children}
    </button>
  );
}
