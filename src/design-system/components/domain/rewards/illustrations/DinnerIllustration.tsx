interface IllustrationProps {
  id: string
}

export function DinnerIllustration({ id }: IllustrationProps) {
  return (
    <g>
      <defs>
        <linearGradient id={`grad-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0.6" />
        </linearGradient>
      </defs>
      {/* copa de vino */}
      <path
        d="M 38 28 Q 38 42 50 44 Q 62 42 62 28 Z"
        fill="none"
        stroke={`url(#grad-${id})`}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line x1="50" y1="44" x2="50" y2="62" stroke={`url(#grad-${id})`} strokeWidth="2" strokeLinecap="round" />
      <line x1="41" y1="62" x2="59" y2="62" stroke={`url(#grad-${id})`} strokeWidth="2" strokeLinecap="round" />
      {/* tenedor */}
      <g transform="translate(22, 26)">
        <line x1="0" y1="0" x2="0" y2="34" stroke={`url(#grad-${id})`} strokeWidth="1.8" strokeLinecap="round" />
        <line x1="-3" y1="0" x2="-3" y2="8" stroke={`url(#grad-${id})`} strokeWidth="1.6" strokeLinecap="round" />
        <line x1="3" y1="0" x2="3" y2="8" stroke={`url(#grad-${id})`} strokeWidth="1.6" strokeLinecap="round" />
        <path d="M -3 8 Q 0 12 3 8" fill="none" stroke={`url(#grad-${id})`} strokeWidth="1.6" />
      </g>
      {/* cuchillo */}
      <g transform="translate(78, 26)">
        <line x1="0" y1="0" x2="0" y2="34" stroke={`url(#grad-${id})`} strokeWidth="1.8" strokeLinecap="round" />
        <path d="M -2 0 Q 4 4 0 12 L 0 0 Z" fill={`url(#grad-${id})`} opacity="0.7" />
      </g>
      {/* estrellitas */}
      <circle cx="20" cy="18" r="1.6" fill="#fff" opacity="0.9" />
      <circle cx="80" cy="20" r="1.2" fill="#fff" opacity="0.7" />
      <circle cx="50" cy="14" r="1.4" fill="#fff" opacity="0.85" />
    </g>
  )
}
