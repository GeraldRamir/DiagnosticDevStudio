import {
  analyzeTechnical,
  calculateHoursLost,
  calculateScores,
  generateNarrative,
} from "@/lib/analysis";
import { analyzeInstagram } from "@/lib/analysis/instagram";
import { refreshLeadInstagramMetrics } from "@/lib/instagram/oauth";
import { resolveAnalysisFocus } from "@/lib/report/analysis-focus";
import type { DiagnosticInput, InstagramMetrics } from "@/lib/analysis/types";
import type { DiagnosticFormValues } from "@/lib/form-schema";
import { toDiagnosticInput } from "@/lib/form-schema";

export async function runDiagnostic(values: DiagnosticFormValues) {
  const input: DiagnosticInput = toDiagnosticInput(values);

  const hours = calculateHoursLost({
    weeklyHoursOnAdmin: input.weeklyHoursOnAdmin,
    recordKeeping: input.recordKeeping,
    orderChannel: input.orderChannel,
  });

  let technical = null;
  let technicalRaw: unknown = null;
  let instagram: InstagramMetrics | null = null;
  let instagramRaw: unknown = null;
  let forcePartial = false;

  async function resolveInstagram() {
    if (!input.instagramHandle?.trim()) {
      return;
    }

    const oauthMetrics = await refreshLeadInstagramMetrics();
    if (oauthMetrics?.found) {
      instagram = oauthMetrics;
      instagramRaw = oauthMetrics;
      return;
    }

    const scraped = await analyzeInstagram(input.instagramHandle);
    instagram = scraped.metrics;
    instagramRaw = scraped.raw ?? scraped.metrics;
    if (!scraped.metrics.found) {
      forcePartial = true;
    }
  }

  const analysisJobs: Promise<void>[] = [];
  if (input.instagramHandle?.trim()) {
    analysisJobs.push(resolveInstagram());
  }

  if (input.hasWebsite === "yes" && input.websiteUrl) {
    analysisJobs.push(
      analyzeTechnical(input.websiteUrl).then((result) => {
        technical = result.metrics;
        technicalRaw = result.raw;
        if (result.metrics.pagespeedFailed || result.metrics.error) {
          forcePartial = true;
        }
      }),
    );
  }

  await Promise.all(analysisJobs);

  const scores = calculateScores({
    form: {
      hasWebsite: input.hasWebsite,
      websiteUrl: input.websiteUrl,
      instagramHandle: input.instagramHandle,
      orderChannel: input.orderChannel,
      recordKeeping: input.recordKeeping,
      weeklyHoursOnAdmin: input.weeklyHoursOnAdmin,
      teamSize: input.teamSize,
      biggestTimeWaster: input.biggestTimeWaster,
    },
    technical,
    instagram,
    hours,
  });

  const analysisFocus = resolveAnalysisFocus({
    hasWebsite: input.hasWebsite,
    instagram,
    technical,
    instagramHandle: input.instagramHandle,
  });

  const { narrative, analysisStatus } = await generateNarrative({
    signals: scores.signals,
    scores,
    hours,
    industry: input.industry,
    country: input.country,
    biggestTimeWaster: input.biggestTimeWaster,
    businessName: input.businessName,
    forcePartial,
    analysisFocus,
  });

  return {
    input,
    hours,
    technical,
    technicalRaw,
    instagram,
    instagramRaw,
    scores,
    narrative,
    analysisStatus,
  };
}
