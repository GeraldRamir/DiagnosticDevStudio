import {
  analyzeTechnical,
  calculateHoursLost,
  calculateScores,
  generateNarrative,
} from "@/lib/analysis";
import { analyzeInstagram } from "@/lib/analysis/instagram";
import { readLeadSnapshot } from "@/lib/instagram/oauth";
import type { DiagnosticInput } from "@/lib/analysis/types";
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
  let instagram = null;
  let instagramRaw: unknown = null;
  let forcePartial = false;

  const analysisJobs: Promise<void>[] = [];

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

  if (input.instagramHandle?.trim()) {
    analysisJobs.push(
      analyzeInstagram(input.instagramHandle).then((result) => {
        instagram = result.metrics;
        instagramRaw = result.raw ?? result.metrics;
        if (!result.metrics.found) {
          forcePartial = true;
        }
      }),
    );
  }

  await Promise.all(analysisJobs);

  const oauthSnapshot = await readLeadSnapshot();
  if (oauthSnapshot?.found) {
    instagram = {
      ...(instagram ?? {}),
      ...oauthSnapshot,
      found: true,
    };
    instagramRaw = oauthSnapshot;
    if (!input.instagramHandle?.trim()) {
      input.instagramHandle = `@${oauthSnapshot.username}`;
    }
  }

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

  const { narrative, analysisStatus } = await generateNarrative({
    signals: scores.signals,
    scores,
    hours,
    industry: input.industry,
    country: input.country,
    biggestTimeWaster: input.biggestTimeWaster,
    businessName: input.businessName,
    forcePartial,
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
