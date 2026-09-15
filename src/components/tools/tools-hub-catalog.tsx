import { ToolCard } from "@/components/tools/tool-card";
import { getAvailableTools } from "@/lib/tools";

export function ToolsHubCatalog() {
  const tools = getAvailableTools();

  return (
    <section
      id="catalogo"
      className="scroll-mt-24 border-t border-black/[0.06] bg-[#fafafa]/80 py-14 md:py-16"
      aria-labelledby="tools-catalog-heading"
    >
      <div className="dst-container">
        <div className="mx-auto max-w-[42rem] text-center">
          <p className="text-[0.72rem] font-semibold tracking-[0.2em] text-[#9aa0a6] uppercase">
            Catálogo completo
          </p>
          <h2
            id="tools-catalog-heading"
            className="mt-3 font-inter text-[1.85rem] leading-[1.12] font-semibold tracking-[-0.04em] text-[#16161c] sm:text-[2.25rem]"
          >
            Aquí están todas las opciones
          </h2>
          <p className="mt-4 text-[0.98rem] leading-relaxed text-[#6b716f] sm:text-[1.05rem]">
            Cada tarjeta abre una herramienta distinta. Todas son gratuitas, no
            requieren registro y están listas para usar ahora mismo.
          </p>
        </div>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3 lg:gap-5">
          {tools.map((tool) => (
            <li key={tool.id}>
              <ToolCard tool={tool} className="h-full min-h-[11.5rem]" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
