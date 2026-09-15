import { HelpContactCta } from "@/components/ayuda/help-contact-cta";
import { HelpFaq } from "@/components/ayuda/help-faq";
import { HelpHero } from "@/components/ayuda/help-hero";
import { HelpToolsMap } from "@/components/ayuda/help-tools-map";
import { HelpTopics } from "@/components/ayuda/help-topics";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Ayuda y preguntas frecuentes | Dev Studio Tools",
  description:
    "Cómo empezar, qué pasa con tus datos y qué esperar de los resultados de cada herramienta.",
  path: "/ayuda",
});

export default function HelpPage() {
  return (
    <div className="bg-[#f9f9f7]">
      <HelpHero />
      <HelpTopics />
      <HelpToolsMap />
      <HelpFaq />
      <HelpContactCta />
    </div>
  );
}
