import { runDiagnostic } from "@/lib/analysis/run-diagnostic";
import { packAnalysisRaw } from "@/lib/analysis/analysis-storage";
import { diagnosticFormSchema } from "@/lib/form-schema";
import { getPrisma } from "@/lib/db";
import { sendDiagnosticReportEmail } from "@/lib/email/send-report-email";
import { buildReportSlug } from "@/lib/slug";
import type { SubmitDiagnosticResult } from "@/lib/submit-diagnostic.types";

export type { SubmitDiagnosticResult };

export async function processDiagnosticSubmission(
  raw: unknown,
): Promise<SubmitDiagnosticResult> {
  try {
    const values = diagnosticFormSchema.parse(raw);
    const analysis = await runDiagnostic(values);
    const slug = buildReportSlug(values.businessName);

    const prisma = getPrisma();

    await prisma.lead.create({
      data: {
        slug,
        businessName: values.businessName,
        industry: values.industry,
        country: values.country,
        hasWebsite: values.hasWebsite,
        websiteUrl: values.websiteUrl?.trim() || null,
        instagramHandle: values.instagramHandle?.trim() || null,
        orderChannel: values.orderChannel,
        recordKeeping: values.recordKeeping,
        biggestTimeWaster: values.biggestTimeWaster,
        weeklyHoursOnAdmin: values.weeklyHoursOnAdmin,
        teamSize: values.teamSize,
        fullName: values.fullName,
        email: values.email,
        whatsapp: values.whatsapp,
        consent: values.consent,
        report: {
          create: {
            globalScore: analysis.scores.globalScore,
            scoreLabel: analysis.scores.scoreLabel,
            pillarScores: analysis.scores.pillars,
            signals: analysis.scores.signals,
            technicalRaw: packAnalysisRaw({
              technicalRaw: analysis.technicalRaw,
              technical: analysis.technical,
              instagramRaw: analysis.instagramRaw,
              instagram: analysis.instagram,
            }),
            hoursLost: analysis.hours,
            narrative: analysis.narrative,
            analysisStatus: analysis.analysisStatus,
          },
        },
      },
    });

    await sendDiagnosticReportEmail({
      to: values.email,
      fullName: values.fullName,
      businessName: values.businessName,
      slug,
      globalScore: analysis.scores.globalScore,
      scoreLabel: analysis.scores.scoreLabel,
    });

    return { ok: true, slug };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "No se pudo generar el diagnóstico";
    return { ok: false, error: message };
  }
}
