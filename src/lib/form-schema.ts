import { z } from "zod";
import type {
  HasWebsite,
  OrderChannel,
  RecordKeeping,
  TeamSize,
  WeeklyHours,
} from "@/lib/analysis/types";

export const orderChannelSchema = z.enum([
  "whatsapp",
  "llamada",
  "persona",
  "redes",
  "sistema",
  "correo",
]);

export const diagnosticFormSchema = z
  .object({
    businessName: z.string().min(2, "Ingresa el nombre del negocio"),
    industry: z.string().min(1, "Selecciona una industria"),
    country: z.string().min(1, "Selecciona un país"),
    teamSize: z.enum(["solo", "2_5", "6_15", "mas_15"]),
    weeklyHoursOnAdmin: z.enum(["menos_5", "5_10", "10_20", "mas_20"]),
    recordKeeping: z.enum(["papel", "excel", "software", "ninguno"]),
    hasWebsite: z.enum(["yes", "no", "social_only"]),
    websiteUrl: z.string().optional().nullable(),
    instagramHandle: z.string().optional().nullable(),
    orderChannel: z.array(orderChannelSchema).min(1, "Selecciona al menos un canal"),
    biggestTimeWaster: z.string().min(3, "Describe tu mayor pérdida de tiempo"),
    fullName: z.string().min(2, "Ingresa tu nombre"),
    email: z.string().email("Correo inválido"),
    whatsapp: z.string().min(8, "Ingresa un WhatsApp válido"),
    consent: z.boolean().refine((v) => v, "Debes aceptar para continuar"),
  })
  .superRefine((data, ctx) => {
    if (data.hasWebsite === "yes") {
      if (!data.websiteUrl?.trim()) {
        ctx.addIssue({
          code: "custom",
          message: "Ingresa la URL de tu sitio",
          path: ["websiteUrl"],
        });
      } else {
        try {
          new URL(data.websiteUrl);
        } catch {
          ctx.addIssue({
            code: "custom",
            message: "URL inválida",
            path: ["websiteUrl"],
          });
        }
      }
    }
  });

export type DiagnosticFormValues = z.infer<typeof diagnosticFormSchema>;

export const defaultFormValues: DiagnosticFormValues = {
  businessName: "",
  industry: "",
  country: "",
  teamSize: "solo",
  weeklyHoursOnAdmin: "5_10",
  recordKeeping: "excel",
  hasWebsite: "no",
  websiteUrl: "",
  instagramHandle: "",
  orderChannel: ["whatsapp"],
  biggestTimeWaster: "",
  fullName: "",
  email: "",
  whatsapp: "",
  consent: false,
};

export const FORM_STEPS = ["operacion", "presencia", "captacion", "datos"] as const;
export type FormStepId = (typeof FORM_STEPS)[number];

export const STEP_FIELDS: Record<FormStepId, (keyof DiagnosticFormValues)[]> = {
  operacion: [
    "businessName",
    "industry",
    "country",
    "teamSize",
    "weeklyHoursOnAdmin",
    "recordKeeping",
  ],
  presencia: ["hasWebsite", "websiteUrl", "instagramHandle"],
  captacion: ["orderChannel", "biggestTimeWaster"],
  datos: ["fullName", "email", "whatsapp", "consent"],
};

export const DRAFT_STORAGE_KEY = "ds-diagnostic-draft";

export type StoredDraft = {
  values: DiagnosticFormValues;
  step: number;
  savedAt: string;
  formId: string;
};

export function toDiagnosticInput(values: DiagnosticFormValues) {
  return {
    ...values,
    websiteUrl: values.websiteUrl?.trim() || null,
    instagramHandle: values.instagramHandle?.trim() || null,
    orderChannel: values.orderChannel as OrderChannel[],
    hasWebsite: values.hasWebsite as HasWebsite,
    recordKeeping: values.recordKeeping as RecordKeeping,
    weeklyHoursOnAdmin: values.weeklyHoursOnAdmin as WeeklyHours,
    teamSize: values.teamSize as TeamSize,
  };
}
