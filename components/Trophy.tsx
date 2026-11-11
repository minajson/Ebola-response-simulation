/** Professional trophy illustration — inline SVG, no external assets. */
export default function Trophy({ className = "h-40 w-auto", label = "Trophy" }: { className?: string; label?: string }) {
  return (
    <svg viewBox="0 0 160 184" className={className} role="img" aria-label={label}>
      <defs>
        <linearGradient id="trophy-metal" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#B8902F" />
          <stop offset="0.38" stopColor="#E3C56E" />
          <stop offset="0.62" stopColor="#CFA845" />
          <stop offset="1" stopColor="#9E7724" />
        </linearGradient>
        <linearGradient id="trophy-stem" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#A57E27" />
          <stop offset="0.5" stopColor="#D5B257" />
          <stop offset="1" stopColor="#8F6B1E" />
        </linearGradient>
      </defs>

      {/* Handles */}
      <path d="M42 34H29c-8 0-12 6-12 13 0 14 11 24 27 25" fill="none" stroke="#B8902F" strokeWidth="7" strokeLinecap="round" />
      <path d="M118 34h13c8 0 12 6 12 13 0 14-11 24-27 25" fill="none" stroke="#A88227" strokeWidth="7" strokeLinecap="round" />

      {/* Bowl */}
      <path d="M38 20h84v30c0 31-18 50-42 52-24-2-42-21-42-52V20z" fill="url(#trophy-metal)" />
      <path d="M50 26c0 0 0 22 0 26 0 18 8 32 20 40-15-4-26-18-26-40V26h6z" fill="#F1DE9C" opacity="0.55" />
      <rect x="33" y="14" width="94" height="10" rx="3" fill="#D8B85C" />
      <rect x="33" y="14" width="94" height="3.5" rx="1.75" fill="#F0DA94" />

      {/* Emblem */}
      <path
        d="M80 38l4.4 9 9.9 1.4-7.2 7 1.7 9.8L80 60.6l-8.8 4.6 1.7-9.8-7.2-7 9.9-1.4z"
        fill="#F6E7B0"
        opacity="0.9"
      />

      {/* Stem and collar */}
      <rect x="73" y="101" width="14" height="22" rx="2" fill="url(#trophy-stem)" />
      <ellipse cx="80" cy="106" rx="11" ry="4.5" fill="#C9A13B" />
      <rect x="58" y="121" width="44" height="9" rx="2.5" fill="#C9A13B" />
      <rect x="58" y="121" width="44" height="3" rx="1.5" fill="#E8CF7E" />

      {/* Plinth */}
      <path d="M50 130h60l5 44H45z" fill="#2A2E33" />
      <path d="M50 130h60l1 6H49z" fill="#3A3F45" />
      <rect x="62" y="146" width="36" height="15" rx="2" fill="#C9A13B" />
      <rect x="66" y="151.5" width="28" height="2" rx="1" fill="#8F6B1E" opacity="0.6" />
      <rect x="70" y="155.5" width="20" height="2" rx="1" fill="#8F6B1E" opacity="0.45" />
    </svg>
  );
}
