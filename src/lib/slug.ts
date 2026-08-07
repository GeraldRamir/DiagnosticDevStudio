import { nanoid } from "nanoid";

export function slugifyBusinessName(name: string): string {
  const base = name
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);

  return base || "diagnostico";
}

export function buildReportSlug(businessName: string): string {
  return `${slugifyBusinessName(businessName)}-${nanoid(6)}`;
}
