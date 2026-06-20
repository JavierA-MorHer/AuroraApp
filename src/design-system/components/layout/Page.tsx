import type { ReactNode } from 'react'
import { useThemeStore } from '@/stores/useThemeStore'
import { tokens } from '@/design-system/tokens'
import { Starfield } from './Starfield'

interface PageProps {
  children: ReactNode
  starDensity?: number
  padding?: string
}

export function Page({ children, starDensity, padding = '24px' }: PageProps) {
  const { mode, c } = useThemeStore()

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          mode === 'dark'
            ? `radial-gradient(ellipse at top, ${c.bgSurface} 0%, ${c.bgDeep} 60%)`
            : `radial-gradient(ellipse at top, #FFFFFF 0%, ${c.bgDeep} 70%)`,
        color: c.text,
        fontFamily: tokens.font.body,
        position: 'relative',
        transition: `background ${tokens.motion.duration.base} ${tokens.motion.easing.standard}`,
      }}
    >
      <Starfield density={starDensity ?? (mode === 'dark' ? 50 : 26)} />
      <div
        style={{
          position: 'relative',
          padding,
          paddingTop: `max(${padding}, env(safe-area-inset-top))`,
          paddingBottom: `max(${padding}, env(safe-area-inset-bottom))`,
        }}
      >
        {children}
      </div>
    </div>
  )
}
