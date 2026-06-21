import { Flame } from 'lucide-react'
import { useThemeStore } from '@/stores/useThemeStore'
import { Avatar, tokens } from '@/design-system'

interface TopBarProps {
  initials: string
  name: string
  streak: number
}

export function TopBar({ initials, name, streak }: TopBarProps) {
  const { c } = useThemeStore()

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: tokens.zIndex.sticky,
        background: c.bgSurface,
        borderBottom: `1px solid ${c.border}`,
        paddingTop: 'env(safe-area-inset-top)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 20px',
          maxWidth: tokens.container.sm,
          margin: '0 auto',
        }}
      >
        {/* Avatar + nombre */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Avatar initials={initials} size={38} online />
          <div>
            <p
              style={{
                fontFamily: tokens.font.body,
                fontSize: 11,
                color: c.textFaint,
                margin: 0,
                lineHeight: 1,
              }}
            >
              Bienvenida,
            </p>
            <p
              style={{
                fontFamily: tokens.font.display,
                fontSize: 15,
                fontWeight: 600,
                color: c.text,
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              {name}
            </p>
          </div>
        </div>

        {/* Racha */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            background: c.bgSurfaceRaised,
            border: `1px solid ${c.border}`,
            borderRadius: tokens.radius.full,
            padding: '6px 12px',
          }}
        >
          <Flame size={15} color={c.glow} fill={c.glow} />
          <span
            style={{
              fontFamily: tokens.font.mono,
              fontSize: 13,
              fontWeight: 600,
              color: c.text,
            }}
          >
            {streak} días
          </span>
        </div>
      </div>
    </header>
  )
}
