export const radius = {
  sm: '8px',
  md: '14px',
  lg: '22px',
  full: '999px',
} as const

// Base-4 scale: index is the multiplier
export const space: readonly number[] = [0, 4, 8, 12, 16, 24, 32, 48, 64]

export const container = {
  sm: '480px',
  md: '720px',
  lg: '960px',
  full: '100%',
} as const

export const breakpoint = {
  mobile: '480px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1280px',
} as const

export const zIndex = {
  base: 0,
  dropdown: 30,
  sticky: 40,
  overlay: 90,
  modal: 100,
  toast: 200,
  tooltip: 250,
} as const
