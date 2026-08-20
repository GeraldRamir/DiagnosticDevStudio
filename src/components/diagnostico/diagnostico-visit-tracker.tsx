"use client";

import { useEffect, useRef } from "react";

export function DiagnosticoVisitTracker() {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;

    const params = new URLSearchParams(window.location.search);
    fetch("/api/funnel/visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: params.get("utm_source"),
        campaign: params.get("utm_campaign"),
      }),
      keepalive: true,
    }).catch(() => {
      /* analytics must not block UX */
    });
  }, []);

  return null;
}
