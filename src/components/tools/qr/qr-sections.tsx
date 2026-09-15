import Link from "next/link";
import {
  ArrowRight,
  AtSign,
  Camera,
  Coffee,
  Croissant,
  Download,
  Globe,
  ImagePlus,
  MapPin,
  MessageCircle,
  MessageSquare,
  Phone,
  Ruler,
  ScanLine,
  Scissors,
  ShoppingBag,
  Sparkles,
  Store,
  Type,
  UtensilsCrossed,
  Wifi,
} from "lucide-react";
import { QR_TYPES } from "@/lib/tools/qr/types";

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

/* ── Hero ─────────────────────────────────────────────────── */

export function QrHero() {
  return (
    <section className="px-[clamp(1.25rem,4vw,3rem)] pt-10 pb-8 text-center md:pt-14">
      <Link
        href="#estudio"
        className="inline-flex items-center gap-2 rounded-full border border-[#171311]/10 bg-white py-1.5 pr-4 pl-1.5 text-[0.78rem] text-[#171311] shadow-[0_1px_2px_rgba(23,19,17,0.05)]"
      >
        <span className="rounded-full bg-[#171311] px-2.5 py-1 text-[0.7rem] font-semibold text-white">
          Nuevo
        </span>
        Prueba las opciones de personalización
        <ArrowRight className="size-3.5" strokeWidth={1.8} aria-hidden />
      </Link>

      <h1 className="mx-auto mt-7 max-w-[20ch] text-[2.35rem] leading-[1.08] font-bold tracking-[-0.03em] text-[#171311] sm:text-[3rem] lg:text-[3.4rem]">
        La forma más rápida de crear el QR de tu negocio
      </h1>

      <p className="mx-auto mt-5 max-w-2xl text-[0.98rem] leading-relaxed text-[#6E6561]">
        Genera un código que lleve a tu WhatsApp, tu Instagram, tu menú o tu red WiFi.{" "}
        <span className="font-semibold text-[#171311]">
          Sin cuenta, sin costo y listo para imprimir.
        </span>
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="#estudio"
          className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#A61E22] px-5 text-[0.85rem] font-semibold text-white transition-colors duration-200 hover:bg-[#8C181C]"
        >
          Crear mi QR ahora
        </Link>
        <Link
          href="#usos"
          className="inline-flex h-11 items-center gap-2 rounded-lg border border-[#171311]/15 bg-white px-5 text-[0.85rem] font-semibold text-[#171311] transition-colors duration-200 hover:border-[#171311]/35"
        >
          Ver para qué sirve
        </Link>
      </div>
    </section>
  );
}

/* ── Marco del estudio ──────────────────────────────────────────── */

export function QrFrame({ children }: { children: React.ReactNode }) {
  return (
    <section id="estudio" className="px-[clamp(1.25rem,4vw,3rem)] pb-10 scroll-mt-24">
      <div className="mx-auto max-w-6xl rounded-[2.25rem] border-[3px] border-[#171311] bg-white p-3 sm:p-4">
        {children}
      </div>
    </section>
  );
}

/* ── Bento de características ───────────────────────────────────── */

const CUSTOMIZATION = [
  { icon: ImagePlus, label: "Logo" },
  { icon: Ruler, label: "Tamaño" },
  { icon: Type, label: "Texto inferior" },
  { icon: ScanLine, label: "Margen" },
];

export function QrHighlights() {
  return (
    <section className="px-[clamp(1.25rem,4vw,3rem)] pb-10">
      <div className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-[0.8fr_1.4fr_1fr]">
        <div className="rounded-[1.75rem] bg-[#171311] p-7 text-white">
          <p className="text-[1.05rem] leading-snug font-semibold">
            Un código, todos tus canales.
          </p>
          <p className="mt-2 text-[0.88rem] leading-relaxed text-white/60">
            El mismo generador cubre los destinos que de verdad usa un negocio.
          </p>
          <p className="mt-8 text-[0.85rem] text-[#E8A9A5]">Hasta</p>
          <p className="text-[4.5rem] leading-none font-bold tracking-[-0.04em] text-[#D9494C]">
            {QR_TYPES.length}
          </p>
          <p className="mt-1 text-[1.05rem] font-semibold text-[#D9494C]">destinos</p>
        </div>

        <div className="rounded-[1.75rem] border border-[#171311]/8 bg-white p-7">
          <p className="max-w-md text-[1.15rem] leading-snug text-[#6E6561]">
            <span className="font-bold text-[#171311]">Personalízalo a tu marca.</span>{" "}
            Agrega tu logo al centro, ajusta el tamaño y el margen, y escribe la línea que
            acompaña al código.
          </p>

          <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {CUSTOMIZATION.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="flex flex-col items-center gap-3 rounded-2xl bg-[#EFEAE6] px-3 py-5"
                >
                  <Icon className="size-7 text-[#171311]" strokeWidth={1.8} aria-hidden />
                  <span className="text-[0.78rem] font-medium text-[#171311]">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-[#171311]/8 bg-[#F6E3E0] p-7">
          <p className="text-[1.15rem] leading-snug text-[#6E6561]">
            <span className="font-bold text-[#171311]">Descárgalo y úsalo.</span> PNG para
            redes y WhatsApp, SVG para imprimir en grande sin que pierda nitidez.
          </p>

          <div className="mt-7 flex items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-[0.8rem] font-semibold text-[#171311]">
              <Download className="size-4" strokeWidth={1.8} aria-hidden />
              PNG
            </span>
            <span className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-[0.8rem] font-semibold text-[#171311]">
              <Download className="size-4" strokeWidth={1.8} aria-hidden />
              SVG
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Casos de uso ───────────────────────────────────────────────── */

const BUSINESSES = [
  { icon: UtensilsCrossed, label: "Restaurantes" },
  { icon: Coffee, label: "Cafeterías" },
  { icon: Store, label: "Tiendas" },
  { icon: Scissors, label: "Salones" },
  { icon: Croissant, label: "Reposterías" },
  { icon: ShoppingBag, label: "Delivery" },
];

export function QrUseCases() {
  return (
    <section id="usos" className="px-[clamp(1.25rem,4vw,3rem)] pb-10 scroll-mt-24">
      <div className="mx-auto max-w-6xl rounded-[2.25rem] border-[3px] border-[#171311] bg-white px-6 py-10 sm:px-10 sm:py-12">
        <h2 className="text-center text-[1.75rem] leading-[1.15] font-bold tracking-[-0.03em] text-[#171311] sm:text-[2.15rem]">
          Un QR para cada negocio
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-[0.92rem] leading-relaxed text-[#6E6561]">
          Da igual si atiendes en mesa, en mostrador o por delivery: el código conecta lo
          que ya tienes con el canal donde vendes.
        </p>

        <div className="mt-7 flex flex-wrap justify-center gap-2.5">
          {BUSINESSES.map((item) => {
            const Icon = item.icon;
            return (
              <span
                key={item.label}
                className="inline-flex items-center gap-2 rounded-full border border-[#171311]/10 bg-[#FBF5F1] py-2 pr-4 pl-2.5 text-[0.82rem] font-medium text-[#171311]"
              >
                <Icon className="size-4 text-[#A61E22]" strokeWidth={1.8} aria-hidden />
                {item.label}
              </span>
            );
          })}
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {QR_TYPES.map((item) => {
            const Icon = TYPE_ICONS[item.icon];
            return (
              <div
                key={item.id}
                className="rounded-2xl bg-[#FBF5F1] p-5 transition-colors duration-200 hover:bg-[#F6E3E0]"
              >
                <span className="flex size-10 items-center justify-center rounded-xl bg-white">
                  <Icon className="size-5 text-[#171311]" strokeWidth={1.8} aria-hidden />
                </span>
                <p className="mt-4 text-[0.95rem] font-semibold text-[#171311]">
                  {item.label}
                </p>
                <p className="mt-1.5 text-[0.8rem] leading-relaxed text-[#6E6561]">
                  {item.helper}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ── Pasos ──────────────────────────────────────────────────────── */

const STEPS = [
  {
    step: "Paso 1",
    title: "Elige el destino",
    body: "WhatsApp, Instagram, tu web, el mapa, el menú, un texto o tu red WiFi.",
    icon: ScanLine,
  },
  {
    step: "Paso 2",
    title: "Personalízalo",
    body: "Sube tu logo, ajusta tamaño y margen, y agrega la línea que lo acompaña.",
    icon: Sparkles,
  },
  {
    step: "Paso 3",
    title: "Descarga e imprime",
    body: "PNG para lo digital y SVG para el letrero, la mesa o la bolsa del pedido.",
    icon: Download,
  },
];

export function QrSteps() {
  return (
    <section className="px-[clamp(1.25rem,4vw,3rem)] pb-10">
      <div className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-3">
        {STEPS.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.step}
              className="rounded-[1.75rem] border border-[#171311]/8 bg-white p-7"
            >
              <p className="text-[0.7rem] tracking-[0.16em] text-[#A61E22] uppercase">
                {item.step}
              </p>
              <div className="mt-3 flex items-center justify-between gap-3">
                <h3 className="text-[1.4rem] leading-tight font-bold tracking-[-0.02em] text-[#171311]">
                  {item.title}
                </h3>
                <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#171311] text-white">
                  <Icon className="size-5" strokeWidth={1.8} aria-hidden />
                </span>
              </div>
              <p className="mt-3 text-[0.88rem] leading-relaxed text-[#6E6561]">
                {item.body}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ── Cierre ─────────────────────────────────────────────────────── */

export function QrCta() {
  return (
    <section className="px-[clamp(1.25rem,4vw,3rem)] pb-16">
      <div className="mx-auto max-w-6xl rounded-[2.25rem] bg-[#171311] px-6 py-10 text-white sm:px-12 sm:py-14">
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="max-w-md text-[1.75rem] leading-[1.15] font-bold tracking-[-0.03em] sm:text-[2.1rem]">
              ¿Quieres que el QR lleve a algo tuyo?
            </h2>
            <p className="mt-4 max-w-md text-[0.92rem] leading-relaxed text-white/60">
              Crea primero tu menú digital o tu enlace de WhatsApp con las otras
              herramientas gratuitas, y después apunta el código ahí.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <Link
              href="/tools/menu-digital"
              className="inline-flex h-11 items-center rounded-lg bg-[#A61E22] px-5 text-[0.85rem] font-semibold text-white transition-colors duration-200 hover:bg-[#8C181C]"
            >
              Crear menú digital
            </Link>
            <Link
              href="/tools/whatsapp-generator"
              className="inline-flex h-11 items-center rounded-lg border border-white/20 px-5 text-[0.85rem] font-semibold text-white transition-colors duration-200 hover:border-white/50"
            >
              Crear link de WhatsApp
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
