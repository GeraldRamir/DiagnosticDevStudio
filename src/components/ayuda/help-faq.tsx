import { ChevronDown } from "lucide-react";
import { HelpNotchedPanel } from "@/components/ayuda/help-notched-panel";
import { FAQ_GROUPS } from "@/lib/content/faq";

const GROUP_IDS: Record<string, string> = {
  Empezar: "empezar",
  "Tus datos": "datos",
  "Uso y resultados": "resultados",
};

export function HelpFaq() {
  return (
    <section className="dst-container pb-10 md:pb-14">
      <HelpNotchedPanel
        tab={
          <span className="text-[0.72rem] font-semibold tracking-[0.12em] text-[#9aa0a6] uppercase">
            FAQ
          </span>
        }
      >
        <div className="px-6 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-12">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-[1.75rem] leading-[1.1] font-semibold tracking-[-0.03em] text-[#16161c] sm:text-[2rem]">
              Preguntas frecuentes
            </h2>
            <p className="mt-3 text-[0.95rem] leading-relaxed text-[#6b716f]">
              Lo que más nos preguntan sobre las herramientas, organizado por tema.
            </p>
          </div>

          <div className="mx-auto mt-10 flex max-w-3xl flex-col gap-10">
            {FAQ_GROUPS.map((group) => (
              <div key={group.title} id={GROUP_IDS[group.title] ?? group.title}>
                <h3 className="text-[1.15rem] font-semibold tracking-[-0.02em] text-[#16161c]">
                  {group.title}
                </h3>

                <div className="mt-4 flex flex-col gap-2.5">
                  {group.items.map((item) => (
                    <details
                      key={item.question}
                      className="group/item rounded-[1.25rem] border border-black/[0.05] bg-[#fafaf8] px-5 py-4 open:bg-white open:shadow-[0_12px_32px_rgba(22,22,28,0.05)]"
                    >
                      <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-[0.95rem] font-medium tracking-[-0.01em] text-[#16161c] [&::-webkit-details-marker]:hidden">
                        {item.question}
                        <ChevronDown
                          className="mt-0.5 size-4 shrink-0 text-[#9aa0a6] transition-transform duration-200 group-open/item:rotate-180"
                          strokeWidth={1.8}
                          aria-hidden
                        />
                      </summary>
                      <p className="mt-3 max-w-2xl text-[0.88rem] leading-relaxed text-[#6b716f]">
                        {item.answer}
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </HelpNotchedPanel>
    </section>
  );
}
