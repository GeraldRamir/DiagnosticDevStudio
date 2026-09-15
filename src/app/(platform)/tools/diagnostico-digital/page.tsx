import { DiagnosticForm } from "@/components/diagnostico/diagnostic-form";
import { DiagnosticoVisitTracker } from "@/components/diagnostico/diagnostico-visit-tracker";
import { TrackOnMount } from "@/components/tools/track-on-mount";
import { getToolById } from "@/lib/tools";
import { toolMetadata } from "@/lib/seo";

const tool = getToolById("diagnostico-digital");

export const metadata = toolMetadata(tool);

export default function DiagnosticoDigitalPage() {
  return (
    <section className="dst-section bg-white">
      <DiagnosticoVisitTracker />
      <TrackOnMount name="tool_opened" toolId={tool.id} />
      <div className="dst-container py-8 md:py-12">
        <DiagnosticForm backHref="/tools" />
      </div>
    </section>
  );
}
