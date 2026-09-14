// Generated cover art used whenever a trip has no photo of its own — similar
// to how Notion/Linear give every page a default gradient cover. Keeps the
// dashboard feeling polished without depending on any third-party image
// host being reachable.
const VARIANTS = [
  {
    from: "#0d7d6f",
    to: "#22c55e",
    shape: "M0,180 L60,120 L110,150 L160,90 L220,140 L280,100 L340,150 L400,110 L400,220 L0,220 Z",
  },
  {
    from: "#1e3a8a",
    to: "#7c3aed",
    shape: "M0,160 Q50,100 100,150 T200,130 T300,160 T400,140 L400,220 L0,220 Z",
  },
  {
    from: "#f2632a",
    to: "#eab308",
    shape: "M0,150 L400,150 L400,220 L0,220 Z M60,150 L80,90 L100,150 Z M180,150 L205,70 L230,150 Z M300,150 L320,100 L340,150 Z",
  },
  {
    from: "#be123c",
    to: "#f97316",
    shape: "M0,140 C80,120 120,160 200,135 C280,110 320,150 400,130 L400,220 L0,220 Z",
  },
  {
    from: "#0e7490",
    to: "#a3e635",
    shape: "M0,170 L400,170 L400,220 L0,220 Z M0,170 Q100,130 200,165 T400,155",
  },
  {
    from: "#701a75",
    to: "#ec4899",
    shape: "M0,160 L400,160 L400,220 L0,220 Z M40,160 L70,110 L100,160 Z M260,160 L295,100 L330,160 Z",
  },
  {
    from: "#0369a1",
    to: "#67e8f9",
    shape: "M0,175 Q80,150 160,175 T320,170 T400,180 L400,220 L0,220 Z",
  },
];

function hashString(value: string): number {
  // FNV-1a — small strings with similar prefixes (like our cuids) need a
  // hash with good avalanche behavior, or they all land in the same bucket.
  let hash = 0x811c9dc5;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

export function CoverArt({ seed, className }: { seed: string; className?: string }) {
  const variant = VARIANTS[hashString(seed) % VARIANTS.length];

  return (
    <svg
      viewBox="0 0 400 220"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role="presentation"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`cover-${seed}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={variant.from} />
          <stop offset="100%" stopColor={variant.to} />
        </linearGradient>
      </defs>
      <rect width="400" height="220" fill={`url(#cover-${seed})`} />
      <path d={variant.shape} fill="rgba(255,255,255,0.16)" />
    </svg>
  );
}
