import { describe, expect, it } from "vitest";
import { analyzeInstagramBio, buildInstagramDashboardSummary } from "./instagram-bio";
import type { InstagramMetrics } from "./types";

const base: InstagramMetrics = {
  username: "negocio",
  found: true,
  isPrivate: false,
  isBusiness: true,
  followers: 1200,
  following: 340,
  posts: 48,
  biography: "Restaurante familiar en Santo Domingo · pedidos y reservas por WhatsApp",
  externalUrl: "https://tunegocio.com",
  profilePicUrl: null,
  lastPostAt: new Date(Date.now() - 5 * 86_400_000).toISOString(),
  postsLast30Days: 4,
  avgLikes: 32,
  avgComments: 3,
  hasReels: true,
  recentSampleSize: 12,
  source: "web_profile",
  fetchedAt: new Date().toISOString(),
};

describe("analyzeInstagramBio", () => {
  it("marca falta de link como fail", () => {
    const insights = analyzeInstagramBio({ ...base, externalUrl: null });
    expect(insights.some((i) => i.id === "bio_link" && i.status === "fail")).toBe(true);
  });

  it("detecta sitio web en bio", () => {
    const summary = buildInstagramDashboardSummary(base);
    expect(summary?.hasWebsiteInBio).toBe(true);
    expect(summary?.bioLinkType).toBe("website");
  });

  it("muestra tarjeta parcial con solo @usuario cuando no hay métricas", () => {
    const summary = buildInstagramDashboardSummary(null, "@negocio");
    expect(summary?.username).toBe("negocio");
    expect(summary?.dataUnavailable).toBe(true);
    expect(summary?.followers).toBeNull();
  });
});
