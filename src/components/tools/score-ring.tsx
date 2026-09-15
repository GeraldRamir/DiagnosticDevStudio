export function ScoreRing({
  score,
  label,
  size = 168,
}: {
  score: number;
  label?: string;
  size?: number;
}) {
  const clamped = Math.max(0, Math.min(100, score));
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        className="text-primary"
        role="img"
        aria-label={`Puntaje ${clamped} de 100`}
      >
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-secondary"
        />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="origin-center -rotate-90 text-primary transition-[stroke-dashoffset] duration-200"
        />
        <text
          x="60"
          y="58"
          textAnchor="middle"
          className="fill-foreground font-mono text-[1.6rem] font-semibold"
        >
          {clamped}%
        </text>
        {label ? (
          <text
            x="60"
            y="78"
            textAnchor="middle"
            className="fill-muted-foreground text-[0.65rem]"
          >
            {label}
          </text>
        ) : null}
      </svg>
    </div>
  );
}
