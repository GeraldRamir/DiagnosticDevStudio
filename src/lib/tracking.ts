import type { AnalyticsEventName, AnalyticsPayload } from "@/types/analytics";

/**
 * Capa de analytics desacoplada.
 * Hoy solo registra en consola en desarrollo.
 * Más adelante se puede conectar Google Analytics, PostHog u otro proveedor
 * reemplazando el cuerpo de esta función sin tocar las herramientas.
 */
export function trackEvent(
  name: AnalyticsEventName,
  payload: AnalyticsPayload = {},
): void {
  if (process.env.NODE_ENV !== "development") {
    return;
  }

  console.log("[Dev Studio Tools]", name, payload);
}
