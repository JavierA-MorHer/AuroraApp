export const duration = {
  fast: '0.15s',
  base: '0.25s',
  slow: '0.4s',
} as const

export const easing = {
  standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
  decelerate: 'cubic-bezier(0.16, 1, 0.3, 1)',
  accelerate: 'cubic-bezier(0.4, 0, 1, 1)',
  bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
} as const

export const state = {
  hoverScale: 'scale(1.02)',
  activeScale: 'scale(0.97)',
  hoverLift: 'translateY(-2px)',
  disabledOpacity: 0.4,
  pressedOpacity: 0.85,
} as const
