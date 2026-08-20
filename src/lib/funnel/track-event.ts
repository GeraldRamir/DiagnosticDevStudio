import { getPrisma } from "@/lib/db";

export type FunnelStep =
  | "diagnostico_visit"
  | "diagnostico_step"
  | "diagnostico_submit"
  | "instagram_connect";

export async function trackFunnelEvent(input: {
  sessionId: string;
  step: FunnelStep;
  leadId?: string | null;
  source?: string | null;
  campaign?: string | null;
}) {
  if (!input.sessionId) return;

  const prisma = getPrisma();
  await prisma.funnelEvent.create({
    data: {
      sessionId: input.sessionId,
      step: input.step,
      leadId: input.leadId ?? null,
      source: input.source?.trim() || null,
      campaign: input.campaign?.trim() || null,
    },
  });
}
