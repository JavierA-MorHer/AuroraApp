import type { ReactNode } from 'react'
import { useThemeStore } from '@/stores/useThemeStore'
import { tokens } from '@/design-system/tokens'

type BadgeVariant = 'default' | 'success' | 'glow'

interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
}

export function Badge({ children, variant = 'default' }: BadgeProps) {
  const { c } = useThemeStore()

  const variants: Record<BadgeVariant, { bg: string; color: string }> = {
    default: { bg: c.bgSurfaceRaised, color: c.textMuted },
    success: { bg: '#4ADE8022', color: c.success },
    glow: { bg: `${c.glow}22`, color: c.glow },
  }

  const v = variants[variant]

  return (
    <span
      style={{
        fontFamily: tokens.font.mono,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: 0.5,
        textTransform: 'uppercase',
        padding: '4px 10px',
        borderRadius: tokens.radius.full,
        background: v.bg,
        color: v.color,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
      }}
    >
      {children}
    </span>
  )
}
