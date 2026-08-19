import { NextResponse } from "next/server";
import { instagramOAuthConfigured, instagramOAuthUrl } from "@/lib/instagram/oauth";

export async function GET() {
  if (!instagramOAuthConfigured()) {
    return NextResponse.json({ ok: false, message: "OAuth de Instagram no configurado" }, { status: 503 });
  }
  return NextResponse.redirect(instagramOAuthUrl());
}
