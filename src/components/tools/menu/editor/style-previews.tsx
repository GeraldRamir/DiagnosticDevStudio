/**
 * Miniaturas de los estilos del menú.
 * Son SVG diminutos que representan la estructura real de cada opción,
 * para elegir mirando en lugar de leer.
 */

const INK = "#16161c";
const SOFT = "#D8D2CC";
const LINE = "#E8E2DC";

function Frame({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <svg viewBox="0 0 120 84" className="h-auto w-full" aria-hidden>
      <rect width="120" height="84" fill={dark ? "#111113" : "#FFFFFF"} />
      {children}
    </svg>
  );
}

export function CardStyleMinimal() {
  return (
    <Frame>
      {[20, 38, 56].map((y) => (
        <g key={y}>
          <rect x="14" y={y} width="52" height="5" rx="2.5" fill={INK} opacity="0.75" />
          <rect x="14" y={y + 8} width="34" height="4" rx="2" fill={SOFT} />
          <rect x="88" y={y} width="18" height="5" rx="2.5" fill={INK} opacity="0.45" />
          <line x1="14" y1={y + 16} x2="106" y2={y + 16} stroke={LINE} strokeWidth="1" />
        </g>
      ))}
    </Frame>
  );
}

export function CardStyleRounded() {
  return (
    <Frame>
      {[16, 42, 68].map((y) => (
        <g key={y}>
          <rect x="12" y={y} width="96" height="20" rx="7" fill="#F5F1ED" />
          <rect x="17" y={y + 4} width="12" height="12" rx="4" fill={SOFT} />
          <rect x="34" y={y + 5} width="38" height="4" rx="2" fill={INK} opacity="0.75" />
          <rect x="34" y={y + 12} width="26" height="3" rx="1.5" fill={SOFT} />
          <rect x="86" y={y + 6} width="16" height="5" rx="2.5" fill={INK} opacity="0.45" />
        </g>
      ))}
    </Frame>
  );
}

export function CardStyleImage() {
  return (
    <Frame>
      {[
        [12, 14],
        [64, 14],
        [12, 50],
        [64, 50],
      ].map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <rect x={x} y={y} width="44" height="28" rx="6" fill="#F5F1ED" />
          <rect x={x} y={y} width="44" height="16" rx="6" fill={SOFT} />
          <rect x={x + 4} y={y + 19} width="24" height="3.5" rx="1.75" fill={INK} opacity="0.7" />
          <rect x={x + 4} y={y + 25} width="14" height="3" rx="1.5" fill={INK} opacity="0.35" />
        </g>
      ))}
    </Frame>
  );
}

export function HeroSimple() {
  return (
    <Frame>
      <rect x="14" y="14" width="30" height="6" rx="3" fill={INK} opacity="0.8" />
      <rect x="14" y="24" width="60" height="4" rx="2" fill={SOFT} />
      <rect x="14" y="36" width="34" height="9" rx="4.5" fill={INK} opacity="0.85" />
      <line x1="0" y1="54" x2="120" y2="54" stroke={LINE} strokeWidth="1" />
      <rect x="14" y="62" width="92" height="12" rx="5" fill="#F5F1ED" />
    </Frame>
  );
}

export function HeroCover() {
  return (
    <Frame>
      <rect x="0" y="0" width="120" height="34" fill={SOFT} />
      <circle cx="60" cy="34" r="11" fill="#FFFFFF" stroke={LINE} strokeWidth="1.5" />
      <rect x="42" y="50" width="36" height="6" rx="3" fill={INK} opacity="0.8" />
      <rect x="34" y="60" width="52" height="4" rx="2" fill={SOFT} />
      <rect x="40" y="70" width="40" height="8" rx="4" fill={INK} opacity="0.85" />
    </Frame>
  );
}

export function HeroCentered() {
  return (
    <Frame>
      <circle cx="60" cy="22" r="10" fill={SOFT} />
      <rect x="38" y="38" width="44" height="6" rx="3" fill={INK} opacity="0.8" />
      <rect x="30" y="48" width="60" height="3.5" rx="1.75" fill={SOFT} />
      <line x1="46" y1="58" x2="74" y2="58" stroke={INK} strokeWidth="1" opacity="0.3" />
      <rect x="34" y="66" width="52" height="9" rx="4.5" fill={INK} opacity="0.85" />
    </Frame>
  );
}

export function LayoutModern() {
  return (
    <Frame>
      <rect x="0" y="0" width="120" height="22" fill="#F1ECE8" />
      <rect x="12" y="8" width="34" height="6" rx="3" fill={INK} opacity="0.8" />
      <rect x="12" y="30" width="22" height="8" rx="4" fill={INK} opacity="0.85" />
      <rect x="38" y="30" width="22" height="8" rx="4" fill="#F1ECE8" />
      <rect x="64" y="30" width="22" height="8" rx="4" fill="#F1ECE8" />
      <rect x="12" y="46" width="96" height="26" rx="8" fill="#F5F1ED" />
    </Frame>
  );
}

export function LayoutClassic() {
  return (
    <Frame>
      <rect x="30" y="10" width="60" height="6" rx="3" fill={INK} opacity="0.8" />
      <line x1="12" y1="26" x2="108" y2="26" stroke={INK} strokeWidth="1" opacity="0.25" />
      {[34, 50, 66].map((y) => (
        <g key={y}>
          <rect x="12" y={y} width="44" height="4" rx="2" fill={INK} opacity="0.7" />
          <rect x="92" y={y} width="16" height="4" rx="2" fill={INK} opacity="0.45" />
          <line
            x1="58"
            y1={y + 2}
            x2="90"
            y2={y + 2}
            stroke={SOFT}
            strokeWidth="1"
            strokeDasharray="2 2"
          />
        </g>
      ))}
    </Frame>
  );
}

export function LayoutElegant() {
  return (
    <Frame dark>
      <rect x="34" y="12" width="52" height="5" rx="2.5" fill="#C9A227" />
      <line x1="44" y1="24" x2="76" y2="24" stroke="#C9A227" strokeWidth="1" opacity="0.6" />
      {[34, 52, 70].map((y) => (
        <g key={y}>
          <rect x="16" y={y} width="88" height="12" rx="5" fill="#1C1C20" />
          <rect x="22" y={y + 4} width="34" height="4" rx="2" fill="#F7F5F2" opacity="0.8" />
          <rect x="82" y={y + 4} width="16" height="4" rx="2" fill="#C9A227" />
        </g>
      ))}
    </Frame>
  );
}

export function FontPreview({ family, label }: { family: string; label: string }) {
  return (
    <svg viewBox="0 0 120 84" className="h-auto w-full" aria-hidden>
      <rect width="120" height="84" fill="#FFFFFF" />
      <text
        x="60"
        y="46"
        textAnchor="middle"
        fontFamily={family}
        fontSize="30"
        fontWeight="600"
        fill={INK}
      >
        {label}
      </text>
      <rect x="34" y="58" width="52" height="4" rx="2" fill={SOFT} />
    </svg>
  );
}
