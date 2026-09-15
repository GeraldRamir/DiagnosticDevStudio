"use client";

import { useId, useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import {
  ACCEPTED_IMAGE_TYPES,
  imageValidationMessage,
  MAX_IMAGE_BYTES,
  validateImageFile,
} from "@/lib/utils/files";
import { cn } from "@/lib/utils";

export type UploadedImage = {
  id: string;
  name: string;
  dataUrl: string;
};

export function FileUploader({
  label,
  hint = "JPG, PNG o WEBP. Máximo 2 MB.",
  files,
  onChange,
  multiple = true,
  maxFiles = 6,
}: {
  label: string;
  hint?: string;
  files: UploadedImage[];
  onChange: (files: UploadedImage[]) => void;
  multiple?: boolean;
  maxFiles?: number;
}) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  async function addFiles(list: FileList | File[]) {
    const incoming = Array.from(list);
    const next = multiple ? [...files] : [];
    setError(null);

    for (const file of incoming) {
      if (next.length >= maxFiles) {
        setError(`Puedes subir hasta ${maxFiles} archivos.`);
        break;
      }
      const invalid = validateImageFile(file);
      if (invalid) {
        setError(imageValidationMessage(invalid));
        continue;
      }
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error("read"));
        reader.readAsDataURL(file);
      });
      next.push({
        id: `${file.name}-${file.size}-${file.lastModified}`,
        name: file.name,
        dataUrl,
      });
    }

    onChange(next);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div>
      <label htmlFor={inputId} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          if (event.dataTransfer.files.length) {
            void addFiles(event.dataTransfer.files);
          }
        }}
        className={cn(
          "mt-2 rounded-2xl border border-dashed border-border bg-white px-4 py-8 text-center transition-colors duration-200",
          dragging && "border-primary bg-accent/40",
        )}
      >
        <ImagePlus className="mx-auto size-6 text-muted-foreground" aria-hidden />
        <p className="mt-3 text-sm text-foreground">Arrastra imágenes o selecciónalas</p>
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept={ACCEPTED_IMAGE_TYPES.join(",")}
          multiple={multiple}
          className="sr-only"
          onChange={(event) => {
            if (event.target.files?.length) void addFiles(event.target.files);
          }}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-4 inline-flex h-11 min-w-[11rem] cursor-pointer items-center justify-center rounded-full border border-border px-4 text-sm font-medium transition-colors duration-200 hover:bg-secondary"
        >
          Elegir archivos
        </button>
        <p className="mt-2 text-[0.7rem] text-muted-foreground">
          Máximo {(MAX_IMAGE_BYTES / (1024 * 1024)).toFixed(0)} MB por archivo
        </p>
      </div>
      {error ? <p className="mt-2 text-sm text-destructive">{error}</p> : null}

      {files.length > 0 ? (
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {files.map((file) => (
            <li key={file.id} className="relative overflow-hidden rounded-xl border border-border">
              {/* Preview local (data URL); next/image no aplica aquí */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={file.dataUrl} alt={file.name} className="h-28 w-full object-cover" />
              <button
                type="button"
                aria-label={`Quitar ${file.name}`}
                onClick={() => onChange(files.filter((item) => item.id !== file.id))}
                className="absolute top-2 right-2 inline-flex size-8 cursor-pointer items-center justify-center rounded-full bg-white/90 text-foreground transition-colors duration-200 hover:bg-white"
              >
                <X className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
