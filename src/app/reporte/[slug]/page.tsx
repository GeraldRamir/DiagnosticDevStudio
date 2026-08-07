import { ProdexDashboard } from "@/components/report/prodex-dashboard";
import { getPrisma } from "@/lib/db";
import { loadReportBySlugOr404 } from "@/lib/report-loader";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ReportPage({ params }: PageProps) {
  const { slug } = await params;
  const prisma = getPrisma();

  const report = await loadReportBySlugOr404(slug);

  await prisma.report.updateMany({
    where: { lead: { slug } },
    data: { viewCount: { increment: 1 } },
  });

  return <ProdexDashboard report={report} />;
}
