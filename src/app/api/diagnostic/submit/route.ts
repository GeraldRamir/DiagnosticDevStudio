import { NextResponse } from "next/server";
import { processDiagnosticSubmission } from "@/lib/submit-diagnostic";

export const maxDuration = 300;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Cuerpo de solicitud inválido" },
      { status: 400 },
    );
  }

  const result = await processDiagnosticSubmission(body);
  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
