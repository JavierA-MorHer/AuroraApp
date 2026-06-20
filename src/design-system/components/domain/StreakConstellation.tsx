import { Flame, Star } from 'lucide-react'
import { useThemeStore } from '@/stores/useThemeStore'
import { tokens } from '@/design-system/tokens'
import { Starfield } from '../layout/Starfield'

interface StreakConstellationProps {
  lit?: number
  total?: number
}

const DAY_LABELS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'] as const

export function StreakConstellation({ lit = 4, total = 7 }: StreakConstellationProps) {
  const { mode, c } = useThemeStore()

  return (
    <div
      style={{
        background: `linear-gradient(135deg, ${c.bgSurface}, ${c.bgSurfaceRaised})`,
        border: `1px solid ${c.border}`,
        borderRadius: tokens.radius.lg,
        padding: 24,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Starfield density={18} />
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 18,
        }}
      >
        <div>
          <div
            style={{
              fontFamily: tokens.font.mono,
              fontSize: tokens.fontSize.sm,
              color: c.textMuted,
              letterSpacing: tokens.letterSpacing.normal,
              textTransform: 'uppercase',
            }}
          >
            Racha actual
          </div>
          <div
            style={{
              fontFamily: tokens.font.display,
              fontSize: tokens.fontSize['5xl'],
              fontWeight: tokens.fontWeight.semibold,
              color: c.text,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            {lit} días <Flame size={22} color={c.glow} fill={c.glow} />
          </div>
        </div>
      </div>
      <div
        style={{
          position: 'relative',
          display: 'flex',
          gap: 10,
          justifyContent: 'space-between',
        }}
      >
        {Array.from({ length: total }).map((_, i) => {
          const isLit = i < lit
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
                flex: 1,
              }}
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: isLit
                    ? `radial-gradient(circle, ${c.glow}, ${c.primary})`
                    : mode === 'dark'
                    ? 'rgba(255,255,255,0.05)'
                    : 'rgba(184,47,194,0.06)',
                  border: isLit ? 'none' : `1px dashed ${c.textFaint}`,
                  boxShadow: isLit ? `0 0 16px ${c.glow}99, 0 0 4px ${c.glow}` : 'none',
                  transition: 'all 0.4s ease',
                }}
              >
                <Star
                  size={16}
                  color={isLit ? '#FFFFFF' : c.textFaint}
                  fill={isLit ? '#FFFFFF' : 'none'}
                />
              </div>
              <span
                style={{
                  fontFamily: tokens.font.mono,
                  fontSize: tokens.fontSize['2xs'],
                  color: isLit ? c.text : c.textFaint,
                }}
              >
                {DAY_LABELS[i]}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
