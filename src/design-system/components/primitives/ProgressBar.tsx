import { useThemeStore } from '@/stores/useThemeStore'
import { tokens } from '@/design-system/tokens'

interface ProgressBarProps {
  value: number
  max?: number
  label?: string
}

export function ProgressBar({ value, max = 100, label }: ProgressBarProps) {
  const { c } = useThemeStore()
  const pct = (value / max) * 100

  return (
    <div>
      {label && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontFamily: tokens.font.body, fontSize: 13, color: c.textMuted }}>
            {label}
          </span>
          <span style={{ fontFamily: tokens.font.mono, fontSize: 12, color: c.text }}>
            {value}/{max}
          </span>
        </div>
      )}
      <div
        style={{
          height: 8,
          background: c.bgDeep,
          borderRadius: tokens.radius.full,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: '100%',
            background: `linear-gradient(90deg, ${c.secondary}, ${c.glow})`,
            borderRadius: tokens.radius.full,
            boxShadow: `0 0 8px ${c.glow}aa`,
            transition: 'width 0.5s ease',
          }}
        />
      </div>
    </div>
  )
}
