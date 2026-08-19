import { cookies } from "next/headers";
import type { InstagramMetrics } from "@/lib/analysis/types";
import { summarizeMedia } from "@/lib/analysis/instagram";
import { fetchLeadAccount } from "@/lib/instagram/graph";

export const LEAD_IG_COOKIE = "ds_ig_lead";

function appId() {
  return (process.env.INSTAGRAM_APP_ID ?? "").trim();
}

function appSecret() {
  return (process.env.INSTAGRAM_APP_SECRET ?? "").trim();
}

function redirectUri() {
  const base = (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/$/, "");
  return `${base}/api/instagram/oauth/callback`;
}

export function instagramOAuthConfigured() {
  return Boolean(appId() && appSecret());
}

export function instagramOAuthUrl() {
  const url = new URL("https://www.instagram.com/oauth/authorize");
  url.searchParams.set("client_id", appId());
  url.searchParams.set("redirect_uri", redirectUri());
  url.searchParams.set("response_type", "code");
  url.searchParams.set(
    "scope",
    "instagram_business_basic,instagram_business_manage_insights",
  );
  return url.toString();
}

async function hmac(value: string) {
  const { createHmac } = await import("node:crypto");
  return createHmac("sha256", appSecret() || "devstudio").update(value).digest("hex");
}

export async function encodeLeadSnapshot(metrics: InstagramMetrics) {
  const json = Buffer.from(JSON.stringify(metrics), "utf8").toString("base64url");
  return `${json}.${await hmac(json)}`;
}

export async function decodeLeadSnapshot(raw: string | undefined | null): Promise<InstagramMetrics | null> {
  if (!raw || !raw.includes(".")) return null;
  const [json, signature] = raw.split(".");
  if (!json || !signature) return null;
  const expected = await hmac(json);
  if (expected.length !== signature.length) return null;
  let out = 0;
  for (let i = 0; i < expected.length; i++) out |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  if (out !== 0) return null;
  try {
    return JSON.parse(Buffer.from(json, "base64url").toString("utf8")) as InstagramMetrics;
  } catch {
    return null;
  }
}

export async function readLeadSnapshot(): Promise<InstagramMetrics | null> {
  try {
    const jar = await cookies();
    return decodeLeadSnapshot(jar.get(LEAD_IG_COOKIE)?.value);
  } catch {
    return null;
  }
}

export async function exchangeInstagramCode(code: string): Promise<InstagramMetrics> {
  const shortRes = await fetch("https://api.instagram.com/oauth/access_token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: appId(),
      client_secret: appSecret(),
      grant_type: "authorization_code",
      redirect_uri: redirectUri(),
      code,
    }),
  });
  const shortJson = (await shortRes.json()) as {
    access_token?: string;
    error_message?: string;
    error?: { message?: string };
  };
  if (!shortRes.ok || !shortJson.access_token) {
    throw new Error(shortJson.error_message || shortJson.error?.message || "No se pudo intercambiar el código");
  }

  let access = shortJson.access_token;
  try {
    const longUrl = new URL("https://graph.instagram.com/access_token");
    longUrl.searchParams.set("grant_type", "ig_exchange_token");
    longUrl.searchParams.set("client_secret", appSecret());
    longUrl.searchParams.set("access_token", access);
    const longRes = await fetch(longUrl);
    const longJson = (await longRes.json()) as { access_token?: string };
    if (longRes.ok && longJson.access_token) access = longJson.access_token;
  } catch {
    /* short-lived token still works for this request */
  }

  const account = await fetchLeadAccount(access);
  const stats = summarizeMedia({
    timestamps: account.media.map((item) => item.timestamp),
    likes: account.media.map((item) => item.like_count),
    comments: account.media.map((item) => item.comments_count),
    hasVideo: account.media.some((item) => item.media_type === "VIDEO"),
  });

  return {
    username: account.username,
    found: true,
    isPrivate: false,
    isBusiness: (account.accountType || "").toUpperCase().includes("BUSINESS"),
    followers: account.followers,
    following: account.following,
    posts: account.posts,
    biography: account.biography,
    externalUrl: account.website,
    profilePicUrl: account.profilePictureUrl,
    ...stats,
    reach7d: account.reach7d,
    impressions7d: account.impressions7d,
    profileViews7d: account.profileViews7d,
    oauthConnected: true,
    source: "oauth",
    fetchedAt: new Date().toISOString(),
  };
}
