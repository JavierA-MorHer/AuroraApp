import { tokens } from '@/design-system/tokens'

interface SpacerProps {
  size?: number | string
  axis?: 'vertical' | 'horizontal'
}

export function Spacer({ size = 6, axis = 'vertical' }: SpacerProps) {
  const px = typeof size === 'number' ? tokens.space[size] : size

  return (
    <div
      style={{
        [axis === 'vertical' ? 'height' : 'width']: px,
        flexShrink: 0,
      }}
    />
  )
}
