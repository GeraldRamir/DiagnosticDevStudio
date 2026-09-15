import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function HelpNotchedPanel({
  children,
  className,
  tab,
  tabClassName,
}: {
  children: ReactNode;
  className?: string;
  tab?: ReactNode;
  tabClassName?: string;
}) {
  return (
    <div className={cn("relative pt-5 sm:pt-6", className)}>
      {tab ? (
        <div
          className={cn(
            "absolute top-0 left-[clamp(1.25rem,4vw,2.75rem)] z-10 flex items-end",
            tabClassName,
          )}
        >
          <div className="flex min-h-[2.75rem] items-center gap-2 rounded-t-[1.35rem] border border-b-0 border-black/[0.06] bg-white px-4 py-2 shadow-[0_-4px_24px_rgba(22,22,28,0.04)] sm:min-h-[3rem] sm:px-5">
            {tab}
          </div>
        </div>
      ) : null}
      <div className="rounded-[2rem] border border-black/[0.06] bg-white shadow-[0_24px_60px_rgba(22,22,28,0.06)] sm:rounded-[2.5rem]">
        {children}
      </div>
    </div>
  );
}
