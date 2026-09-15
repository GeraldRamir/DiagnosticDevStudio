import type { MetadataRoute } from "next";
import { GUIDES } from "@/lib/content/guides";
import { absoluteUrl } from "@/lib/site";
import { TOOLS } from "@/lib/tools";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "/",
    "/tools",
    "/guias",
    "/glosario",
    "/como-funciona",
    "/ayuda",
    "/contacto",
    "/sobre",
    "/privacidad",
    "/terminos",
  ];

  return [
    ...staticRoutes.map((path) => ({
      url: absoluteUrl(path),
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: path === "/" ? 1 : 0.8,
    })),
    ...TOOLS.map((tool) => ({
      url: absoluteUrl(tool.href),
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
    ...GUIDES.map((guide) => ({
      url: absoluteUrl(`/guias/${guide.slug}`),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
