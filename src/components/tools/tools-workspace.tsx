"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ToolsSwitcher } from "@/components/tools/tools-switcher";
import { cn } from "@/lib/utils";

function isMenuEditorPath(pathname: string) {
  return /^\/tools\/menu-digital\/[^/]+/.test(pathname);
}

function isToolAppPath(pathname: string) {
  return pathname.startsWith("/tools/") && pathname !== "/tools";
}

export function ToolsWorkspace({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const mounted = useRef(false);
  const isEditor = isMenuEditorPath(pathname);
  const showDock = isToolAppPath(pathname);

  useEffect(() => {
    mounted.current = true;
  }, []);

  if (isEditor) {
    return children;
  }

  return (
    <div className={cn("bg-white", showDock && "pb-[calc(4.75rem+env(safe-area-inset-bottom))] md:pb-[calc(5rem+env(safe-area-inset-bottom))]")}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={pathname}
          initial={
            !mounted.current || reduce ? false : { opacity: 0, y: 14, filter: "blur(4px)" }
          }
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10, filter: "blur(3px)" }}
          transition={{ duration: reduce ? 0.12 : 0.36, ease: [0.22, 1, 0.36, 1] }}
          className="[view-transition-name:tools-stage]"
        >
          {children}
        </motion.div>
      </AnimatePresence>

      {showDock ? (
        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-black/[0.06] bg-white/94 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_32px_rgba(22,22,28,0.06)] backdrop-blur-xl">
          <ToolsSwitcher variant="dock" />
        </div>
      ) : null}
    </div>
  );
}
