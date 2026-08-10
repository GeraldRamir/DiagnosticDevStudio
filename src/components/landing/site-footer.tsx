import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, ExternalLink } from "lucide-react";
import { BRAND_LINKS, LOGO_SRC } from "@/lib/brand";
import { lp } from "@/lib/landing-copy";

const SocialIcons = {
  website: (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.8 3.8 5.8 3.8 9s-1.3 6.2-3.8 9c-2.5-2.8-3.8-5.8-3.8-9S9.5 5.8 12 3z" />
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  ),
} as const;

const SOCIAL_LINKS = [
  { href: BRAND_LINKS.website, label: "Sitio web", icon: SocialIcons.website },
  { href: BRAND_LINKS.instagram, label: "Instagram", icon: SocialIcons.instagram },
  { href: BRAND_LINKS.linkedin, label: "LinkedIn", icon: SocialIcons.linkedin },
  { href: BRAND_LINKS.facebook, label: "Facebook", icon: SocialIcons.facebook },
] as const;

export function SiteFooter() {
  const f = lp.footer;
  const cols = [f.columns.product, f.columns.company] as const;

  return (
    <footer className="px-[clamp(1.25rem,4vw,3.75rem)] pb-8 pt-[clamp(2.5rem,5vw,4rem)]">
      <div className="mx-auto w-full max-w-6xl">
        {/* Banner superior */}
        <div className="mb-8 overflow-hidden rounded-[1.75rem] bg-[#111111] px-[clamp(1.25rem,3vw,2.5rem)] py-6 sm:py-7">
          <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
            <div className="min-w-0">
              <p className="lp-font text-[clamp(1.125rem,2.4vw,1.5rem)] font-semibold tracking-[-0.02em] text-white">
                Conoce más de DevStudio
              </p>
              <p className="mt-1.5 text-[0.8125rem] text-white/55">
                Sitio oficial, casos y presencia en redes.
              </p>
            </div>
            <a
              href={BRAND_LINKS.website}
              target="_blank"
              rel="noopener noreferrer"
              className="lp-font group inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-[#ffd95e] px-5 text-sm font-semibold text-[#3c2f00] transition-transform duration-200 hover:-translate-y-0.5"
            >
              Visitar sitio oficial
              <ExternalLink className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.35fr_1.1fr_1fr_1.15fr]">
          {/* Marca */}
          <div>
            <Link href="/" className="flex h-14 w-fit items-center" aria-label="DevStudio">
              <Image
                src={LOGO_SRC}
                alt="DevStudio"
                width={819}
                height={1024}
                className="h-full w-auto object-contain"
                sizes="160px"
              />
            </Link>
            <p className="mt-4 max-w-xs text-[0.8125rem] leading-relaxed text-[#8b8b96]">
              {f.tagline}
            </p>
            <a
              href={BRAND_LINKS.website}
              target="_blank"
              rel="noopener noreferrer"
              className="lp-font group mt-4 inline-flex items-center gap-1.5 text-[0.8125rem] font-semibold text-[#131316] transition-colors hover:text-[#ee5b45]"
            >
              {f.websiteLabel}
              <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:rotate-45" />
            </a>
          </div>

          {/* Columnas */}
          {cols.map((col) => (
            <div key={col.title}>
              <p className="lp-font text-[0.8125rem] font-semibold uppercase tracking-[0.12em] text-[#131316]">
                {col.title}
              </p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {"external" in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[0.8125rem] text-[#7b7b87] transition-all duration-200 hover:translate-x-1 hover:text-[#131316]"
                      >
                        {link.label}
                        <ExternalLink className="size-3 opacity-40" />
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="inline-block text-[0.8125rem] text-[#7b7b87] transition-all duration-200 hover:translate-x-1 hover:text-[#131316]"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* CTA */}
          <div className="rounded-[1.5rem] bg-[#f7f4fc] p-5">
            <p className="lp-font text-[0.8125rem] font-semibold uppercase tracking-[0.12em] text-[#131316]">
              Empezar
            </p>
            <p className="mt-3 text-[0.8125rem] leading-relaxed text-[#6b6478]">
              Gratis, en dos minutos y con reporte permanente.
            </p>
            <Link
              href="/diagnostico"
              className="lp-font group mt-4 inline-flex h-10 items-center gap-2 rounded-full bg-[#111111] px-4 text-[0.8125rem] font-semibold text-white transition-colors hover:bg-[#2b2b2b]"
            >
              Diagnóstico gratis
              <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <div className="mt-5 flex flex-wrap gap-2">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  title={social.label}
                  className="flex size-9 items-center justify-center rounded-full border border-[#e6e0f0] bg-white text-[#5f5f6a] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#111111] hover:text-[#131316]"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-[#f1eef7] pt-6 sm:flex-row">
          <p className="text-[0.75rem] text-[#b6b6c0]">{f.copyright}</p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <Link
              href="/privacidad"
              className="text-[0.75rem] text-[#8b8b96] transition-colors hover:text-[#131316]"
            >
              Privacidad
            </Link>
            <a
              href={BRAND_LINKS.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[0.75rem] text-[#8b8b96] transition-colors hover:text-[#131316]"
            >
              Sitio oficial
            </a>
            <a
              href={BRAND_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[0.75rem] text-[#8b8b96] transition-colors hover:text-[#131316]"
            >
              Instagram
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
