import type { InstagramMetrics, TechnicalMetrics } from "@/lib/analysis/types";
import type { PagespeedResponse } from "@/lib/analysis/technical";

export type StoredAnalysisRaw = {
  pagespeed?: PagespeedResponse | null;
  technical?: TechnicalMetrics | null;
  instagram?: InstagramMetrics | null;
};

export function packAnalysisRaw(input: {
  technicalRaw: unknown;
  technical: TechnicalMetrics | null;
  instagramRaw: unknown;
  instagram: InstagramMetrics | null;
}): StoredAnalysisRaw {
  return {
    pagespeed: (input.technicalRaw as PagespeedResponse | null) ?? null,
    technical: input.technical,
    instagram: input.instagram,
  };
}

export function unpackAnalysisRaw(raw: unknown): {
  technical: TechnicalMetrics | null;
  instagram: InstagramMetrics | null;
} {
  if (!raw || typeof raw !== "object") {
    return { technical: null, instagram: null };
  }
  const stored = raw as StoredAnalysisRaw;
  if ("technical" in stored || "instagram" in stored) {
    return {
      technical: stored.technical ?? null,
      instagram: stored.instagram ?? null,
    };
  }
  return { technical: null, instagram: null };
}
