export { themes } from './colors'
export type { ThemeColors, ThemeMode } from './colors'
export { font, iconSize, FONT_IMPORT } from './typography'
export { radius, space, container, breakpoint, zIndex } from './spacing'
export { duration, easing, state } from './motion'
export { touchTarget, focusRingStyle } from './a11y'

import { font, iconSize } from './typography'
import { radius, space, container, breakpoint, zIndex } from './spacing'
import { duration, easing, state } from './motion'
import { touchTarget } from './a11y'

export const tokens = {
  font,
  iconSize,
  radius,
  space,
  container,
  breakpoint,
  zIndex,
  motion: { duration, easing },
  state,
  touchTarget,
} as const
