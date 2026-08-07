"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BlurFade } from "@/components/ui/blur-fade";
import { SectionHeader } from "@/components/landing/section-header";
import { copy } from "@/lib/copy";

export function FaqSection() {
  return (
    <section id="faq" className="bg-white px-5 py-16 md:px-8 md:py-20 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-3xl">
        <BlurFade>
          <SectionHeader
            eyebrow={copy.landing.faq.eyebrow}
            title={copy.landing.faq.title}
          />
        </BlurFade>

        <BlurFade delay={0.1} className="mt-12">
          <Accordion className="rounded-2xl border border-black/[0.06] bg-[color:var(--landing-shell)] px-5">
            {copy.landing.faq.items.map((item, i) => (
              <AccordionItem key={item.q} value={`faq-${i}`}>
                <AccordionTrigger className="py-4 text-base font-semibold text-[color:var(--landing-text)] hover:no-underline">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="pb-4 text-sm leading-relaxed text-[color:var(--landing-muted)]">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </BlurFade>
      </div>
    </section>
  );
}
