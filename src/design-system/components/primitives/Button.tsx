import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { useThemeStore } from '@/stores/useThemeStore'
import { tokens } from '@/design-system/tokens'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'glow'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps {
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  icon?: LucideIcon
  onClick?: () => void
  disabled?: boolean
}

const padding: Record<ButtonSize, string> = {
  sm: '8px 16px',
  md: '12px 24px',
  lg: '16px 32px',
}

const fontSize: Record<ButtonSize, number> = { sm: 13, md: 15, lg: 17 }

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  onClick,
  disabled,
}: ButtonProps) {
  const { c } = useThemeStore()

  const base: React.CSSProperties = {
    fontFamily: tokens.font.body,
    fontWeight: 600,
    fontSize: fontSize[size],
    padding: padding[size],
    borderRadius: tokens.radius.full,
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    transition: `transform ${tokens.motion.duration.fast} ${tokens.motion.easing.standard}, box-shadow ${tokens.motion.duration.fast} ${tokens.motion.easing.standard}, opacity ${tokens.motion.duration.fast} ${tokens.motion.easing.standard}`,
    opacity: disabled ? tokens.state.disabledOpacity : 1,
  }

  const variants: Record<ButtonVariant, React.CSSProperties> = {
    primary: {
      background: `linear-gradient(135deg, ${c.primary}, ${c.secondary})`,
      color: '#fff',
      boxShadow: `0 4px 20px ${c.primary}55`,
    },
    secondary: {
      background: c.bgSurfaceRaised,
      color: c.text,
      border: `1px solid ${c.border}`,
    },
    ghost: {
      background: 'transparent',
      color: c.textMuted,
    },
    glow: {
      background: c.glow,
      color: c.bgDeep,
      boxShadow: `0 0 24px ${c.glow}88`,
    },
  }

  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className="aurora-focusable"
      style={{ ...base, ...variants[variant] }}
      onMouseEnter={(e) => {
        if (!disabled)
          e.currentTarget.style.transform = `${tokens.state.hoverLift} ${tokens.state.hoverScale}`
      }}
      onMouseLeave={(e) => {
        if (!disabled) e.currentTarget.style.transform = 'translateY(0) scale(1)'
      }}
      onMouseDown={(e) => {
        if (!disabled) e.currentTarget.style.transform = tokens.state.activeScale
      }}
      onMouseUp={(e) => {
        if (!disabled)
          e.currentTarget.style.transform = `${tokens.state.hoverLift} ${tokens.state.hoverScale}`
      }}
    >
      {Icon && <Icon size={fontSize[size] - 1} />}
      {children}
    </button>
  )
}
