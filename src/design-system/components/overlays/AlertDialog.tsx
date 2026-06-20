import { AlertTriangle, Trophy, Info } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useThemeStore } from '@/stores/useThemeStore'
import { tokens } from '@/design-system/tokens'
import { Button } from '../primitives/Button'

type AlertVariant = 'danger' | 'success' | 'info'

interface AlertDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  variant?: AlertVariant
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
}

const icons: Record<AlertVariant, LucideIcon> = {
  danger: AlertTriangle,
  success: Trophy,
  info: Info,
}

export function AlertDialog({
  open,
  onClose,
  onConfirm,
  variant = 'danger',
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
}: AlertDialogProps) {
  const { c } = useThemeStore()

  if (!open) return null

  const Icon = icons[variant]
  const colors: Record<AlertVariant, string> = {
    danger: c.danger,
    success: c.success,
    info: c.secondary,
  }
  const color = colors[variant]

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(10,5,20,0.7)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: tokens.zIndex.modal,
        padding: 20,
        animation: `fadeIn ${tokens.motion.duration.base} ${tokens.motion.easing.standard}`,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: c.bgSurfaceRaised,
          border: `1px solid ${c.border}`,
          borderRadius: tokens.radius.lg,
          padding: 28,
          maxWidth: 380,
          width: '100%',
          textAlign: 'center',
          animation: `scaleIn ${tokens.motion.duration.base} ${tokens.motion.easing.decelerate}`,
        }}
      >
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: '50%',
            background: `${color}22`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
          }}
        >
          <Icon size={24} color={color} />
        </div>
        <h3
          style={{
            fontFamily: tokens.font.display,
            fontSize: 19,
            fontWeight: 600,
            marginBottom: 8,
            color: c.text,
          }}
        >
          {title}
        </h3>
        <p
          style={{
            fontFamily: tokens.font.body,
            fontSize: 13.5,
            color: c.textMuted,
            lineHeight: 1.5,
            marginBottom: 22,
          }}
        >
          {description}
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          <Button variant="secondary" onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button variant={variant === 'danger' ? 'primary' : 'glow'} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
