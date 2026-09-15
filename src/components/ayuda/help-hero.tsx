import { Instrument_Serif } from "next/font/google";
import { HelpNotchedPanel } from "@/components/ayuda/help-notched-panel";
import { TOOL_ICONS } from "@/components/tools/tool-icons";
import { getAvailableTools } from "@/lib/tools";

const helpSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
});

export function HelpHero() {
  const tools = getAvailableTools().slice(0, 3);

  return (
    <section className="relative overflow-x-clip">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.55]"
        aria-hidden
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(22,22,28,0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(22,22,28,0.05) 1px, transparent 1px)
          `,
          backgroundSize: "72px 72px",
          maskImage: "linear-gradient(to bottom, black 0%, black 70%, transparent 100%)",
        }}
      />

      <div className="dst-container relative grid gap-10 pt-12 pb-8 md:grid-cols-[1.15fr_0.85fr] md:items-end md:gap-12 md:pt-16 lg:pt-20">
        <div>
          <p className="text-[0.72rem] font-medium tracking-[0.2em] text-[#9aa0a6] uppercase">
            Centro de ayuda
          </p>
          <h1 className="mt-4 max-w-[14ch] text-[2.55rem] leading-[1.02] font-semibold tracking-[-0.04em] text-[#16161c] sm:text-[3.2rem] lg:text-[3.65rem]">
            Respuestas{" "}
            <span className={`${helpSerif.className} font-normal italic`}>
              <span className="underline decoration-[#16161c]/25 decoration-2 underline-offset-[0.2em]">
                claras
              </span>
            </span>{" "}
            para tu negocio
          </h1>
        </div>

        <p className="max-w-md text-[1rem] leading-relaxed text-[#6b716f] md:pb-2 md:text-[1.05rem]">
          Todo lo que necesitas saber para usar las herramientas de Dev Studio: cómo empezar, qué
          pasa con tus datos y qué esperar de cada resultado.
        </p>
      </div>

      <div className="dst-container pb-10 md:pb-14">
        <HelpNotchedPanel
          tab={
            <div className="flex items-center gap-2">
              <span className="flex -space-x-2">
                {tools.map((tool) => {
                  const Icon = TOOL_ICONS[tool.icon];
                  return (
                    <span
                      key={tool.id}
                      className="inline-flex size-7 items-center justify-center rounded-full border-2 border-white bg-[#f4f4f2] text-[#16161c]"
                    >
                      <Icon className="size-3.5" strokeWidth={1.8} aria-hidden />
                    </span>
                  );
                })}
              </span>
              <span className="text-[0.72rem] font-semibold tracking-[0.08em] text-[#9aa0a6] uppercase">
                Dev Studio Tools
              </span>
            </div>
          }
        >
          <div className="grid gap-8 px-6 py-8 sm:px-10 sm:py-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12 lg:px-14 lg:py-12">
            <div>
              <p className="text-[0.72rem] font-semibold tracking-[0.16em] text-[#9aa0a6] uppercase">
                Guía rápida
              </p>
              <h2 className="mt-3 max-w-[16ch] text-[1.85rem] leading-[1.08] font-semibold tracking-[-0.03em] text-[#16161c] sm:text-[2.25rem]">
                Tres pasos para resolver la mayoría de dudas
              </h2>
              <p className="mt-4 max-w-lg text-[0.95rem] leading-relaxed text-[#6b716f]">
                Empieza por el diagnóstico, revisa la sección que te corresponda y escríbenos si
                algo no cuadra con lo que ves en pantalla.
              </p>
            </div>

            <ol className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              {[
                {
                  step: "01",
                  title: "Explora",
                  body: "Revisa las preguntas frecuentes por tema.",
                },
                {
                  step: "02",
                  title: "Prueba",
                  body: "Usa la herramienta y valida el resultado.",
                },
                {
                  step: "03",
                  title: "Escribe",
                  body: "Si algo falla, cuéntanos qué esperabas.",
                },
              ].map((item) => (
                <li
                  key={item.step}
                  className="rounded-[1.35rem] border border-black/[0.05] bg-[#fafaf8] px-4 py-4"
                >
                  <p className="text-[0.68rem] font-semibold tracking-[0.14em] text-[#9aa0a6]">
                    {item.step}
                  </p>
                  <p className="mt-1 text-[0.95rem] font-semibold tracking-[-0.02em] text-[#16161c]">
                    {item.title}
                  </p>
                  <p className="mt-1 text-[0.82rem] leading-relaxed text-[#6b716f]">{item.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </HelpNotchedPanel>
      </div>
    </section>
  );
}
