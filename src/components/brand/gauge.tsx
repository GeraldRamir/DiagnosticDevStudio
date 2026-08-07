"use client";

import { useEffect, useId, useState } from "react";
import { cn } from "@/lib/utils";

type GaugeProps = {
  value: number;
  max?: number;
  size?: number;
  label?: string;
  sublabel?: string;
  animate?: boolean;
  className?: string;
};

function scoreColor(value: number, max: number): string {
  const pct = (value / max) * 100;
  if (pct >= 80) return "var(--good)";
  if (pct >= 40) return "var(--warn)";
  return "var(--flare)";
}

export function Gauge({
  value,
  max = 100,
  size = 200,
  label,
  sublabel,
  animate = true,
  className,
}: GaugeProps) {
  const uid = useId().replace(/:/g, "");
  const [display, setDisplay] = useState(animate ? 0 : value);
  const [progress, setProgress] = useState(animate ? 0 : value / max);

  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (!animate || reducedMotion) {
      setDisplay(value);
      setProgress(value / max);
      return;
    }

    const duration = 1400;
    const start = performance.now();
    let frame: number;

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(value * eased));
      setProgress((value / max) * eased);
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, max, animate, reducedMotion]);

  const cx = size / 2;
  const cy = size / 2 + size * 0.06;
  const r = size * 0.38;
  const startAngle = 150;
  const sweep = 240;
  const endAngle = startAngle + sweep * progress;

  const polar = (deg: number) => {
    const rad = (deg * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad),
    };
  };

  const bgStart = polar(startAngle);
  const bgEnd = polar(startAngle + sweep);
  const valEnd = polar(endAngle);

  const bgPath = `M ${bgStart.x} ${bgStart.y} A ${r} ${r} 0 1 1 ${bgEnd.x} ${bgEnd.y}`;
  const valPath = `M ${bgStart.x} ${bgStart.y} A ${r} ${r} 0 ${progress > 0.5 ? 1 : 0} 1 ${valEnd.x} ${valEnd.y}`;

  const needleAngle = startAngle + sweep * progress;
  const needleLen = r * 0.72;
  const needleRad = (needleAngle * Math.PI) / 180;
  const nx = cx + needleLen * Math.cos(needleRad);
  const ny = cy + needleLen * Math.sin(needleRad);

  const color = scoreColor(value, max);

  return (
    <div
      className={cn("relative inline-flex flex-col items-center", className)}
      style={{ width: size, height: size * 0.88 }}
    >
      <svg
        width={size}
        height={size * 0.82}
        viewBox={`0 0 ${size} ${size * 0.82}`}
        aria-hidden
      >
        <defs>
          <linearGradient id={`gauge-grad-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} stopOpacity={0.85} />
            <stop offset="100%" stopColor={color} />
          </linearGradient>
        </defs>
        <path
          d={bgPath}
          fill="none"
          stroke="rgba(15,23,42,0.08)"
          strokeWidth={size * 0.045}
          strokeLinecap="round"
        />
        <path
          d={valPath}
          fill="none"
          stroke={`url(#gauge-grad-${uid})`}
          strokeWidth={size * 0.045}
          strokeLinecap="round"
        />
        <circle cx={cx} cy={cy} r={size * 0.04} fill={color} />
        <line
          x1={cx}
          y1={cy}
          x2={nx}
          y2={ny}
          stroke={color}
          strokeWidth={size * 0.018}
          strokeLinecap="round"
        />
      </svg>
      <div
        className="absolute inset-0 flex flex-col items-center justify-center pt-2"
        style={{ top: size * 0.12 }}
      >
        <span
          className="ds-mono-num font-mono font-medium leading-none text-[color:var(--landing-text)]"
          style={{ fontSize: size * 0.22 }}
        >
          {display}
        </span>
        <span
          className="ds-mono-num mt-1 font-mono text-[color:var(--landing-muted)]"
          style={{ fontSize: size * 0.08 }}
        >
          /{max}
        </span>
        {label ? (
          <span
            className="mt-2 text-center font-medium text-[color:var(--landing-muted)]"
            style={{ fontSize: size * 0.065 }}
          >
            {label}
          </span>
        ) : null}
        {sublabel ? (
          <span
            className="mt-0.5 text-center text-[color:var(--landing-muted)]"
            style={{ fontSize: size * 0.055 }}
          >
            {sublabel}
          </span>
        ) : null}
      </div>
    </div>
  );
}
