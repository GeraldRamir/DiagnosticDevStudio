"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/tracking";
import type { AnalyticsEventName } from "@/types/analytics";

export function TrackOnMount({
  name,
  toolId,
}: {
  name: AnalyticsEventName;
  toolId?: string;
}) {
  useEffect(() => {
    trackEvent(name, toolId ? { toolId } : {});
  }, [name, toolId]);

  return null;
}
