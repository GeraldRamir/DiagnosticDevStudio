import { WhatsappLanding } from "@/components/tools/whatsapp/whatsapp-landing";
import { TrackOnMount } from "@/components/tools/track-on-mount";
import { getToolById } from "@/lib/tools";
import { toolMetadata } from "@/lib/seo";

const tool = getToolById("whatsapp-generator");

export const metadata = toolMetadata(tool);

export default function WhatsappGeneratorPage() {
  return (
    <>
      <TrackOnMount name="tool_opened" toolId={tool.id} />
      <WhatsappLanding />
    </>
  );
}
