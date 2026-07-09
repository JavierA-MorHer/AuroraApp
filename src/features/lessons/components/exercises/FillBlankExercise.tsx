import { useRef, useEffect } from 'react'
import { useThemeStore } from '@/stores/useThemeStore'
import { tokens } from '@/design-system'
import type { FillBlankContent } from '../../types'
import { CheckCircle, XCircle } from 'lucide-react'

interface Props {
  content: FillBlankContent
  value: string
  onChange: (val: string) => void
  feedback: 'none' | 'correct' | 'incorrect'
}

export function FillBlankExercise({ content, value, onChange, feedback }: Props) {
  const { c } = useThemeStore()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (feedback === 'none') inputRef.current?.focus()
  }, [feedback])

  const [before, after] = content.sentence.split('___')

  const borderColor =
    feedback === 'correct' ? c.success
    : feedback === 'incorrect' ? (c.danger)
    : value ? c.primary
    : c.border

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Sentence with inline blank */}
      <div
        style={{
          background: c.bgSurfaceRaised,
          borderRadius: tokens.radius.lg,
          padding: '24px',
          textAlign: 'center',
          lineHeight: 2,
        }}
      >
        <span
          style={{
            fontFamily: tokens.font.display,
            fontSize: 20,
            fontWeight: 500,
            color: c.text,
          }}
        >
          {before}
        </span>
        <span
          style={{
            display: 'inline-block',
            minWidth: 80,
            borderBottom: `2px solid ${borderColor}`,
            padding: '0 8px',
            marginBottom: -2,
            fontFamily: tokens.font.display,
            fontSize: 20,
            fontWeight: 700,
            color: feedback === 'correct' ? c.success : feedback === 'incorrect' ? (c.danger) : c.primary,
            textAlign: 'center',
          }}
        >
          {feedback !== 'none' ? content.answer : (value || '   ')}
        </span>
        <span
          style={{
            fontFamily: tokens.font.display,
            fontSize: 20,
            fontWeight: 500,
            color: c.text,
          }}
        >
          {after}
        </span>
      </div>

      {/* Translation */}
      {content.translation && (
        <p style={{
          fontFamily: tokens.font.body,
          fontSize: 13,
          color: c.textFaint,
          margin: '-16px 0 0',
          textAlign: 'center',
          fontStyle: 'italic',
        }}>
          🇲🇽 {content.translation}
        </p>
      )}

      {/* Hint */}
      {content.hint && (
        <p
          style={{
            fontFamily: tokens.font.mono,
            fontSize: 12,
            color: c.textFaint,
            margin: 0,
            textAlign: 'center',
            fontStyle: 'italic',
          }}
        >
          Pista: {content.hint}
        </p>
      )}

      {/* Input */}
      <div style={{ position: 'relative' }}>
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => feedback === 'none' && onChange(e.target.value)}
          disabled={feedback !== 'none'}
          placeholder="Escribe tu respuesta..."
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

      {/* Show correct answer when wrong */}
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
          La respuesta correcta es: <strong>{content.answer}</strong>
        </p>
      )}
    </div>
  )
}
