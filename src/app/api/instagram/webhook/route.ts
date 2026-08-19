import { NextResponse } from "next/server";
import {
  handleInstagramWebhook,
  verifyWebhookChallenge,
  verifyWebhookSignature,
} from "@/lib/instagram/graph";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const challenge = verifyWebhookChallenge(
    searchParams.get("hub.mode"),
    searchParams.get("hub.verify_token"),
    searchParams.get("hub.challenge"),
  );
  if (!challenge) {
    return new NextResponse("Forbidden", { status: 403 });
  }
  return new NextResponse(challenge, {
    status: 200,
    headers: { "Content-Type": "text/plain" },
  });
}

export async function POST(request: Request) {
  const raw = await request.text();
  const signature = request.headers.get("x-hub-signature-256");
  const valid = await verifyWebhookSignature(raw, signature);
  if (!valid) {
    return new NextResponse("Invalid signature", { status: 401 });
  }

  try {
    const payload = JSON.parse(raw || "{}") as {
      object?: string;
      entry?: Array<{ messaging?: Array<{ sender?: { id?: string } }> }>;
    };
    const result = await handleInstagramWebhook(payload);
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "Webhook error",
      },
      { status: 500 },
    );
  }
}
