import { discoverBusiness } from "@/lib/instagram/graph";
import type { InstagramMetrics } from "./types";

const TIMEOUT_MS = 20_000;
const IG_APP_ID = "936619743392459";

type IgMediaNode = {
  taken_at_timestamp?: number;
  is_video?: boolean;
  __typename?: string;
  edge_liked_by?: { count?: number };
  edge_media_preview_like?: { count?: number };
  edge_media_to_comment?: { count?: number };
};

type IgApiUser = {
  username?: string;
  biography?: string;
  external_url?: string | null;
  is_private?: boolean;
  is_business_account?: boolean;
  edge_followed_by?: { count?: number };
  edge_follow?: { count?: number };
  edge_owner_to_timeline_media?: {
    count?: number;
    edges?: Array<{ node?: IgMediaNode }>;
  };
  profile_pic_url_hd?: string;
};

type IgApiResponse = {
  data?: { user?: IgApiUser };
  status?: string;
};

export function normalizeInstagramUsername(handle: string): string {
  return handle.trim().replace(/^@+/, "").split("/")[0]?.toLowerCase() ?? "";
}

function emptyMetrics(username: string, partial: Partial<InstagramMetrics> = {}): InstagramMetrics {
  return {
    username,
    found: false,
    isPrivate: null,
    isBusiness: null,
    followers: null,
    following: null,
    posts: null,
    biography: null,
    externalUrl: null,
    profilePicUrl: null,
    lastPostAt: null,
    postsLast30Days: null,
    avgLikes: null,
    avgComments: null,
    hasReels: null,
    recentSampleSize: null,
    source: null,
    fetchedAt: new Date().toISOString(),
    ...partial,
  };
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("instagram_timeout")), ms);
    promise
      .then((v) => {
        clearTimeout(timer);
        resolve(v);
      })
      .catch((e: unknown) => {
        clearTimeout(timer);
        reject(e);
      });
  });
}

export function summarizeMedia(input: {
  timestamps: Array<number | string | null | undefined>;
  likes: Array<number | null | undefined>;
  comments: Array<number | null | undefined>;
  hasVideo?: boolean;
}): Pick<
  InstagramMetrics,
  "lastPostAt" | "postsLast30Days" | "avgLikes" | "avgComments" | "hasReels" | "recentSampleSize"
> {
  const times = input.timestamps
    .map((value) => {
      if (typeof value === "number" && Number.isFinite(value)) {
        return value > 10_000_000_000 ? value / 1000 : value;
      }
      if (typeof value === "string" && value) {
        const parsed = Date.parse(value);
        return Number.isFinite(parsed) ? parsed / 1000 : null;
      }
      return null;
    })
    .filter((value): value is number => value != null)
    .sort((a, b) => b - a);

  const likes = input.likes.filter((value): value is number => value != null);
  const comments = input.comments.filter((value): value is number => value != null);
  const now = Date.now() / 1000;

  return {
    lastPostAt: times[0] ? new Date(times[0] * 1000).toISOString() : null,
    postsLast30Days: times.filter((time) => now - time <= 30 * 86400).length,
    avgLikes: likes.length ? Math.round(likes.reduce((sum, n) => sum + n, 0) / likes.length) : null,
    avgComments: comments.length
      ? Math.round(comments.reduce((sum, n) => sum + n, 0) / comments.length)
      : null,
    hasReels: input.hasVideo ?? null,
    recentSampleSize: times.length || likes.length || null,
  };
}

function mapUser(username: string, user: IgApiUser): InstagramMetrics {
  const nodes = user.edge_owner_to_timeline_media?.edges?.map((edge) => edge.node).filter(Boolean) ?? [];
  const stats = summarizeMedia({
    timestamps: nodes.map((node) => node?.taken_at_timestamp),
    likes: nodes.map((node) => node?.edge_liked_by?.count ?? node?.edge_media_preview_like?.count),
    comments: nodes.map((node) => node?.edge_media_to_comment?.count),
    hasVideo: nodes.some((node) => node?.is_video || node?.__typename === "GraphVideo"),
  });

  return {
    username: user.username ?? username,
    found: true,
    isPrivate: user.is_private ?? null,
    isBusiness: user.is_business_account ?? null,
    followers: user.edge_followed_by?.count ?? null,
    following: user.edge_follow?.count ?? null,
    posts: user.edge_owner_to_timeline_media?.count ?? null,
    biography: user.biography ?? null,
    externalUrl: user.external_url ?? null,
    profilePicUrl: user.profile_pic_url_hd ?? null,
    ...stats,
    source: "web_profile",
    fetchedAt: new Date().toISOString(),
  };
}

/** Parsea meta og:description — ej. "1,234 Followers, 567 Following, 89 Posts" */
function parseMetaDescription(html: string): Partial<InstagramMetrics> {
  const match = html.match(/property="og:description"\s+content="([^"]+)"/i);
  if (!match?.[1]) return {};

  const text = match[1];
  const followers = text.match(/([\d,.]+)\s+Followers/i);
  const following = text.match(/([\d,.]+)\s+Following/i);
  const posts = text.match(/([\d,.]+)\s+Posts/i);

  const num = (m: RegExpMatchArray | null) =>
    m ? Number.parseInt(m[1].replace(/,/g, ""), 10) : null;

  return {
    found: true,
    followers: num(followers),
    following: num(following),
    posts: num(posts),
  };
}

async function fetchBusinessDiscovery(username: string): Promise<InstagramMetrics | null> {
  try {
    const profile = await discoverBusiness(username);
    if (!profile) return null;
    const stats = summarizeMedia({
      timestamps: profile.media.map((item) => item.timestamp),
      likes: profile.media.map((item) => item.likeCount),
      comments: profile.media.map((item) => item.commentsCount),
      hasVideo: profile.media.some((item) => item.mediaType === "VIDEO"),
    });
    return {
      username: profile.username,
      found: true,
      isPrivate: false,
      isBusiness: true,
      followers: profile.followers,
      following: null,
      posts: profile.posts,
      biography: profile.biography,
      externalUrl: profile.website,
      profilePicUrl: profile.profilePictureUrl,
      ...stats,
      source: "graph",
      fetchedAt: new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

async function fetchWebProfileInfo(username: string): Promise<InstagramMetrics | null> {
  const url = `https://www.instagram.com/api/v1/users/web_profile_info/?username=${encodeURIComponent(username)}`;
  const res = await withTimeout(
    fetch(url, {
      headers: {
        Accept: "*/*",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "X-IG-App-ID": IG_APP_ID,
        "X-Requested-With": "XMLHttpRequest",
      },
      cache: "no-store",
    }),
    TIMEOUT_MS,
  );

  if (!res.ok) return null;

  const json = (await res.json()) as IgApiResponse;
  const user = json.data?.user;
  if (!user?.username) return null;

  return mapUser(username, user);
}

async function fetchHtmlFallback(username: string): Promise<InstagramMetrics | null> {
  const url = `https://www.instagram.com/${encodeURIComponent(username)}/`;
  const res = await withTimeout(
    fetch(url, {
      headers: {
        Accept: "text/html",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      },
      cache: "no-store",
    }),
    TIMEOUT_MS,
  );

  if (!res.ok) return null;

  const html = await res.text();
  if (html.includes("Page Not Found") || html.includes("Sorry, this page isn't available")) {
    return null;
  }

  const fromMeta = parseMetaDescription(html);
  if (!fromMeta.found) return null;

  const bioMatch = html.match(/property="og:title"\s+content="([^"]+)"/i);
  return {
    ...emptyMetrics(username, fromMeta),
    biography: bioMatch?.[1]?.split("(@")[0]?.trim() ?? null,
    source: "html",
  };
}

/**
 * Obtiene métricas de un perfil de Instagram.
 * Intenta Graph Business Discovery (si hay Facebook Login),
 * luego la API web pública, y por último meta tags HTML.
 */
export async function analyzeInstagram(
  handle: string | null | undefined,
): Promise<{ metrics: InstagramMetrics; raw: unknown }> {
  const username = normalizeInstagramUsername(handle ?? "");
  if (!username) {
    return {
      metrics: emptyMetrics("", { error: "Sin handle de Instagram" }),
      raw: null,
    };
  }

  try {
    const fromGraph = await fetchBusinessDiscovery(username);
    if (fromGraph) {
      return { metrics: fromGraph, raw: fromGraph };
    }

    const fromApi = await fetchWebProfileInfo(username);
    if (fromApi) {
      return { metrics: fromApi, raw: fromApi };
    }

    const fromHtml = await fetchHtmlFallback(username);
    if (fromHtml) {
      return { metrics: fromHtml, raw: fromHtml };
    }

    return {
      metrics: emptyMetrics(username, {
        error: "Perfil no encontrado o no accesible públicamente",
      }),
      raw: null,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error al consultar Instagram";
    return {
      metrics: emptyMetrics(username, { error: message }),
      raw: null,
    };
  }
}

export function daysSinceIso(iso: string | null | undefined): number | null {
  if (!iso) return null;
  const then = Date.parse(iso);
  if (!Number.isFinite(then)) return null;
  return Math.max(0, Math.floor((Date.now() - then) / 86_400_000));
}

export function formatInstagramEvidence(m: InstagramMetrics): string {
  if (!m.found) return m.error ?? "Perfil no analizado";
  const days = daysSinceIso(m.lastPostAt);
  const parts = [
    `@${m.username}`,
    m.followers != null ? `${m.followers.toLocaleString("es")} seguidores` : null,
    m.posts != null ? `${m.posts} publicaciones` : null,
    days != null ? `último post hace ${days} días` : null,
    m.isPrivate ? "cuenta privada" : null,
    m.isBusiness ? "cuenta comercial" : null,
    m.externalUrl ? "link en bio" : "sin link en bio",
  ].filter(Boolean);
  return parts.join(" · ");
}
