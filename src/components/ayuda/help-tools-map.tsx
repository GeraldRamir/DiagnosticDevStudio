import Link from "next/link";
import { TOOL_ICONS } from "@/components/tools/tool-icons";
import { getToolTheme } from "@/components/tools/tool-theme";
import { getAvailableTools } from "@/lib/tools";

export function HelpToolsMap() {
  const tools = getAvailableTools();

  return (
    <section className="dst-container pb-10 md:pb-14">
      <div className="rounded-[2rem] border border-black/[0.06] bg-white px-6 py-10 shadow-[0_24px_60px_rgba(22,22,28,0.05)] sm:rounded-[2.5rem] sm:px-10 lg:px-14 lg:py-12">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[0.72rem] font-semibold tracking-[0.16em] text-[#9aa0a6] uppercase">
            Herramientas
          </p>
          <h2 className="mt-3 text-[1.75rem] leading-[1.1] font-semibold tracking-[-0.03em] text-[#16161c] sm:text-[2rem]">
            ¿Dudas sobre una app en particular?
          </h2>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-[#6b716f]">
            Entra directo a la herramienta o revisa las guías paso a paso.
          </p>
        </div>

        <div className="relative mx-auto mt-10 max-w-3xl">
          <div
            className="pointer-events-none absolute inset-0 hidden lg:block"
            aria-hidden
          >
            <svg viewBox="0 0 640 320" className="h-full w-full" preserveAspectRatio="none">
              <line x1="320" y1="160" x2="120" y2="60" stroke="rgba(22,22,28,0.08)" strokeWidth="1.5" />
              <line x1="320" y1="160" x2="520" y2="60" stroke="rgba(22,22,28,0.08)" strokeWidth="1.5" />
              <line x1="320" y1="160" x2="80" y2="250" stroke="rgba(22,22,28,0.08)" strokeWidth="1.5" />
              <line x1="320" y1="160" x2="320" y2="280" stroke="rgba(22,22,28,0.08)" strokeWidth="1.5" />
              <line x1="320" y1="160" x2="560" y2="250" stroke="rgba(22,22,28,0.08)" strokeWidth="1.5" />
            </svg>
          </div>

          <div className="relative grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-center justify-center sm:col-span-2 lg:col-span-3 lg:pb-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-black/[0.06] bg-[#fafaf8] px-4 py-2">
                <span className="inline-flex size-8 items-center justify-center rounded-full bg-[#16161c] text-[0.65rem] font-bold tracking-[0.08em] text-white uppercase">
                  DS
                </span>
                <span className="text-[0.85rem] font-semibold tracking-[-0.02em] text-[#16161c]">
                  Dev Studio Tools
                </span>
              </div>
            </div>

            {tools.map((tool) => {
              const Icon = TOOL_ICONS[tool.icon];
              const theme = getToolTheme(tool.id);

              return (
                <Link
                  key={tool.id}
                  href={tool.href}
                  className="group flex items-center gap-3 rounded-[1.25rem] border border-black/[0.05] bg-[#fafaf8] px-4 py-3.5 transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-white"
                >
                  <span
                    className="inline-flex size-10 shrink-0 items-center justify-center rounded-[0.85rem]"
                    style={{ backgroundColor: theme.surface }}
                  >
                    <Icon className="size-4" strokeWidth={1.8} style={{ color: theme.icon }} aria-hidden />
                  </span>
                  <span>
                    <span className="block text-[0.88rem] font-semibold tracking-[-0.02em] text-[#16161c]">
                      {tool.shortName}
                    </span>
                    <span className="mt-0.5 block text-[0.75rem] text-[#9aa0a6]">Abrir herramienta</span>
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="mt-8 flex justify-center">
            <Link
              href="/guias"
              className="inline-flex h-11 items-center rounded-full border border-[#16161c]/12 bg-white px-5 text-sm font-semibold text-[#16161c] transition-colors duration-200 hover:border-[#16161c]/30"
            >
              Ver guías paso a paso
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
