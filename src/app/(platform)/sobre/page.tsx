import { AboutClientsStrip } from "@/components/sobre/about-clients-strip";
import { AboutHero } from "@/components/sobre/about-hero";
import { AboutMission } from "@/components/sobre/about-mission";
import { AboutServicesGrid } from "@/components/sobre/about-services-grid";
import { AboutStats } from "@/components/sobre/about-stats";
import { AboutTestimonials } from "@/components/sobre/about-testimonials";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Nosotros | Dev Studio Tools",
  description:
    "Dev Studio desarrolla páginas web, aplicaciones, sistemas y automatizaciones para negocios. Conoce al estudio detrás de las herramientas.",
  path: "/sobre",
});

export default function AboutPage() {
  return (
    <div className="overflow-x-clip">
      <AboutHero />
      <AboutMission />
      <AboutStats />
      <AboutServicesGrid />
      <AboutTestimonials />
      <AboutClientsStrip />
    </div>
  );
}
