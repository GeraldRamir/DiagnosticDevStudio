const MINT = "#7ef0e0";
const INK = "#111111";
const CREAM = "#f3eee6";

export function WaHeroArt() {
  return (
    <svg viewBox="0 0 420 320" className="h-auto w-full max-w-[420px]" aria-hidden>
      <rect x="168" y="48" width="220" height="148" rx="18" fill={MINT} />
      <rect x="184" y="64" width="188" height="104" rx="8" fill="#fff" />
      <rect x="196" y="78" width="92" height="8" rx="4" fill="#d9d9d9" />
      <rect x="196" y="96" width="148" height="8" rx="4" fill="#ececec" />
      <rect x="196" y="114" width="120" height="8" rx="4" fill="#ececec" />
      <rect x="196" y="140" width="54" height="16" rx="8" fill={INK} />
      <circle cx="118" cy="168" r="52" fill={MINT} />
      <circle cx="118" cy="150" r="22" fill={INK} />
      <path d="M86 214c8-28 56-28 64 0v36H86z" fill={INK} />
      <rect x="78" y="248" width="80" height="14" rx="7" fill={CREAM} />
    </svg>
  );
}

export function WaShareArt() {
  return (
    <svg viewBox="0 0 120 72" className="mx-auto h-16 w-28" aria-hidden>
      <circle cx="28" cy="36" r="14" fill={MINT} />
      <circle cx="28" cy="32" r="5" fill={INK} />
      <circle cx="92" cy="36" r="14" fill={CREAM} />
      <circle cx="92" cy="32" r="5" fill={INK} />
      <path d="M44 36h32" stroke={INK} strokeWidth="2" strokeDasharray="3 3" />
    </svg>
  );
}

export function WaBrowserArt() {
  return (
    <svg viewBox="0 0 140 80" className="mx-auto h-16 w-32" aria-hidden>
      <rect x="8" y="10" width="124" height="60" rx="10" fill="#f3f3f3" />
      <circle cx="24" cy="24" r="3" fill="#ff6b6b" />
      <circle cx="34" cy="24" r="3" fill="#ffd93d" />
      <circle cx="44" cy="24" r="3" fill={MINT} />
      <rect x="22" y="38" width="70" height="6" rx="3" fill="#e5e5e5" />
      <rect x="22" y="50" width="48" height="6" rx="3" fill="#ececec" />
    </svg>
  );
}

export function WaQrArt() {
  return (
    <svg viewBox="0 0 80 80" className="mx-auto h-16 w-16" aria-hidden>
      <rect x="8" y="8" width="28" height="28" rx="4" fill={INK} />
      <rect x="44" y="8" width="28" height="28" rx="4" fill={INK} />
      <rect x="8" y="44" width="28" height="28" rx="4" fill={INK} />
      <rect x="48" y="48" width="8" height="8" fill={MINT} />
      <rect x="60" y="48" width="8" height="8" fill={INK} />
      <rect x="48" y="60" width="8" height="8" fill={INK} />
      <rect x="60" y="60" width="8" height="8" fill={MINT} />
    </svg>
  );
}

export function WaEarnArt() {
  return (
    <svg viewBox="0 0 380 220" className="h-auto w-full max-w-[360px]" aria-hidden>
      <circle cx="86" cy="96" r="40" fill={MINT} />
      <circle cx="86" cy="82" r="16" fill={INK} />
      <path d="M58 138c8-24 48-24 56 0v28H58z" fill={INK} />
      <rect x="200" y="36" width="150" height="96" rx="14" fill="#fff" />
      <rect x="216" y="54" width="80" height="8" rx="4" fill="#e5e5e5" />
      <rect x="216" y="72" width="118" height="8" rx="4" fill="#ececec" />
      <circle cx="300" cy="118" r="22" fill={MINT} />
      <circle cx="300" cy="118" r="8" fill={INK} />
    </svg>
  );
}
