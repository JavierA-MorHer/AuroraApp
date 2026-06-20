import type { ThemeColors } from './colors'

export const touchTarget = {
  min: 44,
} as const

export function focusRingStyle(c: ThemeColors): string {
  return `0 0 0 2px ${c.bgSurface}, 0 0 0 4px ${c.focusRing}`
}
