"use client";

import { useEffect, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { animate, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { RP, RP_SCALE, RP_SEVERITY, RP_STATUS, type RpStatus } from "@/lib/report-theme";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Duraciones y retardos que se anulan si el usuario pide menos movimiento */
function useMotionPrefs() {
  const reduce = useReducedMotion() ?? false;
  return {
    reduce,
    tr: (duration: number, delay = 0) =>
      reduce ? { duration: 0, delay: 0 } : { duration, delay, ease: EASE },
  };
}

/* ─────────────────────────── Contenedores ─────────────────────────── */

export function Card({
  children,
  className,
  padded = true,
  tone = "light",
  delay = 0,
  hover = true,
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
  tone?: "light" | "dark" | "accent" | "muted";
  delay?: number;
  hover?: boolean;
}) {
  const { reduce, tr } = useMotionPrefs();

  return (
    <motion.section
      initial={reduce ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={tr(0.55, delay)}
      whileHover={reduce || !hover ? undefined : { y: -4 }}
      className={cn(
        "rp-card-shadow relative overflow-hidden rounded-[1.375rem]",
        hover && "rp-card-hover",
        tone === "dark" && "bg-[#101010] text-white",
        tone === "accent" && "bg-[#ee5b45] text-white",
        tone === "muted" && "bg-[#f5f5f5] text-[#131313]",
        tone === "light" && "border border-[#efefef] bg-white text-[#131313]",
        padded && "p-4 sm:p-5",
        className,
      )}
    >
      {children}
    </motion.section>
  );
}

export function CardHead({
  title,
  subtitle,
  icon,
  right,
  className,
}: {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  right?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-start justify-between gap-3", className)}>
      <div className="flex min-w-0 items-center gap-2.5">
        {icon ? (
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#f4f4f4] text-[#5c5c5c] transition-colors group-hover:bg-[#fdeeeb]">
            {icon}
          </span>
        ) : null}
        <div className="min-w-0">
          <p className="truncate text-[0.9375rem] font-semibold tracking-tight">{title}</p>
          {subtitle ? <p className="truncate text-xs text-[#9a9a9a]">{subtitle}</p> : null}
        </div>
      </div>
      {right ? <div className="shrink-0">{right}</div> : null}
    </div>
  );
}

export function ViewHeader({
  eyebrow,
  title,
  description,
  right,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  right?: ReactNode;
}) {
  const { reduce, tr } = useMotionPrefs();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={tr(0.5)}
      className="flex flex-wrap items-end justify-between gap-4 px-1 pb-1"
    >
      <div className="max-w-3xl">
        {eyebrow ? (
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-[#a3a3a3]">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="mt-1 text-[1.75rem] font-bold leading-tight tracking-tight text-[#131313] sm:text-[2rem]">
          {title}
        </h2>
        {description ? (
          <p className="mt-2 text-sm leading-relaxed text-[#8a8a8a]">{description}</p>
        ) : null}
      </div>
      {right ? <div className="shrink-0">{right}</div> : null}
    </motion.div>
  );
}

/* ─────────────────────────── Controles ─────────────────────────── */

const CIRCLE_SIZES = {
  sm: "size-9",
  md: "size-11",
  lg: "size-14",
} as const;

export function CircleButton({
  children,
  label,
  onClick,
  variant = "light",
  size = "md",
  dot,
  className,
}: {
  children: ReactNode;
  label: string;
  onClick?: () => void;
  variant?: "light" | "dark" | "accent" | "ghost";
  size?: keyof typeof CIRCLE_SIZES;
  dot?: boolean;
  className?: string;
}) {
  const { reduce } = useMotionPrefs();

  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      whileHover={reduce ? undefined : { scale: 1.1 }}
      whileTap={reduce ? undefined : { scale: 0.93 }}
      transition={{ type: "spring", stiffness: 420, damping: 24 }}
      className={cn(
        "group relative flex shrink-0 items-center justify-center overflow-hidden rounded-full transition-colors",
        CIRCLE_SIZES[size],
        variant === "light" &&
          "border border-[#ececec] bg-white text-[#4a4a4a] hover:border-[#f6c3ba] hover:text-[#ee5b45]",
        variant === "ghost" && "bg-[#eeeeee] text-[#4a4a4a] hover:bg-[#fdeeeb] hover:text-[#ee5b45]",
        variant === "dark" && "bg-[#101010] text-white hover:bg-[#2a2a2a]",
        variant === "accent" && "bg-[#ee5b45] text-white hover:bg-[#d9452f]",
        className,
      )}
    >
      <span className="rp-shine" aria-hidden />
      {children}
      {dot ? (
        <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-[#ee5b45] ring-2 ring-white">
          {!reduce ? (
            <motion.span
              className="absolute inset-0 rounded-full bg-[#ee5b45]"
              animate={{ scale: [1, 2.1, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            />
          ) : null}
        </span>
      ) : null}
    </motion.button>
  );
}

export function PillButton({
  children,
  onClick,
  href,
  variant = "accent",
  icon,
  className,
}: {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: "accent" | "dark" | "light" | "ghost";
  icon?: ReactNode;
  className?: string;
}) {
  const { reduce } = useMotionPrefs();

  const cls = cn(
    "group relative inline-flex h-10 items-center justify-center gap-2 overflow-hidden rounded-full px-5 text-sm font-semibold transition-colors",
    variant === "accent" && "bg-[#ee5b45] text-white hover:bg-[#d9452f]",
    variant === "dark" && "bg-[#101010] text-white hover:bg-[#2a2a2a]",
    variant === "light" &&
      "border border-[#ececec] bg-white text-[#131313] hover:border-[#f6c3ba] hover:text-[#d9452f]",
    variant === "ghost" && "bg-[#f1f1f1] text-[#4a4a4a] hover:bg-[#e8e8e8]",
    className,
  );

  const inner = (
    <>
      <span className="rp-shine" aria-hidden />
      {children}
      {icon ? (
        <span className="transition-transform duration-300 group-hover:translate-x-0.5">
          {icon}
        </span>
      ) : null}
    </>
  );

  const motionProps = {
    whileHover: reduce ? undefined : { y: -2 },
    whileTap: reduce ? undefined : { scale: 0.97 },
    transition: { type: "spring" as const, stiffness: 400, damping: 26 },
  };

  if (href) {
    return (
      <motion.a href={href} className={cls} {...motionProps}>
        {inner}
      </motion.a>
    );
  }

  return (
    <motion.button type="button" onClick={onClick} className={cls} {...motionProps}>
      {inner}
    </motion.button>
  );
}

export function StaticPill({ label, className }: { label: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-[#ececec] bg-white px-3 py-1.5 text-xs font-medium text-[#5c5c5c] transition-colors group-hover:border-[#f6c3ba]",
        className,
      )}
    >
      {label}
      <ChevronDown className="size-3 text-[#b5b5b5]" />
    </span>
  );
}

export function SelectPill<T extends string>({
  value,
  onChange,
  options,
  label,
  className,
}: {
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string }[];
  label: string;
  className?: string;
}) {
  return (
    <span className={cn("relative inline-flex items-center", className)}>
      <select
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="h-9 cursor-pointer appearance-none rounded-full border border-[#ececec] bg-white pl-3.5 pr-8 text-xs font-medium text-[#4a4a4a] outline-none transition-all hover:-translate-y-0.5 hover:border-[#f6c3ba] hover:text-[#d9452f] focus:border-[#ee5b45]"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 size-3 text-[#b5b5b5]" />
    </span>
  );
}

export function ToggleChip({
  children,
  active,
  onClick,
  dot,
  className,
}: {
  children: ReactNode;
  active?: boolean;
  onClick?: () => void;
  dot?: boolean;
  className?: string;
}) {
  const { reduce } = useMotionPrefs();

  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      whileHover={reduce ? undefined : { y: -2 }}
      whileTap={reduce ? undefined : { scale: 0.96 }}
      transition={{ type: "spring", stiffness: 420, damping: 24 }}
      className={cn(
        "inline-flex h-8 items-center gap-1.5 whitespace-nowrap rounded-full px-3 text-xs font-semibold transition-colors",
        active
          ? "bg-[#101010] text-white"
          : "border border-[#ececec] bg-white text-[#5c5c5c] hover:border-[#f6c3ba] hover:text-[#d9452f]",
        className,
      )}
    >
      {dot ? (
        <span className={cn("size-1.5 rounded-full", active ? "bg-[#ee5b45]" : "bg-[#d0d0d0]")} />
      ) : null}
      {children}
    </motion.button>
  );
}

export function Chip({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: "neutral" | "accent" | "dark" | "ok" | "warn" | "fail" | "outline";
  className?: string;
}) {
  const styles: Record<string, string> = {
    neutral: "bg-[#f3f3f3] text-[#5c5c5c]",
    accent: "bg-[#fdeeeb] text-[#d9452f]",
    dark: "bg-[#101010] text-white",
    ok: "bg-[#e9f6f0] text-[#177a53]",
    warn: "bg-[#fcf3e3] text-[#a8741a]",
    fail: "bg-[#fdeeeb] text-[#d9452f]",
    outline: "border border-[#ececec] bg-white text-[#5c5c5c]",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[0.6875rem] font-semibold",
        styles[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function StatusChip({ status, label }: { status: RpStatus; label?: string }) {
  const s = RP_STATUS[status];
  return <Chip tone={status}>{label ?? s.label}</Chip>;
}

export function SeverityChip({ severity }: { severity: "alta" | "media" | "baja" }) {
  const labels = { alta: "Alta", media: "Media", baja: "Baja" } as const;
  return <Chip tone={RP_SEVERITY[severity]}>{labels[severity]}</Chip>;
}

export function StatusDot({ status }: { status: RpStatus }) {
  return (
    <span
      className="inline-block size-2 shrink-0 rounded-full"
      style={{ backgroundColor: RP_STATUS[status].color }}
      aria-hidden
    />
  );
}

/* ─────────────────────────── Visualizaciones ─────────────────────────── */

export function GaugeRing({
  value,
  max = 100,
  size = 136,
  stroke = 11,
  caption,
  dark = true,
  delay = 0.25,
}: {
  value: number;
  max?: number;
  size?: number;
  stroke?: number;
  caption?: string;
  dark?: boolean;
  delay?: number;
}) {
  const { reduce, tr } = useMotionPrefs();
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const dash = (pct / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={dark ? "rgba(255,255,255,0.14)" : RP.line}
          strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={RP.accent}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={reduce ? false : { strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - dash }}
          transition={tr(1.5, delay)}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <motion.span
          initial={reduce ? false : { opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={tr(0.5, delay + 0.15)}
          className={cn(
            "text-[1.5rem] font-bold leading-none tracking-tight tabular-nums",
            dark ? "text-white" : "text-[#131313]",
          )}
        >
          <Counter value={Math.round(pct)} delay={delay} />%
        </motion.span>
        {caption ? (
          <span
            className={cn(
              "mt-1 max-w-[76px] text-[0.625rem] font-medium leading-tight",
              dark ? "text-white/55" : "text-[#9a9a9a]",
            )}
          >
            {caption}
          </span>
        ) : null}
      </div>
    </div>
  );
}

/** Número que cuenta desde cero al montarse */
export function Counter({
  value,
  delay = 0,
  duration = 1.3,
  decimals = 0,
}: {
  value: number;
  delay?: number;
  duration?: number;
  decimals?: number;
}) {
  const { reduce } = useMotionPrefs();
  const [display, setDisplay] = useState(reduce ? value : 0);

  useEffect(() => {
    if (reduce) {
      setDisplay(value);
      return;
    }
    const controls = animate(0, value, {
      duration,
      delay,
      ease: EASE,
      onUpdate: (v) => setDisplay(Number(v.toFixed(decimals))),
    });
    return () => controls.stop();
  }, [value, delay, duration, decimals, reduce]);

  return <span className="tabular-nums">{display.toFixed(decimals)}</span>;
}

type Point = { label: string; value: number };

/** Convierte una serie en un path SVG suavizado (Catmull-Rom → Bézier) */
function buildGeometry(values: number[], width: number, height: number, pad = 6) {
  if (values.length === 0) return { d: "", area: "", points: [] as { x: number; y: number }[] };

  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const stepX = values.length > 1 ? width / (values.length - 1) : width;

  const points = values.map((v, i) => ({
    x: i * stepX,
    y: pad + (1 - (v - min) / span) * (height - pad * 2),
  }));

  if (points.length === 1) {
    const d = `M 0 ${points[0].y} L ${width} ${points[0].y}`;
    return { d, area: `${d} L ${width} ${height} L 0 ${height} Z`, points };
  }

  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
  }

  return { d, area: `${d} L ${width} ${height} L 0 ${height} Z`, points };
}

export function Sparkline({
  points,
  height = 66,
  color = RP.accent,
  suffix = "%",
  delay = 0.2,
  className,
}: {
  points: Point[];
  height?: number;
  color?: string;
  suffix?: string;
  delay?: number;
  className?: string;
}) {
  const { reduce, tr } = useMotionPrefs();
  const width = 300;
  const values = points.map((p) => p.value);
  const geometry = buildGeometry(values, width, height);
  const gradientId = `rp-spark-${points.map((p) => p.label).join("").length}-${values.join("")}`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className={cn("w-full overflow-visible", className)}
      style={{ height }}
      role="img"
      aria-label={points.map((p) => `${p.label} ${p.value}${suffix}`).join(", ")}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>

      <motion.path
        d={geometry.area}
        fill={`url(#${gradientId})`}
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={tr(0.8, delay + 0.5)}
      />

      <motion.path
        d={geometry.d}
        fill="none"
        stroke={color}
        strokeWidth={2.4}
        strokeLinecap="round"
        initial={reduce ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={tr(1.5, delay)}
      />

      {geometry.points.map((p, i) => (
        <motion.g
          key={points[i].label}
          initial={reduce ? false : { opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={tr(0.35, delay + 0.6 + i * 0.08)}
          className="[transform-box:fill-box] [transform-origin:center]"
        >
          <circle cx={p.x} cy={p.y} r={3.4} fill="#ffffff" stroke={color} strokeWidth={2} />
          <circle cx={p.x} cy={p.y} r={11} fill="transparent" className="cursor-help">
            <title>{`${points[i].label}: ${points[i].value}${suffix}`}</title>
          </circle>
        </motion.g>
      ))}
    </svg>
  );
}

/** Un punto por señal, con el color de su estado */
export function SignalDots({
  items,
  columns = 10,
  delay = 0.2,
  className,
}: {
  items: { label: string; status: RpStatus }[];
  columns?: number;
  delay?: number;
  className?: string;
}) {
  const { reduce, tr } = useMotionPrefs();

  return (
    <div
      className={cn("grid gap-1.5", className)}
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {items.map((item, i) => (
        <motion.span
          key={`${item.label}-${i}`}
          title={`${item.label} · ${RP_STATUS[item.status].label}`}
          initial={reduce ? false : { opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={tr(0.32, delay + i * 0.035)}
          whileHover={reduce ? undefined : { scale: 1.55 }}
          className="aspect-square cursor-help rounded-full"
          style={{ backgroundColor: RP_STATUS[item.status].color }}
        />
      ))}
    </div>
  );
}

/** Círculos concéntricos apoyados en la misma base */
export function ConcentricRings({
  items,
  height = 236,
  delay = 0.2,
}: {
  items: { label: string; value: string }[];
  height?: number;
  delay?: number;
}) {
  const { reduce, tr } = useMotionPrefs();
  const count = items.length;

  return (
    <div className="relative w-full" style={{ height }}>
      {items.map((item, i) => {
        const scale = 1 - (i * 0.78) / Math.max(count, 1);
        const size = Math.round(height * scale);
        const opacity = 0.16 + (i / Math.max(count - 1, 1)) * 0.84;
        return (
          <motion.div
            key={item.label}
            title={`${item.label}: ${item.value}`}
            initial={reduce ? false : { scale: 0.3, opacity: 0 }}
            animate={{ scale: 1, opacity }}
            whileHover={reduce ? undefined : { scale: 1.04 }}
            transition={tr(0.75, delay + i * 0.14)}
            style={{
              width: size,
              height: size,
              backgroundColor: RP.accent,
              transformOrigin: "bottom center",
            }}
            className="absolute bottom-0 left-1/2 flex -translate-x-1/2 cursor-help justify-center rounded-full"
          >
            <span
              className={cn(
                "mt-2 whitespace-nowrap text-[0.6875rem] font-bold",
                i >= count - 2 ? "text-white" : "text-[#a13a28]",
              )}
            >
              {item.value}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}

export function MiniBars({
  items,
  height = 68,
  grid = true,
  delay = 0.2,
  className,
}: {
  items: { label: string; value: number; color?: string }[];
  height?: number;
  grid?: boolean;
  delay?: number;
  className?: string;
}) {
  const { reduce, tr } = useMotionPrefs();
  const max = Math.max(...items.map((i) => i.value), 1);

  return (
    <div
      className={cn(
        "flex items-end justify-between gap-1 rounded-xl px-1",
        grid && "rp-grid-bg",
        className,
      )}
      style={{ height }}
    >
      {items.map((item, i) => (
        <motion.span
          key={`${item.label}-${i}`}
          title={`${item.label}: ${item.value}%`}
          initial={reduce ? false : { height: 4, opacity: 0 }}
          animate={{ height: `${Math.max(8, (item.value / max) * 100)}%`, opacity: 1 }}
          whileHover={reduce ? undefined : { scaleY: 1.06 }}
          transition={tr(0.85, delay + i * 0.1)}
          className="w-full cursor-help rounded-full origin-bottom"
          style={{ backgroundColor: item.color ?? RP.accent }}
        />
      ))}
    </div>
  );
}

export function ProgressLine({
  pct,
  color = RP.accent,
  delay = 0.2,
  className,
}: {
  pct: number;
  color?: string;
  delay?: number;
  className?: string;
}) {
  const { reduce, tr } = useMotionPrefs();

  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-[#f0f0f0]", className)}>
      <motion.div
        initial={reduce ? false : { width: 0 }}
        animate={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
        transition={tr(1.1, delay)}
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
      />
    </div>
  );
}

export function pillarColor(index: number): string {
  return RP_SCALE[index % RP_SCALE.length];
}

/* ─────────────────────────── Datos ─────────────────────────── */

export function StatBlock({
  label,
  value,
  suffix,
  note,
  right,
}: {
  label: string;
  value: ReactNode;
  suffix?: string;
  note?: ReactNode;
  right?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-xs font-medium text-[#9a9a9a]">{label}</p>
        <p className="mt-1.5 text-[1.5rem] font-bold leading-none tracking-tight text-[#131313]">
          {value}
          {suffix ? <span className="text-base font-semibold text-[#b5b5b5]">{suffix}</span> : null}
        </p>
        {note ? <div className="mt-1.5 text-xs text-[#9a9a9a]">{note}</div> : null}
      </div>
      {right ? <div className="shrink-0">{right}</div> : null}
    </div>
  );
}

export function KpiRow({
  items,
  delay = 0,
}: {
  items: { label: string; value: string; note?: string; chip?: ReactNode }[];
  delay?: number;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item, i) => (
        <Card key={item.label} delay={delay + i * 0.08}>
          <StatBlock label={item.label} value={item.value} note={item.note} right={item.chip} />
        </Card>
      ))}
    </div>
  );
}

export function DataTable({
  columns,
  rows,
}: {
  columns: string[];
  rows: ReactNode[][];
}) {
  const { reduce, tr } = useMotionPrefs();

  return (
    <div className="rp-scrollbar -mx-1 overflow-x-auto px-1">
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col}
                className="whitespace-nowrap pb-3 pr-4 text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-[#a3a3a3] last:pr-0"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <motion.tr
              key={i}
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={tr(0.4, Math.min(i * 0.04, 0.6))}
              className="rp-row-hover border-t border-[#f4f4f4]"
            >
              {row.map((cell, j) => (
                <td key={j} className="py-3.5 pr-4 align-top text-[#4a4a4a] last:pr-0">
                  {cell}
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center gap-2 py-14 text-center">
      <span className="flex size-11 items-center justify-center rounded-full bg-[#f4f4f4] text-lg text-[#c9c9c9]">
        ·
      </span>
      <p className="text-sm text-[#9a9a9a]">{message}</p>
    </div>
  );
}
