import Link from "next/link";
import { Code2, Globe, Smartphone } from "lucide-react";
import { BrandLogo } from "@/components/brand/brand-logo";
import { BRAND_LINKS } from "@/lib/brand";

export function AboutHero() {
  return (
    <section className="relative overflow-x-clip bg-[#f3f1f8] py-14 md:py-20 lg:py-24">
      <div className="dst-container grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-10">
        <div>
          <h1 className="max-w-[16ch] text-[2.35rem] leading-[1.06] font-bold tracking-[-0.03em] text-[#16161c] sm:text-[2.85rem] lg:text-[3.25rem]">
            Sobre Dev Studio: software que impulsa tu negocio
          </h1>
          <p className="mt-6 max-w-lg text-[0.98rem] leading-relaxed text-[#5c6358] sm:text-[1.02rem]">
            Somos un estudio de desarrollo en República Dominicana. Diseñamos webs, apps y sistemas
            a medida — y publicamos Dev Studio Tools para que cualquier negocio empiece gratis.
          </p>
          <a
            href={BRAND_LINKS.cotizar}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex h-12 min-h-12 items-center rounded-xl bg-[#16161c] px-7 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5"
          >
            Conocer el estudio
          </a>
        </div>

        <div className="relative mx-auto h-[22rem] w-full max-w-[28rem] sm:h-[24rem] lg:mx-0 lg:max-w-none">
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full text-[#16161c]/20"
            viewBox="0 0 420 360"
            fill="none"
            aria-hidden
          >
            <path d="M60 280 L180 120" stroke="currentColor" strokeWidth="1.2" />
            <path d="M180 120 L320 60" stroke="currentColor" strokeWidth="1.2" />
            <path d="M180 120 L340 240" stroke="currentColor" strokeWidth="1.2" />
            <path d="M340 240 L280 320" stroke="currentColor" strokeWidth="1.2" />
          </svg>

          <div className="absolute top-[8%] right-[6%] flex size-[5.5rem] items-center justify-center rounded-2xl border-2 border-[#16161c] bg-white shadow-[0_12px_32px_rgba(22,22,28,0.08)] sm:size-[6.5rem]">
            <Globe className="size-8 text-[#90BF53]" strokeWidth={1.6} aria-hidden />
          </div>

          <div className="absolute top-[38%] left-[4%] flex size-[4.5rem] items-center justify-center rounded-2xl border-2 border-[#16161c] bg-[#ecf6e3] sm:size-[5rem]">
            <Smartphone className="size-7 text-[#16161c]" strokeWidth={1.6} aria-hidden />
          </div>

          <div className="absolute bottom-[6%] left-[18%] flex size-[4.25rem] items-center justify-center rounded-2xl border-2 border-[#16161c] bg-white sm:size-[4.75rem]">
            <Code2 className="size-6 text-[#16161c]" strokeWidth={1.6} aria-hidden />
          </div>

          <div className="absolute top-[18%] left-[24%] flex h-[16rem] w-[13rem] items-center justify-center sm:h-[18rem] sm:w-[15rem] lg:left-[30%]">
            <BrandLogo priority className="max-h-[11rem] w-full max-w-[10rem] drop-shadow-[0_20px_40px_rgba(22,22,28,0.12)] sm:max-h-[13rem] sm:max-w-[12rem]" />
          </div>
        </div>
      </div>

      <div className="dst-container mt-10 lg:mt-0">
        <Link
          href="/tools"
          className="text-sm font-medium text-[#5c6358] underline-offset-4 hover:text-[#16161c] hover:underline"
        >
          Explorar herramientas gratuitas →
        </Link>
      </div>
    </section>
  );
}
