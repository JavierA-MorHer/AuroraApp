import { useState } from 'react'
import type { ReactNode } from 'react'
import { useThemeStore } from '@/stores/useThemeStore'
import { tokens } from '@/design-system/tokens'

interface TooltipProps {
  children: ReactNode
  label: string
}

export function Tooltip({ children, label }: TooltipProps) {
  const { c } = useThemeStore()
  const [show, setShow] = useState(false)

  return (
    <div
      style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div
          style={{
            position: 'absolute',
            bottom: 'calc(100% + 8px)',
            left: '50%',
            transform: 'translateX(-50%)',
            background: c.bgDeep,
            color: c.text,
            fontFamily: tokens.font.body,
            fontSize: 12,
            padding: '6px 10px',
            borderRadius: tokens.radius.sm,
            whiteSpace: 'nowrap',
            border: `1px solid ${c.border}`,
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            zIndex: tokens.zIndex.tooltip,
            animation: `fadeIn ${tokens.motion.duration.fast} ${tokens.motion.easing.standard}`,
          }}
        >
          {label}
        </div>
      )}
    </div>
  )
}
