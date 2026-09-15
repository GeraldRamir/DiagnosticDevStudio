"use client";

import { Copy, FolderOpen, Trash2 } from "lucide-react";
import { relativeTime } from "@/lib/tools/qr/history";
import { getQrType, type QrHistoryEntry } from "@/lib/tools/qr/types";

/** Lista de códigos guardados en este navegador (localStorage). */
export function QrHistoryPanel({
  history,
  activeEntryId,
  onOpen,
  onDuplicate,
  onRemove,
}: {
  history: QrHistoryEntry[];
  activeEntryId: string | null;
  onOpen: (entry: QrHistoryEntry) => void;
  onDuplicate: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  if (history.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[#171311]/15 px-5 py-8 text-center">
        <p className="text-[0.88rem] font-semibold text-[#171311]">
          Todavía no has guardado códigos
        </p>
        <p className="mx-auto mt-2 max-w-sm text-[0.78rem] leading-relaxed text-[#6E6561]">
          Cuando pulses “Guardar” el código queda aquí, en este navegador, para reabrirlo o
          duplicarlo más tarde. No se sube a ningún servidor.
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {history.map((entry) => {
        const definition = getQrType(entry.type);
        const active = entry.id === activeEntryId;
        return (
          <li
            key={entry.id}
            className={
              active
                ? "rounded-xl border border-[#A61E22]/40 bg-[#F6E3E0]/60 p-3"
                : "rounded-xl border border-[#171311]/10 bg-white p-3"
            }
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-[0.88rem] font-semibold text-[#171311]">
                  {entry.name}
                </p>
                <p className="mt-0.5 text-[0.72rem] text-[#6E6561]">
                  {definition.label} · {relativeTime(entry.updatedAt)}
                </p>
                <p className="mt-1 truncate font-mono text-[0.7rem] text-[#6E6561]/80">
                  {entry.value}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={() => onOpen(entry)}
                  aria-label={`Abrir ${entry.name}`}
                  title="Abrir y editar"
                  className="inline-flex size-9 cursor-pointer items-center justify-center rounded-lg text-[#171311] transition-colors hover:bg-[#F1ECE8] focus-visible:ring-2 focus-visible:ring-[#A61E22]/30 focus-visible:outline-none"
                >
                  <FolderOpen className="size-4" strokeWidth={1.8} aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => onDuplicate(entry.id)}
                  aria-label={`Duplicar ${entry.name}`}
                  title="Duplicar"
                  className="inline-flex size-9 cursor-pointer items-center justify-center rounded-lg text-[#171311] transition-colors hover:bg-[#F1ECE8] focus-visible:ring-2 focus-visible:ring-[#A61E22]/30 focus-visible:outline-none"
                >
                  <Copy className="size-4" strokeWidth={1.8} aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => onRemove(entry.id)}
                  aria-label={`Eliminar ${entry.name}`}
                  title="Eliminar"
                  className="inline-flex size-9 cursor-pointer items-center justify-center rounded-lg text-[#A61E22] transition-colors hover:bg-[#F6E3E0] focus-visible:ring-2 focus-visible:ring-[#A61E22]/30 focus-visible:outline-none"
                >
                  <Trash2 className="size-4" strokeWidth={1.8} aria-hidden />
                </button>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
