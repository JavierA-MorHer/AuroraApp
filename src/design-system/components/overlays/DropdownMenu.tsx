import { useState, useRef, useEffect } from 'react'
import type { LucideIcon } from 'lucide-react'
import { MoreVertical } from 'lucide-react'
import { useThemeStore } from '@/stores/useThemeStore'
import { tokens } from '@/design-system/tokens'

interface DropdownItem {
  label: string
  icon?: LucideIcon
  onClick?: () => void
  danger?: boolean
}

interface DropdownMenuProps {
  items: DropdownItem[]
}

export function DropdownMenu({ items }: DropdownMenuProps) {
  const { c } = useThemeStore()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: c.textMuted,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: tokens.touchTarget.min,
          height: tokens.touchTarget.min,
          borderRadius: tokens.radius.full,
          transition: `background ${tokens.motion.duration.fast} ${tokens.motion.easing.standard}`,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = c.glowSoft)}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
      >
        <MoreVertical size={18} />
      </button>
      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            right: 0,
            background: c.bgSurfaceRaised,
            border: `1px solid ${c.border}`,
            borderRadius: tokens.radius.sm,
            overflow: 'hidden',
            zIndex: tokens.zIndex.dropdown,
            minWidth: 160,
            boxShadow: c.shadowLg,
            animation: `fadeIn ${tokens.motion.duration.fast} ${tokens.motion.easing.standard}`,
          }}
        >
          {items.map((item, i) => (
            <div
              key={i}
              onClick={() => {
                item.onClick?.()
                setOpen(false)
              }}
              style={{
                padding: '10px 14px',
                fontSize: 13.5,
                fontFamily: tokens.font.body,
                cursor: 'pointer',
                color: item.danger ? c.danger : c.text,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = `${c.primary}22`)
              }
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              {item.icon && <item.icon size={14} />}
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
