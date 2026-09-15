import type { ComponentType } from "react";

export function MarkDiagnostico() {
  return (
    <svg viewBox="0 0 24 24" className="size-[1.15em]" aria-hidden>
      <circle cx="12" cy="12" r="3.2" fill="currentColor" />
      <circle cx="12" cy="12" r="7.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function MarkInstagram() {
  return (
    <svg viewBox="0 0 24 24" className="size-[1.15em]" aria-hidden>
      <rect
        x="3.2"
        y="3.2"
        width="17.6"
        height="17.6"
        rx="5.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.15" cy="6.85" r="1.15" fill="currentColor" />
    </svg>
  );
}

export function MarkWhatsapp() {
  return (
    <svg viewBox="0 0 24 24" className="size-[1.15em]" aria-hidden>
      <path
        d="M5 19.2 5.9 15.4A8 8 0 1 1 8.7 19Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M8.7 9.4c.25 2.1 1.9 3.8 4 4.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function MarkQr() {
  return (
    <svg viewBox="0 0 24 24" className="size-[1.15em]" aria-hidden>
      <rect x="3" y="3" width="7.5" height="7.5" rx="1.3" fill="currentColor" />
      <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.3" fill="currentColor" />
      <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.3" fill="currentColor" />
      <rect x="13.5" y="13.5" width="3.2" height="3.2" fill="currentColor" />
      <rect x="18.2" y="13.5" width="2.8" height="2.8" fill="currentColor" />
      <rect x="13.5" y="18.4" width="2.8" height="2.6" fill="currentColor" />
      <rect x="17.6" y="17.8" width="3.4" height="3.2" fill="currentColor" />
    </svg>
  );
}

export function MarkMenu() {
  return (
    <svg viewBox="0 0 24 24" className="size-[1.15em]" aria-hidden>
      <path
        d="M4 7h16M4 12h16M4 17h11"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export type ToolMarkItem = {
  href: string;
  label: string;
  Mark: ComponentType;
};

export const TOOL_MARKS: readonly ToolMarkItem[] = [
  { href: "/tools/diagnostico-digital", label: "Diagnóstico", Mark: MarkDiagnostico },
  { href: "/tools/instagram-analyzer", label: "Instagram", Mark: MarkInstagram },
  { href: "/tools/whatsapp-generator", label: "WhatsApp", Mark: MarkWhatsapp },
  { href: "/tools/qr-generator", label: "QR", Mark: MarkQr },
  { href: "/tools/menu-digital", label: "Menú", Mark: MarkMenu },
];
