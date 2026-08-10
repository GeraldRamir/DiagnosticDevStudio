import { ArrowRight } from "lucide-react";
import { LpButton, LpSection, Reveal } from "@/components/landing/lp-ui";
import { lp } from "@/lib/landing-copy";

export function CtaSection() {
  const c = lp.finalCta;

  return (
    <LpSection>
      <Reveal>
        <div className="relative overflow-hidden rounded-[clamp(1.5rem,2.6vw,2.25rem)] bg-[#111111] px-[clamp(1.5rem,4vw,4rem)] py-[clamp(2.5rem,5vw,4rem)] text-center">
          <div
            aria-hidden
            className="pointer-events-none absolute -left-16 -top-24 size-72 rounded-full opacity-40 blur-3xl"
            style={{ background: "radial-gradient(circle,#7c4dff 0%,transparent 70%)" }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-28 -right-10 size-72 rounded-full opacity-40 blur-3xl"
            style={{ background: "radial-gradient(circle,#ee5b45 0%,transparent 70%)" }}
          />

          <div className="relative">
            <h2 className="lp-font mx-auto max-w-2xl text-[clamp(1.75rem,4.4vw,3rem)] font-semibold leading-[1.06] tracking-[-0.03em] text-white">
              {c.title}
            </h2>
            <p className="mx-auto mt-4 max-w-md text-[0.9375rem] text-white/60">{c.subtitle}</p>

            <div className="mt-8 flex justify-center">
              <LpButton
                href={c.cta.href}
                variant="yellow"
                size="lg"
                icon={<ArrowRight className="size-4" />}
              >
                {c.cta.label}
              </LpButton>
            </div>

            <p className="mt-5 text-[0.75rem] text-white/40">{c.note}</p>
          </div>
        </div>
      </Reveal>
    </LpSection>
  );
}
