import { useThemeStore } from '@/stores/useThemeStore'
import { tokens } from '@/design-system/tokens'

interface Option {
  label: string
  value: string
}

interface SegmentedControlProps {
  label?: string
  options: Option[]
  value: string | null
  onChange: (value: string) => void
}

export function SegmentedControl({ label, options, value, onChange }: SegmentedControlProps) {
  const { c } = useThemeStore()

  return (
    <div>
      {label && (
        <span
          style={{
            display: 'block',
            fontFamily: tokens.font.body,
            fontSize: 13,
            fontWeight: 600,
            color: c.textMuted,
            marginBottom: 8,
          }}
        >
          {label}
        </span>
      )}
      <div
        style={{
          display: 'flex',
          gap: 4,
          background: c.bgDeep,
          padding: 4,
          borderRadius: tokens.radius.full,
        }}
      >
        {options.map((opt) => {
          const active = value === opt.value
          return (
            <button
              key={opt.value}
              type="button"
              className="aurora-focusable"
              onClick={() => onChange(opt.value)}
              style={{
                flex: 1,
                fontFamily: tokens.font.body,
                fontSize: 13,
                fontWeight: 600,
                padding: '8px 0',
                borderRadius: tokens.radius.full,
                border: 'none',
                cursor: 'pointer',
                background: active ? c.primary : 'transparent',
                color: active ? '#fff' : c.textMuted,
                transition: `all ${tokens.motion.duration.fast} ${tokens.motion.easing.standard}`,
                minHeight: 38,
              }}
            >
              {opt.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
