export const font = {
  display: "'Fraunces', serif",
  body: "'Inter', sans-serif",
  mono: "'JetBrains Mono', monospace",
} as const

export const iconSize = {
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
} as const

export const FONT_IMPORT =
  "@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap');"
