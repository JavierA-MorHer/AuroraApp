import type { ReactNode } from 'react'
import { tokens } from '@/design-system/tokens'

interface ContainerProps {
  children: ReactNode
  size?: keyof typeof tokens.container
}

export function Container({ children, size = 'lg' }: ContainerProps) {
  return (
    <div style={{ maxWidth: tokens.container[size], margin: '0 auto', width: '100%' }}>
      {children}
    </div>
  )
}
