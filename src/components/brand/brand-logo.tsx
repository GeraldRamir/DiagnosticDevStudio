import Image from "next/image";
import { LOGO_SRC, LOGO_WHITE_SRC } from "@/lib/brand";
import { cn } from "@/lib/utils";

export function BrandLogo({
  variant = "default",
  className,
  priority = false,
}: {
  variant?: "default" | "white";
  className?: string;
  priority?: boolean;
}) {
  const src = variant === "white" ? LOGO_WHITE_SRC : LOGO_SRC;

  return (
    <Image
      src={src}
      alt="Dev Studio"
      width={819}
      height={1024}
      priority={priority}
      className={cn("h-auto w-auto object-contain", className)}
      sizes="(max-width: 768px) 120px, 160px"
    />
  );
}
