import { cookies } from "next/headers";

const COOKIE = "ds_admin";

function secret() {
  return (process.env.ADMIN_PASSWORD || process.env.INSTAGRAM_ADMIN_KEY || "").trim();
}

export function adminConfigured() {
  return Boolean(secret());
}

async function tokenValue() {
  const { createHmac } = await import("node:crypto");
  return createHmac("sha256", secret() || "x").update("instagram-admin").digest("hex").slice(0, 40);
}

export async function isAdminRequest() {
  if (!secret()) return false;
  const jar = await cookies();
  const offered = jar.get(COOKIE)?.value || "";
  const expected = await tokenValue();
  if (offered.length !== expected.length) return false;
  let out = 0;
  for (let i = 0; i < expected.length; i++) out |= offered.charCodeAt(i) ^ expected.charCodeAt(i);
  return out === 0;
}

export async function loginAdmin(password: string) {
  const expected = secret();
  if (!expected || password !== expected) return false;
  const jar = await cookies();
  jar.set(COOKIE, await tokenValue(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return true;
}
