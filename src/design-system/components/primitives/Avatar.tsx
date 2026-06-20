import { useThemeStore } from '@/stores/useThemeStore'
import { tokens } from '@/design-system/tokens'

interface AvatarProps {
  initials: string
  size?: number
  online?: boolean
}

export function Avatar({ initials, size = 40, online = false }: AvatarProps) {
  const { c } = useThemeStore()

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${c.secondary}, ${c.primary})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: tokens.font.display,
          fontWeight: 600,
          color: '#fff',
          fontSize: size * 0.38,
        }}
      >
        {initials}
      </div>
      {online && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: size * 0.28,
            height: size * 0.28,
            borderRadius: '50%',
            background: c.success,
            border: `2px solid ${c.bgSurface}`,
          }}
        />
      )}
    </div>
  )
}
