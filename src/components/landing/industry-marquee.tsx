import { lp } from "@/lib/landing-copy";

/** Franja continua con las verticales que atiende el diagnóstico */
export function IndustryMarquee() {
  const items = [...lp.industries, ...lp.industries];

  return (
    <section
      id="industrias"
      className="border-y border-[#f1eef7] px-[clamp(1.25rem,4vw,3.75rem)] py-7"
      aria-label="Industrias que diagnosticamos"
    >
      <div className="mx-auto w-full max-w-6xl">
        <div className="ds-logo-marquee-track">
          <div className="ds-logo-marquee items-center gap-[clamp(2rem,5vw,4.5rem)]">
            {items.map((name, i) => (
              <span
                key={`${name}-${i}`}
                className="lp-font shrink-0 whitespace-nowrap text-[clamp(0.875rem,1.4vw,1.0625rem)] font-semibold uppercase tracking-[0.16em] text-[#c2c2cc] transition-colors hover:text-[#131316]"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
