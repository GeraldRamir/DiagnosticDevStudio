import { ToolsHubHero } from "@/components/tools/tools-hub-hero";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Todas las herramientas | Dev Studio Tools",
  description:
    "Aquí están todas las herramientas de Dev Studio: diagnóstico digital, Instagram, WhatsApp, QR y menú. Elige una y empieza gratis.",
  path: "/tools",
});

export default function ToolsPage() {
  return <ToolsHubHero />;
}
