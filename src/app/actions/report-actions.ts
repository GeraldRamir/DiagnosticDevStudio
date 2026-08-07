"use server";

import { getPrisma } from "@/lib/db";

export async function markPdfDownloaded(slug: string) {
  const prisma = getPrisma();
  const lead = await prisma.lead.findUnique({
    where: { slug },
    include: { report: true },
  });
  if (!lead?.report) return { ok: false as const };
  await prisma.report.update({
    where: { id: lead.report.id },
    data: { pdfDownloaded: true },
  });
  return { ok: true as const };
}
