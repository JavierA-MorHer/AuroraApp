import type { CSSProperties, ReactNode } from 'react'
import { tokens } from '@/design-system/tokens'

interface StackProps {
  children: ReactNode
  direction?: 'vertical' | 'horizontal'
  gap?: number | string
  align?: CSSProperties['alignItems']
  justify?: CSSProperties['justifyContent']
  wrap?: boolean
}

export function Stack({
  children,
  direction = 'vertical',
  gap = 3,
  align,
  justify,
  wrap = false,
}: StackProps) {
  const gapPx = typeof gap === 'number' ? tokens.space[gap] : gap

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: direction === 'horizontal' ? 'row' : 'column',
        gap: gapPx,
        alignItems: align,
        justifyContent: justify,
        flexWrap: wrap ? 'wrap' : 'nowrap',
      }}
    >
      {children}
    </div>
  )
}
