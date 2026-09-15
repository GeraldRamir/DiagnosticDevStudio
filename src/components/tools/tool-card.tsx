import Link from "next/link";
import { ArrowUpRight, Sparkles, Star } from "lucide-react";
import { TOOL_ICONS } from "@/components/tools/tool-icons";
import { getToolTheme } from "@/components/tools/tool-theme";
import { getCategoryLabel } from "@/lib/tools";
import { cn } from "@/lib/utils";
import type { ToolDefinition } from "@/types/tools";

/**
 * Tarjeta pastel del catálogo: tile de icono + categoría arriba a la izquierda,
 * insignia a la derecha, titular al centro y pie con detalle y clúster.
 */
export function ToolCard({
  tool,
  className,
}: {
  tool: ToolDefinition;
  className?: string;
}) {
  const Icon = TOOL_ICONS[tool.icon];
  const theme = getToolTheme(tool.id);

  return (
    <Link
      href={tool.href}
      style={{ backgroundColor: theme.surface }}
      className={cn(
        "group flex h-full min-h-[10.5rem] flex-col rounded-[1.25rem] px-5 pt-4 pb-4 transition-transform duration-200 hover:-translate-y-0.5",
        className,
      )}
      aria-label={`${tool.shortName}: ${tool.cardDescription}`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-3 text-[0.8rem] font-medium tracking-tight text-[#16161c]">
          <span className="inline-flex size-9 items-center justify-center rounded-[0.7rem] bg-white">
            <Icon
              className="size-4"
              strokeWidth={1.8}
              style={{ color: theme.icon }}
              aria-hidden
            />
          </span>
          {getCategoryLabel(tool.category)}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[0.78rem] font-medium text-[#16161c]">
          <Star className="size-3.5 text-[#FF8A3D]" strokeWidth={1.8} aria-hidden />
          Gratis
        </span>
      </div>

      <h3 className="font-display mt-auto pt-6 text-[1.3rem] leading-[1.2] font-normal tracking-[-0.025em] text-[#16161c]">
        {tool.shortName}
      </h3>

      <div className="mt-2 flex items-end justify-between gap-3">
        <p className="max-w-[16rem] text-[0.78rem] leading-snug text-[#16161c]/55">
          {tool.features[0]}
        </p>
        <span className="flex shrink-0 items-center -space-x-2.5" aria-hidden>
          <span
            className="inline-flex size-8 items-center justify-center rounded-full border-2 border-white"
            style={{ backgroundColor: theme.icon }}
          >
            <Sparkles className="size-3.5 text-white" strokeWidth={1.8} />
          </span>
          <span className="inline-flex size-9 items-center justify-center rounded-full border-2 border-white bg-[#16161c] transition-transform duration-200 group-hover:-translate-y-0.5">
            <ArrowUpRight className="size-4 text-white" strokeWidth={1.8} />
          </span>
        </span>
      </div>
    </Link>
  );
}
