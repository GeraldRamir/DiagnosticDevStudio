import {
  buildReply,
  classifyIntent,
  isMagnetComment,
  magnetPrivateReply,
  magnetPublicReply,
} from "@/lib/instagram/conversation";

const GRAPH_VERSION = "v21.0";

export type InstagramMediaType = "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";

export type StudioFeedItem = {
  id: string;
  permalink: string;
  caption: string;
  mediaType: InstagramMediaType;
  imageUrl: string;
  timestamp: string;
};

export type StudioFeed = {
  username: string;
  profileUrl: string;
  followers: number | null;
  profilePictureUrl: string | null;
  items: StudioFeedItem[];
};

export type DiscoveredMedia = {
  timestamp: string | null;
  likeCount: number | null;
  commentsCount: number | null;
  mediaType: string | null;
};

export type DiscoveredProfile = {
  username: string;
  followers: number | null;
  posts: number | null;
  biography: string | null;
  website: string | null;
  name: string | null;
  profilePictureUrl: string | null;
  media: DiscoveredMedia[];
};

function token() {
  return (process.env.INSTAGRAM_ACCESS_TOKEN ?? "").trim();
}

function graphHost() {
  return (process.env.INSTAGRAM_GRAPH_HOST ?? "https://graph.instagram.com").replace(/\/$/, "");
}

function igUserId() {
  return (process.env.INSTAGRAM_USER_ID ?? "").trim();
}

export function instagramConfigured() {
  return Boolean(token());
}

async function igGet<T>(path: string, fields?: string, extra?: Record<string, string>, accessToken?: string): Promise<T> {
  const access = (accessToken ?? token()).trim();
  if (!access) throw new Error("INSTAGRAM_ACCESS_TOKEN no configurado");

  const url = new URL(`${graphHost()}/${GRAPH_VERSION}${path}`);
  if (fields) url.searchParams.set("fields", fields);
  if (extra) {
    for (const [key, value] of Object.entries(extra)) url.searchParams.set(key, value);
  }
  url.searchParams.set("access_token", access);

  const res = await fetch(url, { cache: "no-store" });
  const json = (await res.json()) as T & { error?: { message?: string } };
  if (!res.ok || json.error) {
    throw new Error(json.error?.message || `Instagram ${res.status}`);
  }
  return json;
}

async function igPost<T>(path: string, body: Record<string, unknown>, accessToken?: string): Promise<T> {
  const access = (accessToken ?? token()).trim();
  if (!access) throw new Error("INSTAGRAM_ACCESS_TOKEN no configurado");

  const url = new URL(`${graphHost()}/${GRAPH_VERSION}${path}`);
  url.searchParams.set("access_token", access);

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = (await res.json()) as T & { error?: { message?: string } };
  if (!res.ok || json.error) {
    throw new Error(json.error?.message || `Instagram ${res.status}`);
  }
  return json;
}

function captionOf(value: unknown) {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";
}

function imageOf(media: {
  media_type?: string;
  media_url?: string;
  thumbnail_url?: string;
}) {
  if (media.media_type === "VIDEO") return media.thumbnail_url || media.media_url || "";
  return media.media_url || media.thumbnail_url || "";
}

export async function getStudioFeed(): Promise<StudioFeed> {
  type Me = {
    username?: string;
    followers_count?: number;
    profile_picture_url?: string;
  };
  type Media = {
    data?: Array<{
      id: string;
      permalink?: string;
      caption?: string;
      media_type?: InstagramMediaType;
      media_url?: string;
      thumbnail_url?: string;
      timestamp?: string;
    }>;
  };

  const me = await igGet<Me>("/me", "username,followers_count,profile_picture_url");
  const media = await igGet<Media>(
    "/me/media",
    "id,caption,media_type,media_url,permalink,thumbnail_url,timestamp",
  );

  const username = me.username || "dev_studioo";
  return {
    username,
    profileUrl: `https://www.instagram.com/${username}/`,
    followers: me.followers_count ?? null,
    profilePictureUrl: me.profile_picture_url ?? null,
    items: (media.data ?? [])
      .map((item) => ({
        id: item.id,
        permalink: item.permalink || `https://www.instagram.com/${username}/`,
        caption: captionOf(item.caption),
        mediaType: item.media_type || "IMAGE",
        imageUrl: imageOf(item),
        timestamp: item.timestamp || "",
      }))
      .filter((item) => item.imageUrl)
      .slice(0, 8),
  };
}

/** Solo funciona con Facebook Login + Business Discovery. Instagram Login lo ignora. */
export async function discoverBusiness(username: string): Promise<DiscoveredProfile | null> {
  const host = graphHost();
  const selfId = igUserId();
  if (!selfId || !host.includes("graph.facebook.com")) return null;

  type Discovery = {
    business_discovery?: {
      username?: string;
      followers_count?: number;
      media_count?: number;
      biography?: string;
      website?: string;
      name?: string;
      profile_picture_url?: string;
      media?: {
        data?: Array<{
          timestamp?: string;
          like_count?: number;
          comments_count?: number;
          media_type?: string;
        }>;
      };
    };
  };

  const json = await igGet<Discovery>(
    `/${selfId}`,
    `business_discovery.username(${username}){username,followers_count,media_count,biography,website,name,profile_picture_url,media.limit(12){timestamp,like_count,comments_count,media_type}}`,
  );

  const profile = json.business_discovery;
  if (!profile?.username) return null;

  return {
    username: profile.username,
    followers: profile.followers_count ?? null,
    posts: profile.media_count ?? null,
    biography: profile.biography ?? null,
    website: profile.website ?? null,
    name: profile.name ?? null,
    profilePictureUrl: profile.profile_picture_url ?? null,
    media: (profile.media?.data ?? []).map((item) => ({
      timestamp: item.timestamp ?? null,
      likeCount: item.like_count ?? null,
      commentsCount: item.comments_count ?? null,
      mediaType: item.media_type ?? null,
    })),
  };
}

export function verifyWebhookChallenge(mode: string | null, tokenValue: string | null, challenge: string | null) {
  const expected = (process.env.INSTAGRAM_VERIFY_TOKEN ?? "").trim();
  if (mode === "subscribe" && challenge && expected && tokenValue === expected) {
    return challenge;
  }
  return null;
}

function timingSafeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

export async function verifyWebhookSignature(rawBody: string, signatureHeader: string | null) {
  const secret = (process.env.INSTAGRAM_APP_SECRET ?? "").trim();
  if (!secret || !signatureHeader) return !secret;
  const { createHmac } = await import("node:crypto");
  const offered = signatureHeader.replace(/^sha256=/, "");
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  return timingSafeEqual(offered, expected);
}

function urls() {
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/$/, "");
  const site = (process.env.INSTAGRAM_SITE_URL ?? "https://devstuddio.netlify.app").replace(/\/$/, "");
  return {
    diagnostic: `${appUrl}/diagnostico`,
    quote: `${site}/cotizar`,
    site,
  };
}

async function sendDm(
  recipient: { id?: string; comment_id?: string },
  text: string,
  quickReplies?: Array<{ content_type: "text"; title: string; payload: string }>,
) {
  const message: Record<string, unknown> = { text };
  if (quickReplies?.length && recipient.id) message.quick_replies = quickReplies;
  await igPost("/me/messages", { recipient, message });
}

export async function publishInstagramMedia(input: {
  imageUrl: string;
  caption: string;
  mediaType?: "IMAGE" | "REELS";
  videoUrl?: string;
}) {
  const caption = captionOf(input.caption);
  const containerBody: Record<string, unknown> = { caption };
  if (input.mediaType === "REELS" && input.videoUrl) {
    containerBody.media_type = "REELS";
    containerBody.video_url = input.videoUrl;
  } else {
    containerBody.image_url = input.imageUrl;
  }
  const container = await igPost<{ id: string }>("/me/media", containerBody);
  for (let i = 0; i < 15; i++) {
    const status = await igGet<{ status_code?: string }>(`/${container.id}`, "status_code");
    if (status.status_code === "FINISHED" || status.status_code === "PUBLISHED") break;
    if (status.status_code === "ERROR" || status.status_code === "EXPIRED") {
      throw new Error(`Contenedor Instagram: ${status.status_code}`);
    }
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  const published = await igPost<{ id: string }>("/me/media_publish", { creation_id: container.id });
  return { id: published.id, containerId: container.id };
}

function metricValue(item: { values?: Array<{ value?: number }>; total_value?: { value?: number } }) {
  if (typeof item.total_value?.value === "number") return item.total_value.value;
  const last = item.values?.[item.values.length - 1];
  return typeof last?.value === "number" ? last.value : null;
}

export async function getStudioInsights() {
  const me = await igGet<{
    username?: string;
    followers_count?: number;
    media_count?: number;
    profile_picture_url?: string;
  }>("/me", "id,username,followers_count,media_count,profile_picture_url");

  let account: Array<{ name: string; value: number | null }> = [];
  try {
    const insights = await igGet<{
      data?: Array<{ name?: string; values?: Array<{ value?: number }>; total_value?: { value?: number } }>;
    }>("/me/insights", undefined, {
      metric: "reach,views,profile_views,website_clicks,accounts_engaged,total_interactions",
      period: "day",
    });
    account = (insights.data ?? []).map((item) => ({
      name: item.name || "metric",
      value: metricValue(item),
    }));
  } catch {
    account = [];
  }

  const media = await igGet<{
    data?: Array<{
      id: string;
      caption?: string;
      media_type?: InstagramMediaType;
      permalink?: string;
      timestamp?: string;
      like_count?: number;
      comments_count?: number;
      thumbnail_url?: string;
      media_url?: string;
    }>;
  }>(
    "/me/media",
    "id,caption,media_type,permalink,timestamp,like_count,comments_count,thumbnail_url,media_url",
  );

  const posts = [];
  for (const item of (media.data ?? []).slice(0, 8)) {
    let insights: Array<{ name: string; value: number | null }> = [];
    try {
      const data = await igGet<{
        data?: Array<{ name?: string; values?: Array<{ value?: number }>; total_value?: { value?: number } }>;
      }>(`/${item.id}/insights`, undefined, {
        metric: "reach,views,likes,comments,shares,saved,total_interactions",
      });
      insights = (data.data ?? []).map((row) => ({
        name: row.name || "metric",
        value: metricValue(row),
      }));
    } catch {
      insights = [];
    }
    posts.push({
      id: item.id,
      caption: captionOf(item.caption),
      mediaType: item.media_type || "IMAGE",
      permalink: item.permalink || "",
      timestamp: item.timestamp || "",
      likeCount: item.like_count ?? null,
      commentsCount: item.comments_count ?? null,
      imageUrl: imageOf(item),
      insights,
    });
  }

  return {
    username: me.username || "dev_studioo",
    followers: me.followers_count ?? null,
    mediaCount: me.media_count ?? null,
    profilePictureUrl: me.profile_picture_url ?? null,
    account,
    posts,
  };
}

export async function fetchLeadAccount(accessToken: string) {
  const me = await igGet<{
    username?: string;
    name?: string;
    account_type?: string;
    biography?: string;
    website?: string;
    followers_count?: number;
    follows_count?: number;
    media_count?: number;
    profile_picture_url?: string;
  }>(
    "/me",
    "username,name,account_type,biography,website,followers_count,follows_count,media_count,profile_picture_url",
    undefined,
    accessToken,
  );

  const media = await igGet<{
    data?: Array<{
      timestamp?: string;
      like_count?: number;
      comments_count?: number;
      media_type?: string;
    }>;
  }>("/me/media", "timestamp,like_count,comments_count,media_type", undefined, accessToken);

  let reach7d: number | null = null;
  let impressions7d: number | null = null;
  let profileViews7d: number | null = null;
  try {
    const insights = await igGet<{
      data?: Array<{ name?: string; values?: Array<{ value?: number }>; total_value?: { value?: number } }>;
    }>("/me/insights", undefined, { metric: "reach,views,profile_views", period: "day" }, accessToken);
    for (const row of insights.data ?? []) {
      const value = metricValue(row);
      if (row.name === "reach") reach7d = value;
      if (row.name === "views" || row.name === "impressions") impressions7d = value;
      if (row.name === "profile_views") profileViews7d = value;
    }
  } catch {
    /* insights permission may be missing */
  }

  return {
    username: me.username || "",
    name: me.name ?? null,
    accountType: me.account_type ?? null,
    biography: me.biography ?? null,
    website: me.website ?? null,
    followers: me.followers_count ?? null,
    following: me.follows_count ?? null,
    posts: me.media_count ?? null,
    profilePictureUrl: me.profile_picture_url ?? null,
    media: media.data ?? [],
    reach7d,
    impressions7d,
    profileViews7d,
  };
}

export async function handleInstagramWebhook(payload: {
  object?: string;
  entry?: Array<{
    id?: string;
    messaging?: Array<{
      sender?: { id?: string };
      message?: {
        text?: string;
        is_echo?: boolean;
        quick_reply?: { payload?: string };
      };
      postback?: { payload?: string; title?: string };
    }>;
    changes?: Array<{
      field?: string;
      value?: { id?: string; text?: string; from?: { id?: string } };
    }>;
  }>;
}) {
  if (payload.object !== "instagram") return { handled: 0, comments: 0 };

  const links = urls();
  let handled = 0;
  let comments = 0;

  for (const entry of payload.entry ?? []) {
    for (const event of entry.messaging ?? []) {
      const senderId = event.sender?.id;
      if (!senderId || event.message?.is_echo) continue;
      const text = event.message?.text || event.postback?.title || "";
      const payloadKey = event.message?.quick_reply?.payload || event.postback?.payload;
      if (!text && !payloadKey) continue;
      const reply = buildReply(classifyIntent(text, payloadKey), links);
      try {
        await sendDm({ id: senderId }, reply.text, reply.quickReplies);
        handled += 1;
      } catch (error) {
        console.warn("[instagram] DM reply failed", error);
      }
    }

    for (const change of entry.changes ?? []) {
      if (change.field !== "comments") continue;
      const commentId = change.value?.id;
      const text = change.value?.text || "";
      if (!commentId || change.value?.from?.id === entry.id) continue;
      if (!isMagnetComment(text)) continue;
      try {
        await sendDm({ comment_id: commentId }, magnetPrivateReply(links.diagnostic));
        comments += 1;
      } catch (error) {
        console.warn("[instagram] private reply failed", error);
      }
      try {
        await igPost(`/${commentId}/replies`, { message: magnetPublicReply() });
      } catch (error) {
        console.warn("[instagram] public comment reply failed", error);
      }
    }
  }

  return { handled, comments };
}
