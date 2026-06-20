import { useState } from 'react'
import type { ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'
import { useThemeStore } from '@/stores/useThemeStore'
import { tokens } from '@/design-system/tokens'

interface AccordionItem {
  title: string
  content: ReactNode
}

interface AccordionProps {
  items: AccordionItem[]
}

export function Accordion({ items }: AccordionProps) {
  const { c } = useThemeStore()
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {items.map((item, i) => {
        const isOpen = openIndex === i
        return (
          <div
            key={i}
            style={{
              background: c.bgSurface,
              border: `1px solid ${c.border}`,
              borderRadius: tokens.radius.md,
              overflow: 'hidden',
            }}
          >
            <button
              onClick={() => setOpenIndex(isOpen ? -1 : i)}
              className="aurora-focusable"
              aria-expanded={isOpen}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '14px 16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontFamily: tokens.font.body,
                fontSize: 14,
                fontWeight: 600,
                color: c.text,
                minHeight: tokens.touchTarget.min,
              }}
            >
              {item.title}
              <ChevronDown
                size={16}
                color={c.textMuted}
                style={{
                  transform: isOpen ? 'rotate(180deg)' : 'none',
                  transition: `transform ${tokens.motion.duration.fast} ${tokens.motion.easing.standard}`,
                }}
              />
            </button>
            {isOpen && (
              <div
                style={{
                  padding: '0 16px 16px',
                  fontSize: 13,
                  color: c.textMuted,
                  lineHeight: 1.6,
                  animation: `fadeIn ${tokens.motion.duration.fast} ${tokens.motion.easing.standard}`,
                }}
              >
                {item.content}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
