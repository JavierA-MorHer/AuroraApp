interface IllustrationProps {
  id: string
}

export function MakeupIllustration({ id }: IllustrationProps) {
  return (
    <g>
      <defs>
        <linearGradient id={`grad-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0.55" />
        </linearGradient>
      </defs>
      {/* espejo de mano */}
      <ellipse cx="44" cy="36" rx="16" ry="20" fill="none" stroke={`url(#grad-${id})`} strokeWidth="2" />
      <line x1="44" y1="56" x2="44" y2="72" stroke={`url(#grad-${id})`} strokeWidth="2" strokeLinecap="round" />
      <line x1="36" y1="72" x2="52" y2="72" stroke={`url(#grad-${id})`} strokeWidth="2" strokeLinecap="round" />
      {/* brocha */}
      <g transform="translate(68, 22) rotate(35)">
        <rect x="-2" y="0" width="4" height="22" rx="2" fill={`url(#grad-${id})`} opacity="0.85" />
        <ellipse cx="0" cy="-4" rx="5" ry="7" fill={`url(#grad-${id})`} opacity="0.95" />
      </g>
      {/* chispas */}
      <circle cx="26" cy="20" r="1.4" fill="#fff" opacity="0.9" />
      <circle cx="78" cy="50" r="1.2" fill="#fff" opacity="0.8" />
    </g>
  )
}
