import {
  Activity,
  Camera,
  MessageCircle,
  QrCode,
  UtensilsCrossed,
} from "lucide-react";
import type { ToolIconName } from "@/types/tools";

export const TOOL_ICONS: Record<ToolIconName, typeof Activity> = {
  activity: Activity,
  instagram: Camera,
  "message-circle": MessageCircle,
  "qr-code": QrCode,
  utensils: UtensilsCrossed,
};
