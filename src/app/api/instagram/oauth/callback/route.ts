import { NextResponse } from "next/server";
import {
  exchangeInstagramAuth,
  setLeadInstagramCookies,
} from "@/lib/instagram/oauth";
import { trackFunnelEvent } from "@/lib/funnel/track-event";
import { getFunnelSessionId } from "@/lib/funnel/session";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/$/, "");
  const dest = new URL("/diagnostico", appUrl);

  if (!code) {
    dest.searchParams.set("ig", "error");
    return NextResponse.redirect(dest);
  }

  try {
    const { metrics, accessToken } = await exchangeInstagramAuth(code);
    dest.searchParams.set("ig", "ok");
    const response = NextResponse.redirect(dest);
    await setLeadInstagramCookies(response, metrics, accessToken);

    const sessionId = await getFunnelSessionId();
    if (sessionId) {
      await trackFunnelEvent({ sessionId, step: "instagram_connect" });
    }

    return response;
  } catch {
    dest.searchParams.set("ig", "error");
    return NextResponse.redirect(dest);
  }
}
