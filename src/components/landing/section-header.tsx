import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#a855f7]">
        {eyebrow}
      </p>
      <h2 className="mt-3 font-display text-balance text-3xl font-extrabold tracking-tight text-[color:var(--landing-text)] sm:text-4xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-4 text-base leading-relaxed text-[color:var(--landing-muted)] sm:text-lg">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
