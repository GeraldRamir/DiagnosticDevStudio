import Image from "next/image";
import Link from "next/link";
import { BrandLogo } from "@/components/brand/brand-logo";
import { BRAND_LINKS, CLIENT_LOGOS } from "@/lib/brand";

export function AboutClientsStrip() {
  return (
    <section className="border-t border-[#16161c]/10 bg-[#f5f2ea] pb-14 md:pb-20">
      <div className="dst-container">
        <div className="flex flex-col items-center gap-6 border-b border-[#16161c]/10 pb-10 sm:flex-row sm:justify-between">
          <Link href="/" aria-label="Dev Studio">
            <BrandLogo className="h-12 w-auto sm:h-14" />
          </Link>
          <a
            href={BRAND_LINKS.cotizar}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center rounded-xl bg-[#16161c] px-6 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5"
          >
            Trabajar con nosotros
          </a>
        </div>

        <p className="mt-8 text-center text-[0.72rem] font-semibold tracking-[0.18em] text-[#9aa0a6] uppercase">
          Marcas con software hecho por Dev Studio
        </p>
        <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-6 sm:gap-x-12 md:gap-x-16">
          {CLIENT_LOGOS.map((logo) => (
            <li key={logo.name}>
              <Image
                src={logo.src}
                alt={logo.name}
                width={140}
                height={48}
                className="h-8 w-auto max-w-[7.5rem] object-contain opacity-75 grayscale transition-[opacity,filter] duration-200 hover:opacity-100 hover:grayscale-0 sm:h-9 sm:max-w-[8.5rem]"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
