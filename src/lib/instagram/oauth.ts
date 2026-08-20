import { cookies } from "next/headers";
import type { InstagramMetrics } from "@/lib/analysis/types";
import { summarizeMedia } from "@/lib/analysis/instagram";
import { fetchLeadAccount } from "@/lib/instagram/graph";

export const LEAD_IG_COOKIE = "ds_ig_lead";
export const LEAD_IG_TOKEN_COOKIE = "ds_ig_lead_token";

const TOKEN_MAX_AGE_SEC = 60 * 60 * 4;
const METRICS_TIMEOUT_MS = 15_000;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("instagram_oauth_timeout")), ms);
    promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((err: unknown) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

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

export function oauthRedirectUri() {
  return redirectUri();
}

export function instagramOAuthUrl() {
  const url = new URL("https://www.instagram.com/oauth/authorize");
  url.searchParams.set("client_id", appId());
  url.searchParams.set("redirect_uri", redirectUri());
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "instagram_business_basic,instagram_business_manage_insights");
  // Instagram Login only — avoid Facebook Login flow that breaks for standalone apps
  url.searchParams.set("enable_fb_login", "0");
  return url.toString();
}

async function hmac(value: string) {
  const { createHmac } = await import("node:crypto");
  return createHmac("sha256", appSecret() || "devstudio").update(value).digest("hex");
}

async function signPayload(payload: string) {
  return `${payload}.${await hmac(payload)}`;
}

async function verifySignedPayload(raw: string | undefined | null): Promise<string | null> {
  if (!raw || !raw.includes(".")) return null;
  const [payload, signature] = raw.split(".");
  if (!payload || !signature) return null;
  const expected = await hmac(payload);
  if (expected.length !== signature.length) return null;
  let out = 0;
  for (let i = 0; i < expected.length; i++) out |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  if (out !== 0) return null;
  return payload;
}

export async function encodeLeadSnapshot(metrics: InstagramMetrics) {
  const json = Buffer.from(JSON.stringify(metrics), "utf8").toString("base64url");
  return signPayload(json);
}

export async function decodeLeadSnapshot(raw: string | undefined | null): Promise<InstagramMetrics | null> {
  const json = await verifySignedPayload(raw);
  if (!json) return null;
  try {
    return JSON.parse(Buffer.from(json, "base64url").toString("utf8")) as InstagramMetrics;
  } catch {
    return null;
  }
}

export async function encodeLeadAccessToken(accessToken: string) {
  const json = Buffer.from(JSON.stringify({ t: accessToken }), "utf8").toString("base64url");
  return signPayload(json);
}

export async function decodeLeadAccessToken(raw: string | undefined | null): Promise<string | null> {
  const json = await verifySignedPayload(raw);
  if (!json) return null;
  try {
    const parsed = JSON.parse(Buffer.from(json, "base64url").toString("utf8")) as { t?: string };
    return parsed.t?.trim() || null;
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

export async function readLeadAccessToken(): Promise<string | null> {
  try {
    const jar = await cookies();
    return decodeLeadAccessToken(jar.get(LEAD_IG_TOKEN_COOKIE)?.value);
  } catch {
    return null;
  }
}

export async function buildLeadMetricsFromAccessToken(accessToken: string): Promise<InstagramMetrics> {
  const account = await fetchLeadAccount(accessToken);
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

async function exchangeCodeForToken(code: string): Promise<string> {
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

  return access;
}

export async function exchangeInstagramCode(code: string): Promise<InstagramMetrics> {
  const { metrics } = await exchangeInstagramAuth(code);
  return metrics;
}

export async function exchangeInstagramAuth(code: string): Promise<{
  metrics: InstagramMetrics;
  accessToken: string;
}> {
  const access = await exchangeCodeForToken(code);
  const metrics = await buildLeadMetricsFromAccessToken(access);
  return { metrics, accessToken: access };
}

export const leadInstagramCookieOptions = {
  httpOnly: true as const,
  sameSite: "lax" as const,
  path: "/",
  maxAge: TOKEN_MAX_AGE_SEC,
};

export async function setLeadInstagramCookies(
  response: { cookies: { set: (name: string, value: string, options: typeof leadInstagramCookieOptions) => void } },
  metrics: InstagramMetrics,
  accessToken: string,
) {
  response.cookies.set(LEAD_IG_COOKIE, await encodeLeadSnapshot(metrics), leadInstagramCookieOptions);
  response.cookies.set(LEAD_IG_TOKEN_COOKIE, await encodeLeadAccessToken(accessToken), leadInstagramCookieOptions);
}

export async function refreshLeadInstagramMetrics(): Promise<InstagramMetrics | null> {
  const token = await readLeadAccessToken();
  if (!token) {
    return readLeadSnapshot();
  }

  try {
    return await withTimeout(buildLeadMetricsFromAccessToken(token), METRICS_TIMEOUT_MS);
  } catch {
    return readLeadSnapshot();
  }
}
