import {
  QrCta,
  QrFrame,
  QrHero,
  QrHighlights,
  QrSteps,
  QrUseCases,
} from "@/components/tools/qr/qr-sections";
import { QrApp } from "@/components/tools/qr/qr-app";
import { TrackOnMount } from "@/components/tools/track-on-mount";
import { getToolById } from "@/lib/tools";
import { toolMetadata } from "@/lib/seo";

const tool = getToolById("qr-generator");

export const metadata = toolMetadata(tool);

export default function QrGeneratorPage() {
  return (
    <div className="-mt-[4.5rem] w-full bg-[#FBF5F1] pt-[4.5rem]">
      <TrackOnMount name="tool_opened" toolId={tool.id} />
      <QrHero />
      <QrFrame>
        <QrApp />
      </QrFrame>
      <QrHighlights />
      <QrUseCases />
      <QrSteps />
      <QrCta />
    </div>
  );
}
