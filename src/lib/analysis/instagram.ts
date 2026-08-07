import type { InstagramMetrics } from "./types";

const TIMEOUT_MS = 20_000;
const IG_APP_ID = "936619743392459";

type IgApiUser = {
  username?: string;
  biography?: string;
  external_url?: string | null;
  is_private?: boolean;
  is_business_account?: boolean;
  edge_followed_by?: { count?: number };
  edge_follow?: { count?: number };
  edge_owner_to_timeline_media?: { count?: number };
  profile_pic_url_hd?: string;
};

type IgApiResponse = {
  data?: { user?: IgApiUser };
  status?: string;
};

function normalizeUsername(handle: string): string {
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

function mapUser(username: string, user: IgApiUser): InstagramMetrics {
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
    fetchedAt: new Date().toISOString(),
  };
}

/** Parsea meta og:description — ej. "1,234 Followers, 567 Following, 89 Posts" */
function parseMetaDescription(html: string): Partial<InstagramMetrics> {
  const match = html.match(
    /property="og:description"\s+content="([^"]+)"/i,
  );
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
  };
}

/**
 * Obtiene métricas públicas de un perfil de Instagram.
 * Intenta API web de Instagram; si falla, parsea meta tags del HTML público.
 */
export async function analyzeInstagram(
  handle: string | null | undefined,
): Promise<{ metrics: InstagramMetrics; raw: IgApiResponse | null }> {
  const username = normalizeUsername(handle ?? "");
  if (!username) {
    return {
      metrics: emptyMetrics("", { error: "Sin handle de Instagram" }),
      raw: null,
    };
  }

  try {
    const fromApi = await fetchWebProfileInfo(username);
    if (fromApi) {
      return { metrics: fromApi, raw: null };
    }

    const fromHtml = await fetchHtmlFallback(username);
    if (fromHtml) {
      return { metrics: fromHtml, raw: null };
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

export function formatInstagramEvidence(m: InstagramMetrics): string {
  if (!m.found) return m.error ?? "Perfil no analizado";
  const parts = [
    `@${m.username}`,
    m.followers != null ? `${m.followers.toLocaleString("es")} seguidores` : null,
    m.posts != null ? `${m.posts} publicaciones` : null,
    m.isPrivate ? "cuenta privada" : null,
    m.isBusiness ? "cuenta comercial" : null,
    m.externalUrl ? "link en bio" : "sin link en bio",
  ].filter(Boolean);
  return parts.join(" · ");
}
