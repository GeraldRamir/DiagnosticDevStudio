import { cookies } from "next/headers";

export const FUNNEL_SESSION_COOKIE = "ds_funnel_session";

export async function getFunnelSessionId(): Promise<string> {
  const jar = await cookies();
  return jar.get(FUNNEL_SESSION_COOKIE)?.value ?? "";
}

export function newFunnelSessionId() {
  return crypto.randomUUID();
}
