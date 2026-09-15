import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function ResultCard({
  title,
  children,
  className,
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-border bg-white p-5 sm:p-6",
        className,
      )}
    >
      <h3 className="text-sm font-semibold tracking-tight text-foreground">{title}</h3>
      <div className="mt-3 text-sm leading-relaxed text-muted-foreground">{children}</div>
    </section>
  );
}
