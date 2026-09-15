import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Mockup de dispositivo para la vista previa del editor.
 * Reproduce el marco y la barra de estado para que el dueño juzgue el menú
 * como lo verá su cliente, no como una caja suelta.
 */
export function PhoneFrame({
  children,
  device = "phone",
}: {
  children: ReactNode;
  device?: "phone" | "tablet";
}) {
  const phone = device === "phone";

  return (
    <div className={cn("mx-auto w-full", phone ? "max-w-[19.5rem]" : "max-w-[26rem]")}>
      <div
        className={cn(
          "relative border-[#101013] bg-[#101013] shadow-[0_28px_70px_rgba(16,16,19,0.28)]",
          phone ? "rounded-[2.6rem] border-[10px]" : "rounded-[2rem] border-[12px]",
        )}
      >
        {phone ? (
          <span
            className="absolute top-2.5 left-1/2 z-30 h-6 w-24 -translate-x-1/2 rounded-full bg-[#101013]"
            aria-hidden
          />
        ) : null}

        <div
          className={cn(
            "relative overflow-hidden bg-white",
            phone ? "rounded-[2rem]" : "rounded-[1.25rem]",
          )}
        >
          {/* Barra de estado simulada */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between px-6 pt-2.5 text-[0.62rem] font-semibold text-[#101013] mix-blend-difference"
            aria-hidden
          >
            <span className="invert">9:41</span>
            <span className="flex items-center gap-1 invert">
              <span className="inline-block h-2 w-3.5 rounded-[2px] border border-current" />
            </span>
          </div>

          <div
            className={cn(
              "overflow-y-auto overscroll-contain",
              phone ? "h-[36rem]" : "h-[38rem]",
            )}
          >
            <div className="pt-6">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
