import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { copy } from "@/lib/copy";

function ShellsIcon() {
  return (
    <svg viewBox="0 0 32 32" className="size-9 shrink-0 md:size-10" aria-hidden>
      <circle cx="16" cy="16" r="13" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="16" cy="16" r="8" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="16" cy="16" r="3" fill="currentColor" />
    </svg>
  );
}

function SmartFinderIcon() {
  return (
    <svg viewBox="0 0 32 32" className="size-9 shrink-0 md:size-10" aria-hidden>
      <path
        d="M8 24 L16 6 L24 24 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path d="M11 18 h10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function ZoomerrIcon() {
  return (
    <svg viewBox="0 0 32 32" className="size-9 shrink-0 md:size-10" aria-hidden>
      <circle cx="16" cy="16" r="13" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <path
        d="M18 8 L12 16 L16 16 L14 24 L22 14 L18 14 Z"
        fill="currentColor"
      />
    </svg>
  );
}

function KontrastrIcon() {
  return (
    <svg viewBox="0 0 32 32" className="size-9 shrink-0 md:size-10" aria-hidden>
      <path
        d="M8 24 A 12 12 0 0 1 24 24 V8 A 12 12 0 0 0 8 8 Z"
        fill="currentColor"
      />
    </svg>
  );
}

function WavesMarathonIcon() {
  return (
    <svg viewBox="0 0 32 32" className="size-9 shrink-0 md:size-10" aria-hidden>
      <rect x="6" y="10" width="3" height="14" rx="1" fill="currentColor" />
      <rect x="12" y="6" width="3" height="18" rx="1" fill="currentColor" />
      <rect x="18" y="12" width="3" height="12" rx="1" fill="currentColor" />
      <rect x="24" y="8" width="3" height="16" rx="1" fill="currentColor" />
    </svg>
  );
}

const LOGO_ICONS = {
  shells: ShellsIcon,
  smartfinder: SmartFinderIcon,
  zoomerr: ZoomerrIcon,
  kontrastr: KontrastrIcon,
  wavesmarathon: WavesMarathonIcon,
} as const;

type LogoItem = (typeof copy.landing.banner.logos)[number];

function BrandLogo({ logo }: { logo: LogoItem }) {
  const Icon = LOGO_ICONS[logo.id];

  return (
    <div className="flex shrink-0 items-center gap-3 text-[color:var(--landing-text)]">
      <Icon />
      <span
        className={`whitespace-nowrap text-lg font-extrabold tracking-wide md:text-xl ${logo.lowercase ? "normal-case" : "uppercase"}`}
      >
        {logo.name}
      </span>
    </div>
  );
}

function LogoMarquee() {
  const logos = copy.landing.banner.logos;
  const loop = [...logos, ...logos];

  return (
    <div className="ds-logo-marquee-track mt-8 w-full" aria-label="Marcas asociadas">
      <div className="ds-logo-marquee gap-14 px-4 md:gap-20 md:px-8">
        {loop.map((logo, index) => (
          <BrandLogo
            key={`${logo.id}-${index}`}
            logo={logo}
          />
        ))}
      </div>
    </div>
  );
}

export function LandingBanner() {
  return (
    <section className="w-full overflow-hidden border-t border-black/[0.06] bg-white px-6 py-6 md:px-12 md:py-8 lg:px-16 xl:px-20">
      {/* Promo — una línea centrada como la referencia */}
      <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-center text-sm">
        <span className="text-[color:var(--landing-muted)]">
          {copy.landing.banner.promo}
        </span>
        <span className="hidden text-black/15 sm:inline">—</span>
        <span className="font-medium text-[color:var(--landing-text)]">
          {copy.landing.banner.countdown}
        </span>
        <Link
          href="/diagnostico"
          className="inline-flex items-center gap-1 font-semibold text-[color:var(--landing-text)] underline-offset-4 hover:underline"
        >
          {copy.landing.banner.link}
          <ArrowUpRight className="size-3.5" strokeWidth={2.5} />
        </Link>
      </div>

      <LogoMarquee />
    </section>
  );
}
