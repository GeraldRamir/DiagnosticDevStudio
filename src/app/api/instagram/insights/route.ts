import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/instagram/admin";
import { getStudioInsights, instagramConfigured } from "@/lib/instagram/graph";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ ok: false, message: "No autorizado" }, { status: 401 });
  }
  if (!instagramConfigured()) {
    return NextResponse.json({ ok: false, message: "Instagram no configurado" }, { status: 503 });
  }
  try {
    const data = await getStudioInsights();
    return NextResponse.json({ ok: true, ...data });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Insights no disponibles" },
      { status: 502 },
    );
  }
}
