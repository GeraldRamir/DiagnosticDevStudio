"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { SiteShell } from "@/components/layout/site-shell";

function shouldHideFooter(pathname: string) {
  return pathname.startsWith("/tools/") && pathname !== "/tools";
}

export function PlatformShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return <SiteShell footer={!shouldHideFooter(pathname)}>{children}</SiteShell>;
}
