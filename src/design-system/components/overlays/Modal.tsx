import type { ReactNode } from 'react'
import { X } from 'lucide-react'
import { useThemeStore } from '@/stores/useThemeStore'
import { tokens } from '@/design-system/tokens'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  footer?: ReactNode
}

export function Modal({ open, onClose, title, children, footer }: ModalProps) {
  const { c } = useThemeStore()

  if (!open) return null

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
          background: `linear-gradient(160deg, ${c.bgSurfaceRaised}, ${c.bgSurface})`,
          border: `1px solid ${c.border}`,
          borderRadius: tokens.radius.lg,
          padding: 28,
          maxWidth: 440,
          width: '100%',
          position: 'relative',
          boxShadow: `${c.shadowXl}, 0 0 40px ${c.primary}22`,
          animation: `scaleIn ${tokens.motion.duration.slow} ${tokens.motion.easing.decelerate}`,
        }}
      >
        <button
          onClick={onClose}
          className="aurora-focusable"
          aria-label="Cerrar"
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: c.textFaint,
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: tokens.radius.full,
          }}
        >
          <X size={18} />
        </button>
        {title && (
          <h3
            style={{
              fontFamily: tokens.font.display,
              fontSize: 21,
              fontWeight: 600,
              marginBottom: 12,
              paddingRight: 24,
              color: c.text,
            }}
          >
            {title}
          </h3>
        )}
        <div
          style={{ fontFamily: tokens.font.body, fontSize: 14, color: c.textMuted, lineHeight: 1.6 }}
        >
          {children}
        </div>
        {footer && (
          <div style={{ display: 'flex', gap: 10, marginTop: 24, justifyContent: 'flex-end' }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
