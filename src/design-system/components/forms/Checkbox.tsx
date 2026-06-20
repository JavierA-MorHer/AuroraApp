import { useState } from 'react'
import { Check } from 'lucide-react'
import { useThemeStore } from '@/stores/useThemeStore'
import { tokens } from '@/design-system/tokens'

interface CheckboxProps {
  label: string
  defaultChecked?: boolean
}

export function Checkbox({ label, defaultChecked = false }: CheckboxProps) {
  const { c } = useThemeStore()
  const [checked, setChecked] = useState(defaultChecked)

  return (
    <label
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        cursor: 'pointer',
        minHeight: tokens.touchTarget.min,
      }}
    >
      <div style={{ position: 'relative', width: 20, height: 20, flexShrink: 0 }}>
        <input
          type="checkbox"
          checked={checked}
          onChange={() => setChecked(!checked)}
          className="aurora-focusable"
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0,
            cursor: 'pointer',
            margin: 0,
          }}
        />
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: 6,
            background: checked
              ? `linear-gradient(135deg, ${c.primary}, ${c.secondary})`
              : 'transparent',
            border: `1.5px solid ${checked ? c.primary : c.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: `all ${tokens.motion.duration.fast} ${tokens.motion.easing.standard}`,
            pointerEvents: 'none',
          }}
        >
          {checked && <Check size={13} color="#fff" strokeWidth={3} />}
        </div>
      </div>
      <span style={{ fontFamily: tokens.font.body, fontSize: 14, color: c.text }}>{label}</span>
    </label>
  )
}
