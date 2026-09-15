export function StepProgress({
  current,
  total,
  label,
}: {
  current: number;
  total: number;
  label?: string;
}) {
  const pct = Math.round((current / total) * 100);

  return (
    <div className="mb-6">
      <div className="mb-2 flex items-center justify-between gap-3 text-sm">
        <p className="font-medium text-foreground">
          {label ?? `Paso ${current} de ${total}`}
        </p>
        <p className="font-mono text-muted-foreground tabular-nums">{pct}%</p>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-primary transition-all duration-300 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
