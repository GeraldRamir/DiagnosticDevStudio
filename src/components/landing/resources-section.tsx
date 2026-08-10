import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Badge, LpSection, Reveal, SectionTitle } from "@/components/landing/lp-ui";
import { lp } from "@/lib/landing-copy";

const COVERS = [
  "linear-gradient(135deg,#ffd95e 0%,#ffb37a 100%)",
  "linear-gradient(135deg,#ded0fb 0%,#b9a6f5 100%)",
  "linear-gradient(135deg,#ffd3c6 0%,#ee5b45 100%)",
] as const;

export function ResourcesSection() {
  const r = lp.resources;

  return (
    <LpSection id="recursos">
      <SectionTitle title={r.title} subtitle={r.subtitle} />

      <div className="mt-10 grid gap-3 md:grid-cols-3">
        {r.items.map((item, i) => (
          <Reveal key={item.title} delay={i * 0.08}>
            <article className="lp-card-hover flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-[#f0edf6] bg-white">
              <div
                className="lp-dotted relative h-32 w-full"
                style={{ backgroundImage: COVERS[i] }}
                aria-hidden
              >
                <span className="absolute left-4 top-4">
                  <Badge tone="light">{item.tag}</Badge>
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="lp-font text-[1.0625rem] font-semibold leading-snug tracking-[-0.01em] text-[#131316]">
                  {item.title}
                </h3>
                <p className="mt-2.5 flex-1 text-[0.8125rem] leading-relaxed text-[#7b7b87]">
                  {item.desc}
                </p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.2}>
        <div className="mt-6 flex justify-center">
          <Link
            href={r.link.href}
            className="lp-font group inline-flex items-center gap-2 text-sm font-semibold text-[#131316] transition-colors hover:text-[#ee5b45]"
          >
            {r.link.label}
            <span className="flex size-7 items-center justify-center rounded-full bg-[#f3ecff] text-[#5b3fa8] transition-transform duration-300 group-hover:rotate-45">
              <ArrowUpRight className="size-3.5" />
            </span>
          </Link>
        </div>
      </Reveal>
    </LpSection>
  );
}
