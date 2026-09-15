"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { buildQrValue } from "@/lib/tools/qr/build";
import {
  copyQrImage,
  downloadQr,
  shareQrImage,
  type QrDownloadFormat,
} from "@/lib/tools/qr/download";
import {
  duplicateEntry,
  listHistory,
  removeEntry,
  saveEntry,
} from "@/lib/tools/qr/history";
import { getTemplate, type QrTemplate } from "@/lib/tools/qr/presets";
import { renderQrDataUrl } from "@/lib/tools/qr/render";
import { evaluateScannability } from "@/lib/tools/qr/scannability";
import {
  DEFAULT_QR_FORM,
  DEFAULT_QR_STYLE,
  QR_TYPES,
  type QrFormValues,
  type QrHistoryEntry,
  type QrStyle,
  type QrType,
} from "@/lib/tools/qr/types";
import { hasErrors, validateQrForm } from "@/lib/tools/qr/validators";
import { COUNTRY_CODES } from "@/lib/tools/whatsapp/generator";
import { copyToClipboard } from "@/lib/utils/clipboard";
import { trackEvent } from "@/lib/tracking";

/** Lado del QR en la vista previa: suficiente para leerlo y barato de regenerar. */
const PREVIEW_SIZE = 360;

/** Nombres de tipo que usaban versiones anteriores y los enlaces entre herramientas. */
const LEGACY_TYPES: Record<string, QrType> = {
  website: "url",
  web: "url",
  link: "url",
};

/**
 * Los enlaces desde otras herramientas mandan el número completo.
 * Separamos el código de país para que el selector quede coherente.
 */
function splitPhone(fullNumber: string): { countryCode: string; phone: string } | null {
  const digits = fullNumber.replace(/\D/g, "");
  if (!digits) return null;
  const codes = [...COUNTRY_CODES]
    .map((item) => item.code)
    .sort((a, b) => b.length - a.length);
  const match = codes.find((code) => digits.startsWith(code) && digits.length > code.length);
  if (!match) return { countryCode: "", phone: digits };
  return { countryCode: match, phone: digits.slice(match.length) };
}

function resolveType(value: string | null): QrType | null {
  if (!value) return null;
  const mapped = LEGACY_TYPES[value] ?? (value as QrType);
  return QR_TYPES.some((item) => item.id === mapped) ? mapped : null;
}

export type QrStudioState = ReturnType<typeof useQrStudio>;

export function useQrStudio() {
  const [name, setName] = useState("Mi código QR");
  const [type, setType] = useState<QrType>("whatsapp");
  const [form, setForm] = useState<QrFormValues>(DEFAULT_QR_FORM);
  const [style, setStyle] = useState<QrStyle>(DEFAULT_QR_STYLE);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [preview, setPreview] = useState<string>("");
  const [rendering, setRendering] = useState(false);
  const [renderError, setRenderError] = useState<string | null>(null);
  const [history, setHistory] = useState<QrHistoryEntry[]>([]);
  const [activeEntryId, setActiveEntryId] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  const requestId = useRef(0);

  /* Prefill desde la URL (enlaces desde otras herramientas) + historial local. */
  useEffect(() => {
    setHistory(listHistory());

    const params = new URLSearchParams(window.location.search);
    const nextType = resolveType(params.get("type"));
    if (nextType) setType(nextType);

    const phoneParam = params.get("phone");
    const split = phoneParam ? splitPhone(phoneParam) : null;

    setForm((current) => ({
      ...current,
      phone: split ? split.phone : current.phone,
      countryCode: params.get("country") ?? split?.countryCode ?? current.countryCode,
      message: params.get("message") ?? current.message,
      instagram: params.get("instagram") ?? current.instagram,
      url: params.get("url") ?? current.url,
      text: params.get("text") ?? current.text,
    }));

    const presetName = params.get("name");
    if (presetName) setName(presetName);
  }, []);

  const value = useMemo(() => buildQrValue(type, form), [type, form]);
  const errors = useMemo(() => validateQrForm(type, form), [type, form]);
  const isValid = !hasErrors(errors) && Boolean(value);

  const visibleErrors = useMemo(() => {
    const result: Record<string, string> = {};
    for (const [field, message] of Object.entries(errors)) {
      if (touched[field] && message) result[field] = message;
    }
    return result;
  }, [errors, touched]);

  const scan = useMemo(
    () => evaluateScannability({ style, valueLength: value.length }),
    [style, value],
  );

  /* Vista previa en tiempo real, con un pequeño debounce para no saturar el canvas. */
  useEffect(() => {
    if (!isValid) {
      setPreview("");
      setRenderError(null);
      return;
    }

    const id = requestId.current + 1;
    requestId.current = id;
    setRendering(true);

    const timer = window.setTimeout(() => {
      void renderQrDataUrl(value, { ...style, size: PREVIEW_SIZE })
        .then((dataUrl) => {
          if (requestId.current !== id) return;
          setPreview(dataUrl);
          setRenderError(null);
        })
        .catch(() => {
          if (requestId.current !== id) return;
          setRenderError("No pudimos generar el código con esos datos.");
        })
        .finally(() => {
          if (requestId.current === id) setRendering(false);
        });
    }, 180);

    return () => window.clearTimeout(timer);
  }, [value, style, isValid]);

  const updateForm = useCallback((patch: Partial<QrFormValues>) => {
    setForm((current) => ({ ...current, ...patch }));
    setTouched((current) => {
      const next = { ...current };
      for (const key of Object.keys(patch)) next[key] = true;
      return next;
    });
  }, []);

  const updateStyle = useCallback((patch: Partial<QrStyle>) => {
    setStyle((current) => ({ ...current, ...patch }));
  }, []);

  const touchAll = useCallback(() => {
    setTouched((current) => {
      const next = { ...current };
      for (const key of Object.keys(DEFAULT_QR_FORM)) next[key] = true;
      return next;
    });
  }, []);

  const applyTemplate = useCallback((template: QrTemplate) => {
    setType(template.type);
    setForm((current) => ({ ...DEFAULT_QR_FORM, ...current, ...template.form }));
    setStyle((current) => ({ ...current, ...template.style }));
    setName(template.name);
    setActiveEntryId(null);
  }, []);

  const applyTemplateById = useCallback(
    (templateId: string) => {
      const template = getTemplate(templateId);
      if (template) applyTemplate(template);
    },
    [applyTemplate],
  );

  const changeType = useCallback((next: QrType) => {
    setType(next);
    setActiveEntryId(null);
  }, []);

  const reset = useCallback(() => {
    setForm(DEFAULT_QR_FORM);
    setStyle(DEFAULT_QR_STYLE);
    setName("Mi código QR");
    setTouched({});
    setActiveEntryId(null);
  }, []);

  /* ── Acciones ───────────────────────────────────────────────── */

  const download = useCallback(
    async (format: QrDownloadFormat) => {
      if (!isValid) return false;
      await downloadQr({ value, style, name, format });
      trackEvent("qr_generated", { format, type });
      trackEvent("tool_completed", { toolId: "qr-generator" });
      return true;
    },
    [isValid, value, style, name, type],
  );

  const copyContent = useCallback(async () => {
    if (!value) return false;
    return copyToClipboard(value);
  }, [value]);

  const copyImage = useCallback(async () => {
    if (!isValid) return false;
    return copyQrImage(value, style);
  }, [isValid, value, style]);

  const share = useCallback(async () => {
    if (!isValid) return "unsupported" as const;
    return shareQrImage({ value, style, name });
  }, [isValid, value, style, name]);

  const saveToHistory = useCallback(() => {
    if (!isValid) return false;
    const entries = saveEntry({ id: activeEntryId, name, type, value, form, style });
    setHistory(entries);
    setActiveEntryId(entries.find((item) => item.value === value)?.id ?? null);
    setSavedAt(new Date().toISOString());
    return true;
  }, [isValid, activeEntryId, name, type, value, form, style]);

  const openEntry = useCallback((entry: QrHistoryEntry) => {
    setType(entry.type);
    setForm({ ...DEFAULT_QR_FORM, ...entry.form });
    setStyle({ ...DEFAULT_QR_STYLE, ...entry.style });
    setName(entry.name);
    setActiveEntryId(entry.id);
    setTouched({});
  }, []);

  const duplicate = useCallback((id: string) => {
    setHistory(duplicateEntry(id));
  }, []);

  const remove = useCallback(
    (id: string) => {
      setHistory(removeEntry(id));
      if (activeEntryId === id) setActiveEntryId(null);
    },
    [activeEntryId],
  );

  return {
    name,
    setName,
    type,
    changeType,
    form,
    updateForm,
    style,
    updateStyle,
    errors: visibleErrors,
    allErrors: errors,
    touchAll,
    isValid,
    value,
    preview,
    rendering,
    renderError,
    scan,
    history,
    activeEntryId,
    savedAt,
    applyTemplate,
    applyTemplateById,
    reset,
    download,
    copyContent,
    copyImage,
    share,
    saveToHistory,
    openEntry,
    duplicate,
    remove,
  };
}
