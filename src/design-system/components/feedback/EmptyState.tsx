import type { LucideIcon } from 'lucide-react'
import { BookOpen } from 'lucide-react'
import { useThemeStore } from '@/stores/useThemeStore'
import { tokens } from '@/design-system/tokens'
import { Button } from '../primitives/Button'

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({
  icon: Icon = BookOpen,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  const { c } = useThemeStore()

  return (
    <div style={{ textAlign: 'center', padding: '48px 24px' }}>
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          margin: '0 auto 18px',
          background: c.glowSoft,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon size={28} color={c.glow} strokeWidth={1.5} />
      </div>
      <h3
        style={{
          fontFamily: tokens.font.display,
          fontSize: 18,
          fontWeight: 600,
          color: c.text,
          marginBottom: 6,
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontFamily: tokens.font.body,
          fontSize: 13.5,
          color: c.textMuted,
          maxWidth: 320,
          margin: '0 auto 20px',
          lineHeight: 1.6,
        }}
      >
        {description}
      </p>
      {actionLabel && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
