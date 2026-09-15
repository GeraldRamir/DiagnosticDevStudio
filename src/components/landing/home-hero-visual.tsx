const LIME = "#c8eb4a";
const VIOLET = "#c084fc";
const VIOLET_SOFT = "#d8b4fe";
const VIOLET_DEEP = "#a78bfa";
const INK = "#0b0b0f";

type Pixel = {
  c: number;
  r: number;
  color: string;
  rot?: number;
};

const PIXELS: Pixel[] = [
  { c: 1, r: 0, color: VIOLET_DEEP },
  { c: 2, r: 0, color: VIOLET_SOFT },
  { c: 3, r: 0, color: LIME },
  { c: 4, r: 0, color: VIOLET },
  { c: 5, r: 0, color: VIOLET_DEEP },
  { c: 0, r: 1, color: VIOLET_SOFT },
  { c: 1, r: 1, color: INK },
  { c: 2, r: 1, color: VIOLET },
  { c: 3, r: 1, color: VIOLET_DEEP },
  { c: 4, r: 1, color: LIME },
  { c: 5, r: 1, color: VIOLET_SOFT },
  { c: 6, r: 1, color: VIOLET },
  { c: 0, r: 2, color: VIOLET },
  { c: 1, r: 2, color: VIOLET_DEEP },
  { c: 2, r: 2, color: LIME },
  { c: 3, r: 2, color: INK },
  { c: 4, r: 2, color: VIOLET },
  { c: 5, r: 2, color: VIOLET_SOFT },
  { c: 6, r: 2, color: INK },
  { c: 0, r: 3, color: INK },
  { c: 1, r: 3, color: VIOLET_SOFT },
  { c: 2, r: 3, color: VIOLET },
  { c: 3, r: 3, color: VIOLET_DEEP },
  { c: 4, r: 3, color: INK },
  { c: 5, r: 3, color: LIME },
  { c: 6, r: 3, color: VIOLET },
  { c: 0, r: 4, color: VIOLET_DEEP },
  { c: 1, r: 4, color: LIME },
  { c: 2, r: 4, color: INK },
  { c: 3, r: 4, color: VIOLET_SOFT },
  { c: 4, r: 4, color: VIOLET },
  { c: 5, r: 4, color: VIOLET_DEEP },
  { c: 1, r: 5, color: VIOLET },
  { c: 2, r: 5, color: VIOLET_SOFT },
  { c: 3, r: 5, color: LIME },
  { c: 4, r: 5, color: VIOLET_DEEP },
  { c: 5, r: 5, color: INK },
  { c: 1, r: 6, color: INK },
  { c: 2, r: 6, color: VIOLET },
  { c: 3, r: 6, color: VIOLET_SOFT },
  { c: 4, r: 6, color: VIOLET },
  { c: 5, r: 6, color: INK },
  { c: 2, r: 7, color: LIME },
  { c: 3, r: 7, color: INK },
  { c: 4, r: 7, color: VIOLET_DEEP },
  { c: -1.1, r: 3.15, color: VIOLET, rot: -16 },
  { c: -1, r: 5.1, color: VIOLET_SOFT, rot: 14 },
  { c: -0.45, r: 6.4, color: VIOLET_DEEP, rot: -10 },
  { c: 0.4, r: 7.15, color: LIME, rot: 12 },
  { c: 1.35, r: 7.55, color: INK, rot: 8 },
  { c: 4.15, r: 7.2, color: VIOLET_SOFT, rot: 11 },
];

const STEP = 28;
const SIZE = 21;
const GRID_X = 122;
const GRID_Y = 118;

function PixelRect({ c, r, color, rot = 0 }: Pixel) {
  const x = GRID_X + c * STEP;
  const y = GRID_Y + r * STEP;
  const cx = x + SIZE / 2;
  const cy = y + SIZE / 2;

  return (
    <rect
      x={x}
      y={y}
      width={SIZE}
      height={SIZE}
      rx="3.2"
      fill={color}
      transform={rot ? `rotate(${rot} ${cx} ${cy})` : undefined}
    />
  );
}

export function HomeHeroVisual() {
  return (
    <div aria-hidden className="dst-hero-card relative mx-auto w-full max-w-[400px] sm:max-w-[460px] lg:max-w-[540px] xl:max-w-[600px]">
      <svg viewBox="0 0 420 430" className="h-auto w-full overflow-visible">
        <rect x="268" y="118" width="96" height="64" rx="11" fill={LIME} />
        <rect x="286" y="172" width="80" height="72" rx="11" fill="#d4ed4a" />
        <rect x="250" y="94" width="22" height="22" rx="4" fill={LIME} />

        <path
          d="M276 98 H330 M330 98 V148"
          fill="none"
          stroke={VIOLET_SOFT}
          strokeWidth="1.6"
          strokeDasharray="2.2 4.8"
          strokeLinecap="round"
        />
        <path
          d="M70 228 V292"
          fill="none"
          stroke={VIOLET_SOFT}
          strokeWidth="1.5"
          strokeDasharray="2.2 4.8"
          strokeLinecap="round"
        />

        <rect x="82" y="64" width="11" height="11" rx="2.4" fill={LIME} transform="rotate(8 87.5 69.5)" />
        <rect x="108" y="84" width="8" height="8" rx="2" fill={LIME} />
        <rect x="318" y="72" width="13" height="13" rx="3" fill={VIOLET_SOFT} />
        <rect x="334" y="94" width="9" height="9" rx="2" fill={VIOLET} />
        <rect x="56" y="206" width="10" height="10" rx="2.4" fill={VIOLET_DEEP} transform="rotate(-16 61 211)" />

        <g transform="rotate(18 200 220)">
          <defs>
            <mask id="dst-card-cut" maskUnits="userSpaceOnUse">
              <rect x="112" y="28" width="198" height="258" rx="26" fill="#fff" />
              <rect x="112" y="192" width="52" height="106" fill="#000" />
              <rect x="112" y="218" width="100" height="80" fill="#000" />
              <rect x="112" y="252" width="198" height="44" fill="#000" />
            </mask>
          </defs>
          <rect
            x="112"
            y="28"
            width="198"
            height="258"
            rx="26"
            fill={INK}
            mask="url(#dst-card-cut)"
          />

          <text x="140" y="62" fill={LIME} fontFamily="Inter, sans-serif" fontSize="13" fontWeight="500">
            Dev Studio
          </text>
          <text
            x="140"
            y="82"
            fill="rgba(255,255,255,0.72)"
            fontFamily="Inter, sans-serif"
            fontSize="10"
            letterSpacing="0.55"
          >
            10 / 26    90 20 53 74
          </text>

          <g fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.35">
            <rect x="272" y="48" width="11" height="11" rx="2.1" />
            <rect x="286" y="48" width="11" height="11" rx="2.1" />
            <rect x="272" y="62" width="11" height="11" rx="2.1" />
            <rect x="286" y="62" width="11" height="11" rx="2.1" />
          </g>

          {PIXELS.map((pixel) => (
            <PixelRect key={`${pixel.c}-${pixel.r}`} {...pixel} />
          ))}
        </g>
      </svg>
    </div>
  );
}
