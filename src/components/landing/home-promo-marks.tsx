"use client";

import { motion, useReducedMotion } from "motion/react";

const LIME = "#c8eb4a";
const VIOLET = "#c4b5fd";
const VIOLET_DEEP = "#a78bfa";
const LINE = "#d8d4e0";
const INK = "#111111";

export function MarkRings() {
  const reduce = useReducedMotion() ?? false;
  return (
    <svg viewBox="0 0 180 140" className="h-[132px] w-[170px]" aria-hidden>
      <circle cx="90" cy="72" r="58" fill="none" stroke={LINE} strokeWidth="1.2" />
      <circle cx="90" cy="72" r="42" fill="none" stroke={LINE} strokeWidth="1.2" />
      <circle cx="90" cy="72" r="26" fill="none" stroke="#e4dff0" strokeWidth="1.2" />
      <motion.g
        animate={reduce ? undefined : { rotate: [0, 12, 0] }}
        transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "90px 72px" }}
      >
        <circle cx="90" cy="72" r="18" fill={VIOLET} />
        <circle cx="90" cy="18" r="4.5" fill={LIME} />
        <circle cx="142" cy="96" r="4" fill={INK} />
        <circle cx="42" cy="108" r="4" fill={VIOLET_DEEP} />
      </motion.g>
    </svg>
  );
}

export function MarkToggles() {
  return (
    <svg viewBox="0 0 180 140" className="h-[132px] w-[170px]" aria-hidden>
      <text x="8" y="32" fill="#8a8694" fontSize="9" fontFamily="Inter, sans-serif">
        Presencia
      </text>
      <rect x="68" y="16" width="104" height="22" rx="11" fill="#eceaf1" />
      <circle cx="159" cy="27" r="8" fill={LIME} />
      <text x="8" y="68" fill="#8a8694" fontSize="9" fontFamily="Inter, sans-serif">
        Contacto
      </text>
      <rect x="68" y="52" width="104" height="22" rx="11" fill="#eceaf1" />
      <circle cx="159" cy="63" r="8" fill={LIME} />
      <text x="8" y="104" fill="#8a8694" fontSize="9" fontFamily="Inter, sans-serif">
        Operación
      </text>
      <rect x="68" y="88" width="104" height="22" rx="11" fill="#eceaf1" />
      <circle cx="81" cy="99" r="8" fill="#d4d0dc" />
    </svg>
  );
}

export function MarkRadar() {
  const reduce = useReducedMotion() ?? false;
  return (
    <svg viewBox="0 0 180 140" className="h-[132px] w-[170px]" aria-hidden>
      <circle cx="90" cy="70" r="54" fill="none" stroke={LINE} strokeWidth="1.2" />
      <circle cx="90" cy="70" r="38" fill="none" stroke={LINE} strokeWidth="1.2" />
      <circle cx="90" cy="70" r="22" fill="none" stroke={LINE} strokeWidth="1.2" />
      <motion.g
        animate={reduce ? undefined : { rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "90px 70px" }}
      >
        <path d="M90 70 L90 16" stroke={LIME} strokeWidth="1.4" />
        <circle cx="90" cy="16" r="4.5" fill={LIME} />
      </motion.g>
      <circle cx="90" cy="70" r="6" fill={INK} />
      <circle cx="58" cy="118" r="4.5" fill={INK} />
      <circle cx="122" cy="118" r="4.5" fill={VIOLET} />
      <circle cx="148" cy="52" r="3.5" fill={VIOLET_DEEP} />
    </svg>
  );
}

export function MarkPerson() {
  return (
    <svg viewBox="0 0 180 140" className="h-[132px] w-[170px]" aria-hidden>
      <circle cx="90" cy="36" r="16" fill={VIOLET} />
      <circle cx="90" cy="36" r="3.2" fill={INK} />
      <path
        d="M90 54v52M46 82h88"
        fill="none"
        stroke={LINE}
        strokeWidth="1.6"
        strokeDasharray="2.4 3.2"
        strokeLinecap="round"
      />
      <circle cx="28" cy="82" r="10" fill="#eceaf1" />
      <circle cx="28" cy="79" r="2.4" fill={INK} />
      <circle cx="152" cy="82" r="10" fill="#eceaf1" />
      <circle cx="152" cy="79" r="2.4" fill={INK} />
      <circle cx="90" cy="124" r="6" fill={LIME} />
      <circle cx="58" cy="118" r="4" fill={VIOLET_DEEP} />
      <circle cx="122" cy="118" r="4" fill={INK} />
    </svg>
  );
}

export function MarkHex() {
  const reduce = useReducedMotion() ?? false;
  const tiles = [
    { x: 68, y: 8, fill: LIME },
    { x: 100, y: 26, fill: VIOLET },
    { x: 100, y: 62, fill: VIOLET_DEEP },
    { x: 68, y: 80, fill: LIME },
    { x: 36, y: 62, fill: VIOLET },
    { x: 36, y: 26, fill: LIME },
  ];
  return (
    <svg viewBox="0 0 160 120" className="mx-auto mt-8 h-[132px] w-[168px]" aria-hidden>
      {tiles.map((tile, index) => (
        <motion.rect
          key={`${tile.x}-${tile.y}`}
          x={tile.x}
          y={tile.y}
          width="22"
          height="22"
          rx="5"
          fill={tile.fill}
          animate={reduce ? undefined : { y: [tile.y, tile.y - 4, tile.y] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut", delay: index * 0.18 }}
        />
      ))}
    </svg>
  );
}

export function MarkFlow() {
  return (
    <svg viewBox="0 0 220 120" className="mx-auto mt-10 h-[120px] w-full max-w-[240px]" aria-hidden>
      <circle cx="18" cy="28" r="8" fill="none" stroke={INK} strokeWidth="1.6" />
      <circle cx="18" cy="25" r="2.4" fill={INK} />
      <path d="M18 38v22h48" fill="none" stroke={LINE} strokeWidth="1.5" strokeDasharray="2.2 3" />
      <circle cx="78" cy="60" r="4" fill={VIOLET} />
      <path d="M86 60h28" fill="none" stroke={LINE} strokeWidth="1.5" strokeDasharray="2.2 3" />
      <circle cx="122" cy="60" r="4" fill={LINE} />
      <rect x="138" y="38" width="72" height="44" rx="10" fill={LIME} />
      <rect x="186" y="52" width="12" height="9" rx="2" fill="#9ccc3a" />
    </svg>
  );
}

export function MarkBars() {
  const bars = [
    { y: 28, w: 150, fill: VIOLET },
    { y: 52, w: 118, fill: LIME },
    { y: 76, w: 168, fill: VIOLET },
    { y: 100, w: 96, fill: LIME },
  ];
  return (
    <svg viewBox="0 0 220 140" className="mx-auto mt-8 h-[128px] w-full max-w-[240px]" aria-hidden>
      {bars.map((bar) => (
        <rect key={bar.y} x="16" y={bar.y} width={bar.w} height="12" rx="6" fill={bar.fill} />
      ))}
    </svg>
  );
}

export function MarkOrbit() {
  const reduce = useReducedMotion() ?? false;
  const dots = Array.from({ length: 28 }, (_, index) => {
    const angle = (index / 28) * Math.PI * 2;
    /* Redondeamos: sin esto el servidor y el cliente serializan el float
       distinto y React aborta la hidratación de toda la página. */
    return {
      cx: (190 + Math.cos(angle) * 118).toFixed(2),
      cy: (190 + Math.sin(angle) * 118).toFixed(2),
    };
  });

  return (
    <svg viewBox="0 0 380 380" className="h-auto w-full max-w-[420px]" aria-hidden>
      <motion.g
        animate={reduce ? undefined : { rotate: 360 }}
        transition={{ duration: 48, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "190px 190px" }}
      >
        {dots.map((dot, index) => (
          <circle key={index} cx={dot.cx} cy={dot.cy} r="4.2" fill={INK} />
        ))}
        <circle cx="190" cy="64" r="5" fill="#fff" stroke={INK} strokeWidth="1.2" />
        <circle cx="316" cy="112" r="5" fill={LIME} />
        <circle cx="338" cy="190" r="5.5" fill={INK} />
        <circle cx="300" cy="286" r="5" fill={VIOLET} />
        <line x1="190" y1="72" x2="248" y2="118" stroke={LINE} strokeWidth="1.2" />
        <line x1="308" y1="118" x2="328" y2="176" stroke={LINE} strokeWidth="1.2" />
        <line x1="308" y1="274" x2="250" y2="330" stroke={LINE} strokeWidth="1.2" />
      </motion.g>
      <circle cx="190" cy="190" r="46" fill={INK} />
      <circle cx="176" cy="178" r="5" fill={LIME} />
      <circle cx="194" cy="172" r="4" fill={VIOLET} />
      <circle cx="208" cy="188" r="5" fill={VIOLET_DEEP} />
      <circle cx="182" cy="198" r="3.5" fill={LIME} />
    </svg>
  );
}
