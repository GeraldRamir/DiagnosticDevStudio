import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ToolBreadcrumb } from "@/components/tools/breadcrumb";

export function ToolHeader({
  title,
  description,
  backHref = "/tools",
  backLabel = "Volver a herramientas",
  crumbs,
}: {
  title: string;
  description: string;
  backHref?: string;
  backLabel?: string;
  crumbs: { href?: string; label: string }[];
}) {
  return (
    <header className="mb-8">
      <ToolBreadcrumb items={crumbs} />
      <Link
        href={backHref}
        className="mb-5 inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        {backLabel}
      </Link>
      <h1 className="max-w-3xl text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h1>
      <p className="mt-3 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground">
        {description}
      </p>
    </header>
  );
}
