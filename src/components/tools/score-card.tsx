import { cn } from "@/lib/utils";

export function ScoreCard({
  label,
  score,
  max = 100,
}: {
  label: string;
  score: number;
  max?: number;
}) {
  const pct = Math.max(0, Math.min(100, (score / max) * 100));

  return (
    <div className="rounded-2xl border border-border bg-white p-4">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="font-mono text-sm tabular-nums text-foreground">
          {score}
          <span className="text-muted-foreground">/{max}</span>
        </p>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-secondary">
        <div
          className={cn("h-full rounded-full bg-primary transition-all duration-200")}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
