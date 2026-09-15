import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type BreadcrumbItem = {
  href?: string;
  label: string;
};

export function ToolBreadcrumb({ items }: { items: readonly BreadcrumbItem[] }) {
  return (
    <nav aria-label="Miga de pan" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1">
              {index > 0 ? <ChevronRight className="size-3.5 opacity-50" aria-hidden /> : null}
              {item.href && !last ? (
                <Link
                  href={item.href}
                  className="transition-colors duration-200 hover:text-foreground"
                >
                  {item.label}
                </Link>
              ) : (
                <span className={last ? "font-medium text-foreground" : undefined}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
