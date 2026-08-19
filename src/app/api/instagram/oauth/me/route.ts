import { NextResponse } from "next/server";
import { instagramOAuthConfigured, readLeadSnapshot } from "@/lib/instagram/oauth";

export async function GET() {
  const snapshot = await readLeadSnapshot();
  return NextResponse.json({
    configured: instagramOAuthConfigured(),
    connected: Boolean(snapshot?.found),
    username: snapshot?.username ?? null,
    followers: snapshot?.followers ?? null,
  });
}
