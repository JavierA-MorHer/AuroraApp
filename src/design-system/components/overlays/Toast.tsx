import { useEffect } from 'react'
import { Check, X, Info } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useThemeStore } from '@/stores/useThemeStore'
import { tokens } from '@/design-system/tokens'

type ToastVariant = 'success' | 'danger' | 'info'

interface ToastProps {
  open: boolean
  onClose: () => void
  variant?: ToastVariant
  message: string
}

const icons: Record<ToastVariant, LucideIcon> = {
  success: Check,
  danger: X,
  info: Info,
}

export function Toast({ open, onClose, variant = 'success', message }: ToastProps) {
  const { c } = useThemeStore()

  useEffect(() => {
    if (open) {
      const t = setTimeout(onClose, 3000)
      return () => clearTimeout(t)
    }
  }, [open, onClose])

  if (!open) return null

  const colors: Record<ToastVariant, string> = {
    success: c.success,
    danger: c.danger,
    info: c.secondary,
  }
  const Icon = icons[variant]
  const color = colors[variant]

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        background: c.bgSurfaceRaised,
        border: `1px solid ${color}55`,
        borderRadius: tokens.radius.md,
        padding: '12px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        boxShadow: `0 8px 30px rgba(0,0,0,0.4), 0 0 20px ${color}33`,
        zIndex: tokens.zIndex.toast,
        animation: `slideUp ${tokens.motion.duration.base} ${tokens.motion.easing.decelerate}`,
      }}
    >
      <div
        style={{
          width: 22,
          height: 22,
          borderRadius: '50%',
          background: `${color}22`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Icon size={13} color={color} />
      </div>
      <span style={{ fontFamily: tokens.font.body, fontSize: 13.5, color: c.text }}>{message}</span>
    </div>
  )
}
