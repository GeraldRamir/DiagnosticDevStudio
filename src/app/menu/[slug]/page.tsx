import { MenuPublicPage } from "@/components/tools/menu/public/menu-public-page";
import { pageMetadata } from "@/lib/seo";

/**
 * Metadata base del menú público.
 * Cuando los menús vivan en el servidor, aquí se leerá el negocio real
 * para generar title, description y Open Graph por menú.
 */
export const metadata = pageMetadata({
  title: "Menú Digital",
  description:
    "Consulta el menú de este negocio: productos, precios y opciones disponibles.",
  path: "/menu",
});

export default async function PublicMenuPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <MenuPublicPage slug={slug} />;
}
