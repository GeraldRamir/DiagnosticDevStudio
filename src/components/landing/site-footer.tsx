import Image from "next/image";
import Link from "next/link";
import { copy } from "@/lib/copy";
import { LOGO_SRC } from "@/lib/brand";

const SocialIcons = {
  facebook: (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  ),
  x: (
    <svg viewBox="0 0 24 24" className="size-3.5" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
} as const;

const SOCIAL_LINKS = [
  { href: "https://facebook.com", label: "Facebook", icon: SocialIcons.facebook },
  { href: "https://instagram.com", label: "Instagram", icon: SocialIcons.instagram },
  { href: "https://x.com", label: "X", icon: SocialIcons.x },
] as const;

export function SiteFooter() {
  const f = copy.landing.footer;
  const cols = f.columns;

  return (
    <footer className="doodi-page relative overflow-hidden bg-[#efefef] px-[clamp(1.25rem,4vw,4rem)] pt-14 pb-6">
      <p
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[38%] select-none text-center font-extrabold uppercase tracking-[0.18em] text-[#0a0a0a]/[0.045]"
        style={{ fontSize: "clamp(3.5rem, 11vw, 9rem)" }}
        aria-hidden
      >
        {f.watermark}
      </p>

      <div className="relative mx-auto w-full max-w-[100rem]">
        <div className="mb-10 flex justify-center lg:hidden">
          <Link href="/" className="flex h-16 items-center">
            <Image
              src={LOGO_SRC}
              alt="DevStudio"
              width={819}
              height={1024}
              className="h-full w-auto object-contain"
            />
          </Link>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-start lg:gap-16">
          <div className="grid gap-10 sm:grid-cols-3 sm:gap-8">
            {([cols.pages, cols.utility, cols.social] as const).map((col) => (
              <div key={col.title}>
                <p className="text-[0.9375rem] font-bold text-[#0a0a0a]">{col.title}</p>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      {"external" in link && link.external ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[0.875rem] text-[#6b7280] transition-colors hover:text-[#0a0a0a]"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          className="text-[0.875rem] text-[#6b7280] transition-colors hover:text-[#0a0a0a]"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <Link
            href="/"
            className="relative mx-auto hidden h-28 shrink-0 items-center lg:mx-0 lg:flex xl:h-32"
          >
            <Image
              src={LOGO_SRC}
              alt="DevStudio"
              width={819}
              height={1024}
              className="h-full w-auto object-contain"
            />
          </Link>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-black/[0.06] pt-5 sm:flex-row">
          <div className="flex items-center gap-2.5">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="flex size-9 items-center justify-center rounded-full bg-[#e5e5e5] text-[#4b5563] transition-colors hover:bg-[#d4d4d4] hover:text-[#0a0a0a]"
              >
                {social.icon}
              </a>
            ))}
          </div>
          <p className="text-[0.8125rem] text-[#9ca3af]">{f.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
