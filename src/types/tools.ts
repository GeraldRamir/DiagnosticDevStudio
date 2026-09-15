export type ToolCategory =
  | "marketing"
  | "ventas"
  | "comunicacion"
  | "digitalizacion"
  | "productividad";

export type ToolStatus = "available" | "coming-soon";

export type ToolId =
  | "diagnostico-digital"
  | "instagram-analyzer"
  | "whatsapp-generator"
  | "qr-generator"
  | "menu-digital";

export type ToolIconName =
  | "activity"
  | "instagram"
  | "message-circle"
  | "qr-code"
  | "utensils";

export type ToolDefinition = {
  id: ToolId;
  name: string;
  shortName: string;
  slug: string;
  href: string;
  description: string;
  cardDescription: string;
  icon: ToolIconName;
  category: ToolCategory;
  status: ToolStatus;
  accent: string;
  features: readonly string[];
  cta: string;
  seoTitle: string;
  seoDescription: string;
};

export type RecommendationCard = {
  id: string;
  title: string;
  description: string;
  toolId: ToolId;
};
