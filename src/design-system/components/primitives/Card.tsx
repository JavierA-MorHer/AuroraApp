import type { ReactNode } from 'react'
import { useThemeStore } from '@/stores/useThemeStore'
import { tokens } from '@/design-system/tokens'

interface CardProps {
  children: ReactNode
  padding?: number | string
  glow?: boolean
}

export function Card({ children, padding = 20, glow = false }: CardProps) {
  const { c } = useThemeStore()

  return (
    <div
      style={{
        background: c.bgSurface,
        border: `1px solid ${c.border}`,
        borderRadius: tokens.radius.lg,
        padding,
        boxShadow: glow ? `0 0 30px ${c.primary}33` : c.shadow,
      }}
    >
      {children}
    </div>
  )
}
