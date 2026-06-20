interface IllustrationProps {
  id: string
}

export function SurpriseIllustration({ id }: IllustrationProps) {
  return (
    <g>
      <defs>
        <linearGradient id={`grad-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0.55" />
        </linearGradient>
      </defs>
      {/* caja de regalo */}
      <rect x="32" y="38" width="36" height="28" rx="2" fill="none" stroke={`url(#grad-${id})`} strokeWidth="2" />
      <line x1="32" y1="50" x2="68" y2="50" stroke={`url(#grad-${id})`} strokeWidth="1.8" />
      <line x1="50" y1="38" x2="50" y2="66" stroke={`url(#grad-${id})`} strokeWidth="1.8" />
      {/* moño */}
      <path d="M 50 38 Q 40 28 32 32 Q 36 40 50 38" fill={`url(#grad-${id})`} opacity="0.8" />
      <path d="M 50 38 Q 60 28 68 32 Q 64 40 50 38" fill={`url(#grad-${id})`} opacity="0.8" />
      {/* constelación */}
      <circle cx="38" cy="16" r="1.6" fill="#fff" opacity="0.9" />
      <circle cx="50" cy="10" r="1.3" fill="#fff" opacity="0.8" />
      <circle cx="62" cy="16" r="1.6" fill="#fff" opacity="0.9" />
      <line x1="38" y1="16" x2="50" y2="10" stroke="#fff" strokeWidth="0.6" opacity="0.5" />
      <line x1="50" y1="10" x2="62" y2="16" stroke="#fff" strokeWidth="0.6" opacity="0.5" />
    </g>
  )
}
