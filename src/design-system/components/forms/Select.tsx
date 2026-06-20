import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useThemeStore } from '@/stores/useThemeStore'
import { tokens } from '@/design-system/tokens'

interface SelectProps {
  label?: string
  options: string[]
  defaultValue?: string
}

export function Select({ label, options, defaultValue }: SelectProps) {
  const { c } = useThemeStore()
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(defaultValue ?? options[0])

  return (
    <div style={{ position: 'relative' }}>
      {label && (
        <label
          style={{
            display: 'block',
            fontFamily: tokens.font.body,
            fontSize: 13,
            fontWeight: 600,
            color: c.textMuted,
            marginBottom: 6,
          }}
        >
          {label}
        </label>
      )}
      <button
        onClick={() => setOpen(!open)}
        className="aurora-focusable"
        style={{
          width: '100%',
          background: c.bgDeep,
          border: `1.5px solid ${open ? c.primary : c.border}`,
          borderRadius: tokens.radius.sm,
          padding: '11px 14px',
          color: c.text,
          fontFamily: tokens.font.body,
          fontSize: 14,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          minHeight: tokens.touchTarget.min,
        }}
      >
        {selected}
        <ChevronDown
          size={15}
          color={c.textMuted}
          style={{
            transform: open ? 'rotate(180deg)' : 'none',
            transition: `transform ${tokens.motion.duration.fast} ${tokens.motion.easing.standard}`,
          }}
        />
      </button>
      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            right: 0,
            background: c.bgSurfaceRaised,
            border: `1px solid ${c.border}`,
            borderRadius: tokens.radius.sm,
            overflow: 'hidden',
            zIndex: tokens.zIndex.dropdown,
            boxShadow: c.shadowLg,
            animation: `fadeIn ${tokens.motion.duration.fast} ${tokens.motion.easing.standard}`,
          }}
        >
          {options.map((opt) => (
            <div
              key={opt}
              onClick={() => {
                setSelected(opt)
                setOpen(false)
              }}
              style={{
                padding: '10px 14px',
                fontSize: 13.5,
                fontFamily: tokens.font.body,
                cursor: 'pointer',
                color: opt === selected ? c.glow : c.text,
                background: opt === selected ? `${c.primary}22` : 'transparent',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = `${c.primary}33`)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background =
                  opt === selected ? `${c.primary}22` : 'transparent')
              }
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
