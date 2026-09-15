import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Instrument_Serif } from "next/font/google";

const helpSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
});

export function HelpContactCta() {
  return (
    <section className="dst-container pb-16 md:pb-24">
      <div className="overflow-hidden rounded-[2rem] border border-black/[0.06] bg-[#16161c] px-6 py-10 text-white shadow-[0_24px_60px_rgba(22,22,28,0.18)] sm:rounded-[2.5rem] sm:px-10 lg:grid lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-10 lg:px-14 lg:py-12">
        <div>
          <p className="text-[0.72rem] font-semibold tracking-[0.18em] text-white/45 uppercase">
            Soporte directo
          </p>
          <h2 className="mt-3 max-w-[14ch] text-[1.85rem] leading-[1.08] font-semibold tracking-[-0.03em] sm:text-[2.35rem]">
            ¿Tu duda no está{" "}
            <span className={`${helpSerif.className} font-normal italic underline decoration-white/25 decoration-2 underline-offset-[0.18em]`}>
              en la lista
            </span>
            ?
          </h2>
          <p className="mt-4 max-w-lg text-[0.95rem] leading-relaxed text-white/65">
            Cuéntanos qué herramienta estabas usando y qué esperabas que pasara. Es lo que más
            rápido nos permite ayudarte o corregirlo.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:mt-0 lg:flex-col xl:flex-row">
          <Link
            href="/contacto"
            className="inline-flex h-12 min-h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-[#16161c] transition-[transform,filter] duration-200 hover:-translate-y-0.5 hover:brightness-[0.98]"
          >
            Escríbenos
            <ArrowUpRight className="size-4" strokeWidth={2} aria-hidden />
          </Link>
          <Link
            href="/guias"
            className="inline-flex h-12 min-h-12 items-center justify-center rounded-full border border-white/20 px-6 text-sm font-semibold text-white transition-colors duration-200 hover:border-white/40"
          >
            Ver las guías
          </Link>
        </div>
      </div>
    </section>
  );
}
