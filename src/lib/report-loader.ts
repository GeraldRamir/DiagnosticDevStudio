import { format } from "date-fns";
import { es } from "date-fns/locale";
import { notFound } from "next/navigation";
import { getPrisma } from "@/lib/db";
import { unpackAnalysisRaw } from "@/lib/analysis/analysis-storage";
import { buildReportViewModel } from "@/lib/report-view-model";

export async function loadReportBySlug(slug: string) {
  const prisma = getPrisma();
  const lead = await prisma.lead.findUnique({
    where: { slug },
    include: { report: true },
  });

  if (!lead?.report) return null;

  const createdAt = format(lead.createdAt, "d MMM yyyy", { locale: es });
  const createdAtDay = format(lead.createdAt, "d", { locale: es });
  const createdAtLabel = format(lead.createdAt, "EEE, MMMM", { locale: es });
  const { technical, instagram } = unpackAnalysisRaw(lead.report.technicalRaw);

  return buildReportViewModel({
    businessName: lead.businessName,
    industry: lead.industry,
    country: lead.country,
    hasWebsite: lead.hasWebsite,
    websiteUrl: lead.websiteUrl,
    fullName: lead.fullName,
    email: lead.email,
    whatsapp: lead.whatsapp,
    slug: lead.slug,
    createdAt,
    createdAtDay,
    createdAtLabel,
    analysisStatus: lead.report.analysisStatus,
    viewCount: lead.report.viewCount,
    globalScore: lead.report.globalScore,
    scoreLabel: lead.report.scoreLabel,
    pillarScoresRaw: lead.report.pillarScores,
    signalsRaw: lead.report.signals,
    hoursRaw: lead.report.hoursLost,
    narrativeRaw: lead.report.narrative,
    technicalMetricsRaw: technical,
    instagramRaw: instagram,
  });
}

export async function loadReportBySlugOr404(slug: string) {
  const report = await loadReportBySlug(slug);
  if (!report) notFound();
  return report;
}
