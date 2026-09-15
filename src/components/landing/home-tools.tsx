import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Camera,
  MessageCircle,
  QrCode,
  UtensilsCrossed,
} from "lucide-react";
import { getCategoryLabel, TOOLS } from "@/lib/tools";
import type { ToolIconName } from "@/types/tools";

const ICONS: Record<ToolIconName, typeof Activity> = {
  activity: Activity,
  instagram: Camera,
  "message-circle": MessageCircle,
  "qr-code": QrCode,
  utensils: UtensilsCrossed,
};

export function HomeTools() {
  return (
    <section className="dst-container pb-16 pt-2 md:pb-20">
      <div className="dst-mega px-6 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-12">
        <div className="grid gap-6 md:grid-cols-2 md:items-end">
          <h2 className="font-display max-w-md text-[1.85rem] leading-[1.08] font-extrabold tracking-[-0.035em] text-foreground sm:text-[2.15rem]">
            Cinco herramientas independientes, listas para usar hoy
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground lg:justify-self-end">
            Úsalas por separado o combínalas. Cada una resuelve un problema concreto de tu negocio,
            sin cuentas extra.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {TOOLS.map((tool) => {
            const Icon = ICONS[tool.icon];
            return (
              <Link
                key={tool.id}
                href={tool.href}
                className="group flex flex-col rounded-[1.75rem] bg-[#f6f5fa] p-6 transition-transform duration-200 hover:-translate-y-0.5"
              >
                <span className="mb-5 flex size-10 items-center justify-center rounded-2xl bg-white text-foreground">
                  <Icon className="size-5" aria-hidden />
                </span>
                <p className="text-[0.62rem] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                  {getCategoryLabel(tool.category)}
                </p>
                <h3 className="mt-1 text-[1.05rem] font-semibold tracking-tight text-foreground">
                  {tool.shortName}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {tool.cardDescription}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-foreground">
                  {tool.cta}
                  <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
