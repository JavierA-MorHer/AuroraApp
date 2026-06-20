import { useState } from 'react'
import { useThemeStore } from '@/stores/useThemeStore'
import { tokens } from '@/design-system/tokens'

interface SliderProps {
  label?: string
  min?: number
  max?: number
  defaultValue?: number
  unit?: string
}

export function Slider({ label, min = 0, max = 100, defaultValue = 50, unit = '' }: SliderProps) {
  const { c } = useThemeStore()
  const [value, setValue] = useState(defaultValue)
  const pct = ((value - min) / (max - min)) * 100

  return (
    <div>
      {label && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span
            style={{ fontFamily: tokens.font.body, fontSize: 13, fontWeight: 600, color: c.textMuted }}
          >
            {label}
          </span>
          <span style={{ fontFamily: tokens.font.mono, fontSize: 12, color: c.glow }}>
            {value}
            {unit}
          </span>
        </div>
      )}
      <div style={{ position: 'relative', height: 24, display: 'flex', alignItems: 'center' }}>
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: 6,
            borderRadius: tokens.radius.full,
            background: c.bgDeep,
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: `${pct}%`,
            height: 6,
            borderRadius: tokens.radius.full,
            background: `linear-gradient(90deg, ${c.secondary}, ${c.glow})`,
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          className="aurora-focusable"
          style={{
            position: 'relative',
            width: '100%',
            height: 24,
            margin: 0,
            background: 'transparent',
            appearance: 'none',
            cursor: 'pointer',
          }}
        />
      </div>
      <style>{`
        input[type=range]::-webkit-slider-thumb {
          appearance: none; width: 20px; height: 20px; border-radius: 50%;
          background: ${c.glow}; box-shadow: 0 0 10px ${c.glow}aa, 0 1px 3px rgba(0,0,0,0.3);
          cursor: pointer; border: 2px solid #fff;
        }
        input[type=range]::-moz-range-thumb {
          width: 20px; height: 20px; border-radius: 50%; border: 2px solid #fff;
          background: ${c.glow}; box-shadow: 0 0 10px ${c.glow}aa; cursor: pointer;
        }
      `}</style>
    </div>
  )
}
