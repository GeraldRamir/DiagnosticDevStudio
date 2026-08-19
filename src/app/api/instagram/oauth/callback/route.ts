import { NextResponse } from "next/server";
import { encodeLeadSnapshot, exchangeInstagramCode, LEAD_IG_COOKIE } from "@/lib/instagram/oauth";

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
    const metrics = await exchangeInstagramCode(code);
    dest.searchParams.set("ig", "ok");
    const response = NextResponse.redirect(dest);
    response.cookies.set(LEAD_IG_COOKIE, await encodeLeadSnapshot(metrics), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 2,
    });
    return response;
  } catch {
    dest.searchParams.set("ig", "error");
    return NextResponse.redirect(dest);
  }
}
