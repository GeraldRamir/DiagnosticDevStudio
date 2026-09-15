import type { ReactNode } from "react";
import { ToolsWorkspace } from "@/components/tools/tools-workspace";

export default function ToolsLayout({ children }: { children: ReactNode }) {
  return <ToolsWorkspace>{children}</ToolsWorkspace>;
}
