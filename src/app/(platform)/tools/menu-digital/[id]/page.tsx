import { MenuEditor } from "@/components/tools/menu/menu-editor";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Editar menú digital | Dev Studio Tools",
  description: "Edita tu menú digital: negocio, productos, diseño y publicación.",
  path: "/tools/menu-digital",
});

export default async function MenuEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <section className="-mt-[4.5rem] min-h-dvh w-full bg-[#FAF8F7] px-[clamp(1.25rem,3vw,2.25rem)] pt-[6rem] pb-10">
      <MenuEditor menuId={id} />
    </section>
  );
}
