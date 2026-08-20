import { NextResponse } from "next/server";
import {
  instagramOAuthConfigured,
  oauthRedirectUri,
  readLeadSnapshot,
} from "@/lib/instagram/oauth";

export async function GET() {
  const snapshot = await readLeadSnapshot();
  const appId = (process.env.INSTAGRAM_APP_ID ?? "").trim();

  return NextResponse.json({
    configured: instagramOAuthConfigured(),
    connected: Boolean(snapshot?.found),
    username: snapshot?.username ?? null,
    followers: snapshot?.followers ?? null,
    redirectUri: oauthRedirectUri(),
    appIdSuffix: appId.length >= 4 ? appId.slice(-4) : null,
  });
}
