import { Flame, Sparkles } from 'lucide-react'
import { useThemeStore } from '@/stores/useThemeStore'
import { Avatar, tokens } from '@/design-system'

interface TopBarProps {
  initials: string
  avatarUrl?: string | null
  name: string
  gender: 'male' | 'female' | null
  streak: number
  level?: number
  totalXp?: number
}

export function TopBar({ initials, avatarUrl, name, gender, streak, level = 1, totalXp }: TopBarProps) {
  const greeting = gender === 'male' ? 'Bienvenido,' : gender === 'female' ? 'Bienvenida,' : 'Bienvenid@,'
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Avatar initials={initials} src={avatarUrl} size={38} online />
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
              {greeting}
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

        {/* Indicadores: Nivel y Racha */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Nivel */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              background: `${c.glow}11`,
              border: `1px solid ${c.glow}33`,
              borderRadius: tokens.radius.full,
              padding: '6px 12px',
            }}
            title={`Nivel ${level} (${totalXp || 0} XP totales)`}
          >
            <Sparkles size={13} color={c.glow} />
            <span
              style={{
                fontFamily: tokens.font.display,
                fontSize: 13,
                fontWeight: 600,
                color: c.glow,
              }}
            >
              Lvl {level}
            </span>
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
              {streak} {streak === 1 ? 'día' : 'días'}
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
