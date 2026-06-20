import { useState } from 'react'
import type { ReactNode } from 'react'
import { useThemeStore } from '@/stores/useThemeStore'
import { tokens } from '@/design-system/tokens'

interface TabItem {
  value: string
  label: string
  content: ReactNode
}

interface TabsProps {
  items: TabItem[]
  defaultValue?: string
}

export function Tabs({ items, defaultValue }: TabsProps) {
  const { c } = useThemeStore()
  const [active, setActive] = useState(defaultValue ?? items[0]?.value)
  const activeItem = items.find((i) => i.value === active)

  return (
    <div>
      <div
        style={{
          display: 'flex',
          gap: 4,
          background: c.bgDeep,
          padding: 4,
          borderRadius: tokens.radius.full,
          width: 'fit-content',
          marginBottom: 18,
        }}
      >
        {items.map((item) => (
          <button
            key={item.value}
            onClick={() => setActive(item.value)}
            className="aurora-focusable"
            aria-selected={active === item.value}
            style={{
              fontFamily: tokens.font.body,
              fontSize: 13,
              fontWeight: 600,
              padding: '7px 16px',
              borderRadius: tokens.radius.full,
              border: 'none',
              cursor: 'pointer',
              background: active === item.value ? c.primary : 'transparent',
              color: active === item.value ? '#fff' : c.textMuted,
              transition: `all ${tokens.motion.duration.fast} ${tokens.motion.easing.standard}`,
              whiteSpace: 'nowrap',
              minHeight: 36,
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div style={{ fontSize: 13.5, color: c.textMuted, lineHeight: 1.6 }}>
        {activeItem?.content}
      </div>
    </div>
  )
}
