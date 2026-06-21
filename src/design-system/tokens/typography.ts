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

export const fontSize = {
  '2xs': 10,
  xs: 11,
  sm: 13,
  base: 14,
  md: 15,
  lg: 17,
  xl: 20,
  '2xl': 24,
  '4xl': 32,
  '5xl': 36,
} as const

export const fontWeight = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const

export const letterSpacing = {
  normal: 0,
  wide: 1,
  wider: 1.5,
  widest: 2,
} as const

export const lineHeight = {
  tight: 1.2,
  snug: 1.375,
  base: 1.5,
  normal: 1.5,
  relaxed: 1.625,
} as const

export const FONT_IMPORT =
  "@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap');"
