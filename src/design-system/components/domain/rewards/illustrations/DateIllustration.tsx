interface IllustrationProps {
  id: string
}

export function DateIllustration({ id }: IllustrationProps) {
  return (
    <g>
      <defs>
        <linearGradient id={`grad-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0.55" />
        </linearGradient>
      </defs>
      {/* dos lunas entrelazadas */}
      <path d="M 38 24 A 16 16 0 1 0 38 56 A 12 12 0 1 1 38 24 Z" fill={`url(#grad-${id})`} opacity="0.85" />
      <path d="M 62 24 A 16 16 0 1 1 62 56 A 12 12 0 1 0 62 24 Z" fill="none" stroke={`url(#grad-${id})`} strokeWidth="1.8" opacity="0.9" />
      {/* estrella uniendo */}
      <circle cx="50" cy="40" r="2" fill="#fff" />
      <circle cx="50" cy="16" r="1.3" fill="#fff" opacity="0.8" />
      <circle cx="50" cy="64" r="1.3" fill="#fff" opacity="0.8" />
    </g>
  )
}
