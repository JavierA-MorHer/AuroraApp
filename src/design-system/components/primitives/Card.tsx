import type { ReactNode, CSSProperties } from 'react'
import { useThemeStore } from '@/stores/useThemeStore'
import { tokens } from '@/design-system/tokens'

interface CardProps {
  children: ReactNode
  padding?: number | string
  glow?: boolean
  style?: CSSProperties
  className?: string
}

export function Card({ children, padding = 20, glow = false, style, className }: CardProps) {
  const { c } = useThemeStore()

  return (
    <div
      className={className}
      style={{
        background: c.bgSurface,
        border: `1px solid ${c.border}`,
        borderRadius: tokens.radius.lg,
        padding,
        boxShadow: glow ? `0 0 30px ${c.primary}33` : c.shadow,
        ...style,
      }}
    >
      {children}
    </div>
  )
}
