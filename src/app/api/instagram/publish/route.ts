import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/instagram/admin";
import { publishInstagramMedia } from "@/lib/instagram/graph";

export async function POST(request: Request) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ ok: false, message: "No autorizado" }, { status: 401 });
  }
  try {
    const body = (await request.json()) as {
      imageUrl?: string;
      caption?: string;
      mediaType?: "IMAGE" | "REELS";
      videoUrl?: string;
    };
    if (!body.imageUrl && !body.videoUrl) {
      return NextResponse.json({ ok: false, message: "Falta imageUrl o videoUrl" }, { status: 400 });
    }
    const result = await publishInstagramMedia({
      imageUrl: body.imageUrl || "",
      caption: body.caption || "",
      mediaType: body.mediaType,
      videoUrl: body.videoUrl,
    });
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "No se pudo publicar" },
      { status: 502 },
    );
  }
}
