import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { trackFunnelEvent } from "@/lib/funnel/track-event";
import { FUNNEL_SESSION_COOKIE, newFunnelSessionId } from "@/lib/funnel/session";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    source?: string | null;
    campaign?: string | null;
  };

  const jar = await cookies();
  let sessionId = jar.get(FUNNEL_SESSION_COOKIE)?.value;
  const isNewSession = !sessionId;

  if (!sessionId) {
    sessionId = newFunnelSessionId();
  }

  await trackFunnelEvent({
    sessionId,
    step: "diagnostico_visit",
    source: body.source,
    campaign: body.campaign,
  });

  const response = NextResponse.json({ ok: true, sessionId });

  if (isNewSession) {
    response.cookies.set(FUNNEL_SESSION_COOKIE, sessionId, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 90,
    });
  }

  return response;
}
