import { MenusDashboard } from "@/components/tools/menu/menus-dashboard";
import { TrackOnMount } from "@/components/tools/track-on-mount";
import { getToolById } from "@/lib/tools";
import { toolMetadata } from "@/lib/seo";

const tool = getToolById("menu-digital");

export const metadata = toolMetadata(tool);

export default function MenuDigitalPage() {
  return (
    <section className="-mt-[4.5rem] min-h-dvh w-full bg-[#FAF8F7] px-[clamp(1.25rem,3vw,2.25rem)] pt-[6rem] pb-10">
      <TrackOnMount name="tool_opened" toolId={tool.id} />
      <MenusDashboard />
    </section>
  );
}
