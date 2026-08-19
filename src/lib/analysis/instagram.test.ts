import { describe, expect, it } from "vitest";
import { summarizeMedia, daysSinceIso, formatInstagramEvidence } from "./instagram";
import type { InstagramMetrics } from "./types";

describe("summarizeMedia", () => {
  it("calcula recencia, promedio de likes y reels", () => {
    const now = Date.now() / 1000;
    const stats = summarizeMedia({
      timestamps: [now - 2.5 * 86400, now - 10 * 86400, now - 40 * 86400],
      likes: [40, 20, 12],
      comments: [4, 2, 0],
      hasVideo: true,
    });

    expect(stats.postsLast30Days).toBe(2);
    expect(stats.avgLikes).toBe(24);
    expect(stats.avgComments).toBe(2);
    expect(stats.hasReels).toBe(true);
    expect(stats.recentSampleSize).toBe(3);
    expect(daysSinceIso(stats.lastPostAt)).toBe(2);
  });
});

describe("formatInstagramEvidence", () => {
  it("incluye último post cuando hay fecha", () => {
    const metrics: InstagramMetrics = {
      username: "negocio",
      found: true,
      isPrivate: false,
      isBusiness: true,
      followers: 180,
      following: 90,
      posts: 22,
      biography: "Tacos",
      externalUrl: "https://wa.me/1",
      profilePicUrl: null,
      lastPostAt: new Date(Date.now() - 3 * 86_400_000).toISOString(),
      postsLast30Days: 4,
      avgLikes: 12,
      avgComments: 1,
      hasReels: true,
      recentSampleSize: 12,
      source: "web_profile",
      fetchedAt: new Date().toISOString(),
    };

    const text = formatInstagramEvidence(metrics);
    expect(text).toContain("@negocio");
    expect(text).toContain("180");
    expect(text).toContain("último post hace 3 días");
    expect(text).toContain("link en bio");
  });
});
