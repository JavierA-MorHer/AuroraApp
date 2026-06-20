import { useState } from 'react'
import { useThemeStore } from '@/stores/useThemeStore'
import { tokens } from '@/design-system/tokens'

interface SwitchProps {
  label?: string
  defaultChecked?: boolean
}

export function Switch({ label, defaultChecked = false }: SwitchProps) {
  const { c } = useThemeStore()
  const [checked, setChecked] = useState(defaultChecked)

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
      }}
    >
      {label && (
        <span style={{ fontFamily: tokens.font.body, fontSize: 14, color: c.text }}>{label}</span>
      )}
      <button
        onClick={() => setChecked(!checked)}
        className="aurora-focusable"
        aria-pressed={checked}
        style={{
          width: 42,
          height: 24,
          borderRadius: tokens.radius.full,
          border: 'none',
          cursor: 'pointer',
          background: checked
            ? `linear-gradient(135deg, ${c.primary}, ${c.secondary})`
            : c.bgSurfaceRaised,
          position: 'relative',
          transition: `background ${tokens.motion.duration.fast} ${tokens.motion.easing.standard}`,
          flexShrink: 0,
          boxShadow: checked ? `0 0 10px ${c.primary}66` : 'none',
        }}
      >
        <div
          style={{
            width: 18,
            height: 18,
            borderRadius: '50%',
            background: '#fff',
            position: 'absolute',
            top: 3,
            left: checked ? 21 : 3,
            transition: `left ${tokens.motion.duration.fast} ${tokens.motion.easing.standard}`,
            boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
          }}
        />
      </button>
    </div>
  )
}
