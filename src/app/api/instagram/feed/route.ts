import { NextResponse } from "next/server";
import { getStudioFeed, instagramConfigured } from "@/lib/instagram/graph";

export const revalidate = 300;

export async function GET() {
  if (!instagramConfigured()) {
    return NextResponse.json(
      { ok: false, message: "Instagram no configurado" },
      { status: 503 },
    );
  }

  try {
    const feed = await getStudioFeed();
    return NextResponse.json(
      { ok: true, ...feed },
      { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } },
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "Instagram no disponible",
      },
      { status: 502 },
    );
  }
}
