import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { HomeHeroLogos } from "@/components/landing/home-hero-logos";
import { HomeHeroVisual } from "@/components/landing/home-hero-visual";

export function HomeHero() {
  return (
    <section className="relative z-20 overflow-x-clip">
      <div className="dst-container relative isolate py-8 pb-4 md:min-h-[460px] md:py-8 md:pb-6 lg:min-h-[520px] lg:py-10 lg:pb-8">
        <h1 className="relative z-20 font-inter text-[3rem] leading-[1.1] font-normal tracking-[0.03em] text-[#000000] sm:text-[3.5rem] md:text-[3.75rem] md:leading-[1.08] md:tracking-[0.04em] lg:text-[4.25rem] lg:leading-[1.06] lg:tracking-[0.05em] xl:text-[4.5rem]">
          <span className="block md:whitespace-nowrap">Herramientas para</span>
          <span className="block md:whitespace-nowrap">un negocio moderno</span>
        </h1>

        <div className="relative z-20 mt-10 w-full md:max-w-[52%] lg:mt-11 lg:max-w-[48%]">
          <p className="font-inter text-[1.125rem] leading-[1.5] font-normal text-[#000000] lg:text-[1.25rem]">
            La plataforma con la que Dev Studio digitaliza negocios: presencia, contacto y
            operación. Sin cuentas extra ni procesos lentos o desconectados.
          </p>
          <div className="mt-8">
            <Link href="#plataforma" className="dst-lime-cta font-inter">
              Conocer la plataforma
              <ArrowUpRight className="size-3.5 stroke-[2.4]" />
            </Link>
          </div>
          <HomeHeroLogos />
        </div>

        <div className="pointer-events-none relative z-30 mt-10 md:absolute md:top-8 md:right-[-2rem] md:mt-0 md:w-[52%] lg:top-10 lg:right-[-2.5rem] lg:w-[56%] xl:w-[54%]">
          <HomeHeroVisual />
        </div>
      </div>
    </section>
  );
}
