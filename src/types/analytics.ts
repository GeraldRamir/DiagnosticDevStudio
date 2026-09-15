export type AnalyticsEventName =
  | "tool_opened"
  | "tool_completed"
  | "result_generated"
  | "whatsapp_link_created"
  | "qr_generated"
  | "menu_created"
  | "CTA_clicked";

export type AnalyticsPayload = Record<string, string | number | boolean | null | undefined>;
