import { useThemeStore } from '@/stores/useThemeStore'
import { tokens } from '@/design-system/tokens'
import { Card } from '../primitives/Card'

interface SkeletonProps {
  width?: number | string
  height?: number | string
  radius?: string
}

export function Skeleton({ width = '100%', height = 16, radius }: SkeletonProps) {
  const { c } = useThemeStore()

  return (
    <div
      style={{
        width,
        height,
        borderRadius: radius ?? tokens.radius.sm,
        background: `linear-gradient(90deg, ${c.bgSurfaceRaised} 0%, ${c.glowSoft} 50%, ${c.bgSurfaceRaised} 100%)`,
        backgroundSize: '200% 100%',
        animation: 'skeletonShimmer 1.5s ease-in-out infinite',
      }}
    />
  )
}

export function SkeletonCard() {
  return (
    <Card>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <Skeleton width={40} height={40} radius="50%" />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Skeleton width="60%" height={12} />
          <Skeleton width="40%" height={10} />
        </div>
      </div>
      <Skeleton width="100%" height={10} />
      <div style={{ marginTop: 6 }}>
        <Skeleton width="80%" height={10} />
      </div>
    </Card>
  )
}
