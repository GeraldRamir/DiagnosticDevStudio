import { NextResponse } from "next/server";
import { loginAdmin } from "@/lib/instagram/admin";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { password?: string } | null;
  const ok = await loginAdmin(body?.password || "");
  if (!ok) {
    return NextResponse.json({ ok: false, message: "Contraseña incorrecta" }, { status: 401 });
  }
  return NextResponse.json({ ok: true });
}
