import { renderToBuffer } from "@react-pdf/renderer";
import { NextResponse } from "next/server";
import { markPdfDownloaded } from "@/app/actions/report-actions";
import { ReportPdfDocument } from "@/lib/pdf/report-pdf-document";
import { loadReportBySlug } from "@/lib/report-loader";

type RouteProps = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, { params }: RouteProps) {
  const { slug } = await params;
  const report = await loadReportBySlug(slug);

  if (!report) {
    return NextResponse.json({ error: "Reporte no encontrado" }, { status: 404 });
  }

  const buffer = await renderToBuffer(<ReportPdfDocument report={report} />);
  await markPdfDownloaded(slug);

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="diagnostico-${slug}.pdf"`,
    },
  });
}
