import { useState, useCallback } from 'react'
import { Volume2, Loader } from 'lucide-react'
import { useThemeStore } from '@/stores/useThemeStore'
import { tokens } from '@/design-system/tokens'

interface WordCardProps {
  word: string
  translation: string
  example: string
  exampleEs?: string
  partOfSpeech?: string
  phonetic?: string | null
}

export function WordCard({ word, translation, example, exampleEs, partOfSpeech, phonetic }: WordCardProps) {
  const { c } = useThemeStore()
  const [flipped, setFlipped] = useState(false)
  const [speaking, setSpeaking] = useState(false)

  const flip = () => setFlipped((f) => !f)

  const speak = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    if (!window.speechSynthesis || speaking) return

    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(word)
    u.lang = 'en-US'
    u.rate = 0.85
    u.onstart = () => setSpeaking(true)
    u.onend = () => setSpeaking(false)
    u.onerror = () => setSpeaking(false)
    window.speechSynthesis.speak(u)
  }, [word, speaking])

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
      aria-label={flipped ? `${word}: ${translation}. ${example}` : `${word}. Toca para traducir`}
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
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <span
                style={{
                  fontFamily: tokens.font.display,
                  fontSize: tokens.fontSize['4xl'],
                  fontWeight: tokens.fontWeight.semibold,
                  color: c.text,
                  display: 'block',
                }}
              >
                {word}
              </span>
              {phonetic && (
                <span
                  style={{
                    fontFamily: tokens.font.mono,
                    fontSize: tokens.fontSize.xs,
                    color: c.textFaint,
                    display: 'block',
                    marginTop: 2,
                  }}
                >
                  /{phonetic}/
                </span>
              )}
              {partOfSpeech && (
                <span
                  style={{
                    fontFamily: tokens.font.mono,
                    fontSize: tokens.fontSize.xs,
                    color: c.primary,
                    display: 'block',
                    marginTop: 4,
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                  }}
                >
                  {partOfSpeech}
                </span>
              )}
            </div>

            <button
              onClick={speak}
              aria-label={`Escuchar pronunciación de ${word}`}
              style={{
                background: speaking ? `${c.primary}22` : 'none',
                border: 'none',
                cursor: speaking ? 'default' : 'pointer',
                padding: 8,
                borderRadius: tokens.radius.sm,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: speaking ? c.primary : c.textMuted,
                flexShrink: 0,
                transition: `color ${tokens.motion.duration.fast} ease`,
              }}
            >
              {speaking
                ? <Loader size={18} style={{ animation: 'spin 1s linear infinite' }} />
                : <Volume2 size={18} />
              }
            </button>
          </div>

          <span
            style={{
              fontFamily: tokens.font.mono,
              fontSize: tokens.fontSize.xs,
              color: c.textFaint,
              marginTop: 10,
            }}
          >
            toca para traducir
          </span>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </>
      ) : (
        <>
          <span
            style={{
              fontFamily: tokens.font.display,
              fontSize: tokens.fontSize['4xl'],
              fontWeight: tokens.fontWeight.semibold,
              color: '#fff',
              display: 'block',
            }}
          >
            {translation}
          </span>
          <span
            style={{
              fontFamily: tokens.font.body,
              fontSize: tokens.fontSize.md,
              color: '#ffffffcc',
              marginTop: 8,
              fontStyle: 'italic',
              display: 'block',
            }}
          >
            "{example}"
          </span>
          {exampleEs && (
            <span
              style={{
                fontFamily: tokens.font.body,
                fontSize: tokens.fontSize.sm,
                color: '#ffffff88',
                marginTop: 4,
                display: 'block',
              }}
            >
              {exampleEs}
            </span>
          )}
        </>
      )}
    </div>
  )
}
