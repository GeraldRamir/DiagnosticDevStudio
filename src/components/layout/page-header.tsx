import type { ReactNode } from "react";

/**
 * Encabezado de sección informativa.
 * Sigue el registro de la home: titular grande en Inter regular sobre el lienzo lila.
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <section className="dst-container pt-10 pb-8 md:pt-14 md:pb-10">
      <p className="text-[0.7rem] tracking-[0.16em] text-muted-foreground uppercase">
        {eyebrow}
      </p>
      <h1 className="mt-4 max-w-[18ch] text-[2.5rem] leading-[1.08] font-normal tracking-[-0.02em] text-foreground sm:text-[3.25rem] lg:text-[3.75rem]">
        {title}
      </h1>
      <p className="mt-6 max-w-2xl text-[1.0625rem] leading-relaxed text-muted-foreground lg:text-[1.125rem]">
        {description}
      </p>
      {children ? <div className="mt-8">{children}</div> : null}
    </section>
  );
}
