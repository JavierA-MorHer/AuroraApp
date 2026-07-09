import { useRef, useEffect, useState } from 'react'
import { Volume2, Loader } from 'lucide-react'
import { useThemeStore } from '@/stores/useThemeStore'
import { tokens } from '@/design-system'
import type { DictationContent } from '../../types'
import { CheckCircle, XCircle } from 'lucide-react'

interface Props {
  content: DictationContent
  value: string
  onChange: (val: string) => void
  feedback: 'none' | 'correct' | 'incorrect'
}

export function DictationExercise({ content, value, onChange, feedback }: Props) {
  const { c } = useThemeStore()
  const inputRef = useRef<HTMLInputElement>(null)
  const [speaking, setSpeaking] = useState(false)

  useEffect(() => {
    if (feedback === 'none') inputRef.current?.focus()
  }, [feedback])

  // Auto-speak on mount
  useEffect(() => {
    speak()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const speak = () => {
    if (!window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(content.audio_text)
    u.lang = 'en-US'
    u.rate = 0.8
    u.pitch = 1
    u.onstart = () => setSpeaking(true)
    u.onend = () => setSpeaking(false)
    u.onerror = () => setSpeaking(false)
    window.speechSynthesis.speak(u)
  }

  const borderColor =
    feedback === 'correct' ? c.success
    : feedback === 'incorrect' ? (c.danger)
    : value ? c.primary
    : c.border

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'center' }}>
      {/* Instruction */}
      <div
        style={{
          background: c.bgSurfaceRaised,
          borderRadius: tokens.radius.lg,
          padding: '20px 24px',
          textAlign: 'center',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <p
          style={{
            fontFamily: tokens.font.body,
            fontSize: 15,
            color: c.textMuted,
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          {content.prompt}
        </p>
      </div>

      {/* Speaker button */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
        <button
          onClick={speak}
          disabled={speaking}
          style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            border: 'none',
            background: speaking
              ? `radial-gradient(circle, ${c.glow}, ${c.primary})`
              : c.bgSurfaceRaised,
            cursor: speaking ? 'default' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: speaking
              ? `0 0 0 8px ${c.primary}22, 0 0 24px ${c.glow}55`
              : c.shadowSm,
            transition: `all ${tokens.motion.duration.base} ease`,
          }}
        >
          {speaking ? (
            <Loader size={26} color="#fff" style={{ animation: 'spin 1s linear infinite' }} />
          ) : (
            <Volume2 size={26} color={c.glow} />
          )}
        </button>
        <p style={{ fontFamily: tokens.font.body, fontSize: 13, color: c.textFaint, margin: 0 }}>
          {speaking ? 'Reproduciendo...' : 'Toca para escuchar otra vez'}
        </p>
      </div>

      {/* Input */}
      <div style={{ position: 'relative', width: '100%' }}>
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => feedback === 'none' && onChange(e.target.value)}
          disabled={feedback !== 'none'}
          placeholder="Escribe lo que escuchaste..."
          style={{
            width: '100%',
            padding: '14px 48px 14px 16px',
            background: c.bgSurface,
            border: `2px solid ${borderColor}`,
            borderRadius: tokens.radius.md,
            fontFamily: tokens.font.body,
            fontSize: 16,
            color: c.text,
            outline: 'none',
            boxSizing: 'border-box',
            transition: `border-color ${tokens.motion.duration.fast} ease`,
          }}
        />
        {feedback === 'correct' && (
          <CheckCircle
            size={20}
            color={c.success}
            style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)' }}
          />
        )}
        {feedback === 'incorrect' && (
          <XCircle
            size={20}
            color={c.danger}
            style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)' }}
          />
        )}
      </div>

      {/* Correct answer reveal */}
      {feedback === 'incorrect' && (
        <p
          style={{
            fontFamily: tokens.font.body,
            fontSize: 14,
            color: c.success,
            margin: 0,
            textAlign: 'center',
          }}
        >
          La frase era: <strong>{content.audio_text}</strong>
        </p>
      )}

      {/* Spin animation */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
