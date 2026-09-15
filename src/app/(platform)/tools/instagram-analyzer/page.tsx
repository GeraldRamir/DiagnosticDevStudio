import { InstagramWizard } from "@/components/tools/instagram/instagram-wizard";
import { ToolFooter } from "@/components/tools/tool-footer";
import { ToolHeader } from "@/components/tools/tool-header";
import { getToolById } from "@/lib/tools";
import { toolMetadata } from "@/lib/seo";

const tool = getToolById("instagram-analyzer");

export const metadata = toolMetadata(tool);

export default function InstagramAnalyzerPage() {
  return (
    <section className="dst-section">
      <div className="dst-container max-w-4xl">
        <ToolHeader
          title={tool.name}
          description={tool.description}
          crumbs={[
            { href: "/", label: "Inicio" },
            { href: "/tools", label: "Herramientas" },
            { label: tool.shortName },
          ]}
        />
        <InstagramWizard />
        <ToolFooter toolId={tool.id} />
      </div>
    </section>
  );
}
