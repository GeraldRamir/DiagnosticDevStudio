import Link from "next/link";
import { Instrument_Serif } from "next/font/google";
import { ToolsHubCatalog } from "@/components/tools/tools-hub-catalog";
import { ToolsHubIllustration } from "@/components/tools/tools-hub-illustration";
import { ToolsSwitcher } from "@/components/tools/tools-switcher";

const toolsSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
});

export function ToolsHubHero() {
  return (
    <>
      <section className="overflow-x-clip bg-white">
        <div className="dst-container pt-12 pb-2 text-center md:pt-16 lg:pt-[4.75rem]">
          <p className="text-[0.72rem] font-semibold tracking-[0.22em] text-[#9aa0a6] uppercase">
            Dev Studio Tools · 5 opciones gratis
          </p>

          <h1
            className={`${toolsSerif.className} mx-auto mt-5 max-w-[14ch] text-[2.65rem] leading-[1.02] tracking-[-0.02em] text-[#16161c] sm:max-w-none sm:text-[3.35rem] lg:text-[3.85rem]`}
          >
            Todas las herramientas
            <span className="block">en un solo lugar</span>
          </h1>

          <p className="mx-auto mt-5 max-w-[44ch] text-[0.98rem] leading-relaxed text-[#6b716f] sm:text-[1.05rem]">
            Desde diagnóstico digital hasta menú QR: aquí tienes el kit completo
            para hacer crecer tu negocio. Elige una opción y empieza al instante.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#kit"
              className="inline-flex h-11 min-h-11 items-center rounded-full bg-[#16161c] px-5 text-sm font-semibold text-white transition-[transform,filter] duration-200 hover:-translate-y-0.5 hover:brightness-110"
            >
              Ver las 5 herramientas
            </a>
            <Link
              href="/tools/diagnostico-digital"
              className="inline-flex h-11 min-h-11 items-center rounded-full border border-[#16161c]/14 bg-white px-5 text-sm font-semibold text-[#16161c] transition-colors duration-200 hover:border-[#16161c]/35"
            >
              Empezar gratis
            </Link>
          </div>

          <ToolsHubIllustration />
        </div>

        <div className="dst-container border-t border-black/[0.06] pt-6 pb-4 md:pt-8">
          <p className="text-center text-[0.72rem] font-medium tracking-[0.16em] text-[#b0b5b8] uppercase">
            Acceso directo a cada herramienta
          </p>
          <ToolsSwitcher variant="hero" />
        </div>
      </section>

      <ToolsHubCatalog />
    </>
  );
}
