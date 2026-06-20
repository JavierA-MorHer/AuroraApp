import { useState } from 'react'
import { useThemeStore } from '@/stores/useThemeStore'
import { tokens } from '@/design-system/tokens'

interface RadioGroupProps {
  label?: string
  options: string[]
  defaultValue?: string
  name?: string
}

export function RadioGroup({ label, options, defaultValue, name }: RadioGroupProps) {
  const { c } = useThemeStore()
  const [selected, setSelected] = useState(defaultValue ?? options[0])
  const groupName = name ?? label ?? 'radio-group'

  return (
    <div role="radiogroup" aria-label={label}>
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {options.map((opt) => {
          const isSelected = selected === opt
          return (
            <label
              key={opt}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                cursor: 'pointer',
                padding: '10px 14px',
                borderRadius: tokens.radius.sm,
                background: isSelected ? c.glowSoft : c.bgSurface,
                border: `1.5px solid ${isSelected ? c.primary : c.border}`,
                transition: `all ${tokens.motion.duration.fast} ${tokens.motion.easing.standard}`,
                minHeight: tokens.touchTarget.min,
              }}
            >
              <input
                type="radio"
                name={groupName}
                checked={isSelected}
                onChange={() => setSelected(opt)}
                className="aurora-focusable"
                style={{
                  width: 18,
                  height: 18,
                  accentColor: c.primary,
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              />
              <span style={{ fontFamily: tokens.font.body, fontSize: 14, color: c.text }}>
                {opt}
              </span>
            </label>
          )
        })}
      </div>
    </div>
  )
}
