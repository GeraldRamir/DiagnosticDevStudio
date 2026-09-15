import type { Metadata } from "next";
import { absoluteUrl, SITE_NAME } from "@/lib/site";
import type { ToolDefinition } from "@/types/tools";

export function pageMetadata(input: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const url = absoluteUrl(input.path);
  return {
    title: { absolute: input.title },
    description: input.description,
    alternates: { canonical: url },
    openGraph: {
      title: input.title,
      description: input.description,
      url,
      siteName: SITE_NAME,
      locale: "es_DO",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
    },
  };
}

export function toolMetadata(tool: ToolDefinition): Metadata {
  return pageMetadata({
    title: tool.seoTitle,
    description: tool.seoDescription,
    path: tool.href,
  });
}
