import { useState } from 'react'
import { Volume2 } from 'lucide-react'
import { useThemeStore } from '@/stores/useThemeStore'
import { tokens } from '@/design-system/tokens'

interface WordCardProps {
  word: string
  translation: string
  example: string
}

export function WordCard({ word, translation, example }: WordCardProps) {
  const { c } = useThemeStore()
  const [flipped, setFlipped] = useState(false)

  const flip = () => setFlipped((f) => !f)

  return (
    <div
      onClick={flip}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          flip()
        }
      }}
      role="button"
      tabIndex={0}
      aria-pressed={flipped}
      aria-label={
        flipped
          ? `${word}: ${translation}. ${example}`
          : `${word}. Toca para traducir`
      }
      className="aurora-focusable"
      style={{
        background: flipped
          ? `linear-gradient(135deg, ${c.secondary}, ${c.primary})`
          : c.bgSurface,
        border: `1px solid ${c.border}`,
        borderRadius: tokens.radius.lg,
        padding: 24,
        cursor: 'pointer',
        minHeight: 120,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        transition: `background ${tokens.motion.duration.base} ${tokens.motion.easing.standard}`,
      }}
    >
      {!flipped ? (
        <>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span
              style={{
                fontFamily: tokens.font.display,
                fontSize: 26,
                fontWeight: 600,
                color: c.text,
              }}
            >
              {word}
            </span>
            <Volume2 size={18} color={c.textMuted} />
          </div>
          <span
            style={{
              fontFamily: tokens.font.mono,
              fontSize: 11,
              color: c.textFaint,
              marginTop: 6,
            }}
          >
            toca para traducir
          </span>
        </>
      ) : (
        <>
          <span
            style={{
              fontFamily: tokens.font.display,
              fontSize: 24,
              fontWeight: 600,
              color: '#fff',
            }}
          >
            {translation}
          </span>
          <span
            style={{
              fontFamily: tokens.font.body,
              fontSize: 13,
              color: '#ffffffcc',
              marginTop: 8,
              fontStyle: 'italic',
            }}
          >
            "{example}"
          </span>
        </>
      )}
    </div>
  )
}
