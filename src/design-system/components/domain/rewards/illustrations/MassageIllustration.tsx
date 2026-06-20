interface IllustrationProps {
  id: string
}

export function MassageIllustration({ id }: IllustrationProps) {
  return (
    <g>
      <defs>
        <linearGradient id={`grad-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0.55" />
        </linearGradient>
      </defs>
      {/* espiral concéntrica */}
      <circle cx="50" cy="46" r="22" fill="none" stroke={`url(#grad-${id})`} strokeWidth="1.6" opacity="0.5" />
      <circle cx="50" cy="46" r="15" fill="none" stroke={`url(#grad-${id})`} strokeWidth="1.8" opacity="0.7" />
      <circle cx="50" cy="46" r="8" fill="none" stroke={`url(#grad-${id})`} strokeWidth="2" opacity="0.95" />
      {/* ondas de aroma */}
      <path d="M 30 24 Q 26 18 30 12 Q 34 18 30 24" fill="none" stroke={`url(#grad-${id})`} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M 70 22 Q 66 15 70 8 Q 74 15 70 22" fill="none" stroke={`url(#grad-${id})`} strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="50" cy="46" r="2.4" fill="#fff" />
    </g>
  )
}
