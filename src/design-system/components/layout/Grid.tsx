import type { ReactNode } from 'react'
import { tokens } from '@/design-system/tokens'

interface GridProps {
  children: ReactNode
  columns?: number
  minColWidth?: number
  gap?: number | string
}

export function Grid({ children, columns, minColWidth = 200, gap = 3 }: GridProps) {
  const gapPx = typeof gap === 'number' ? tokens.space[gap] : gap

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: columns
          ? `repeat(${columns}, 1fr)`
          : `repeat(auto-fit, minmax(${minColWidth}px, 1fr))`,
        gap: gapPx,
      }}
    >
      {children}
    </div>
  )
}
