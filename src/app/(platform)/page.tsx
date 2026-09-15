import { HomeHero } from "@/components/landing/home-hero";
import { HomePromo } from "@/components/landing/home-promo";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Dev Studio Tools | La plataforma para digitalizar tu negocio",
  description:
    "Dev Studio Tools es la plataforma con la que Dev Studio digitaliza negocios: presencia, contacto y operación, con criterio de estudio.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <HomePromo />
    </>
  );
}
