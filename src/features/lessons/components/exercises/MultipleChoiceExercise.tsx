import { useThemeStore } from '@/stores/useThemeStore'
import { tokens } from '@/design-system'
import type { MultipleChoiceContent } from '../../types'
import { CheckCircle, XCircle } from 'lucide-react'

interface Props {
  content: MultipleChoiceContent
  selected: string | null
  onSelect: (option: string) => void
  feedback: 'none' | 'correct' | 'incorrect'
}

export function MultipleChoiceExercise({ content, selected, onSelect, feedback }: Props) {
  const { c } = useThemeStore()

  const getOptionStyle = (option: string) => {
    const isSelected = selected === option
    const isCorrect = option === content.answer

    if (feedback !== 'none') {
      if (isCorrect) {
        return {
          background: `${c.success}22`,
          border: `2px solid ${c.success}`,
          color: c.text,
        }
      }
      if (isSelected && !isCorrect) {
        return {
          background: `${c.danger}22`,
          border: `2px solid ${c.danger}`,
          color: c.text,
        }
      }
      return {
        background: c.bgSurface,
        border: `1px solid ${c.border}`,
        color: c.textMuted,
        opacity: 0.5,
      }
    }

    if (isSelected) {
      return {
        background: `${c.primary}22`,
        border: `2px solid ${c.primary}`,
        color: c.text,
      }
    }

    return {
      background: c.bgSurface,
      border: `1px solid ${c.border}`,
      color: c.text,
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Question */}
      <div
        style={{
          background: c.bgSurfaceRaised,
          borderRadius: tokens.radius.lg,
          padding: '20px 24px',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontFamily: tokens.font.display,
            fontSize: 20,
            fontWeight: 600,
            color: c.text,
            margin: 0,
            lineHeight: 1.4,
          }}
        >
          {content.question}
        </p>
      </div>

      {/* Translation */}
      {content.translation && (
        <p style={{
          fontFamily: tokens.font.body,
          fontSize: 13,
          color: c.textFaint,
          margin: '-8px 0 0',
          textAlign: 'center',
          fontStyle: 'italic',
        }}>
          🇲🇽 {content.translation}
        </p>
      )}

      {/* Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {content.options.map((option) => {
          const isCorrect = option === content.answer
          const isSelected = selected === option
          const style = getOptionStyle(option)

          return (
            <button
              key={option}
              onClick={() => feedback === 'none' && onSelect(option)}
              disabled={feedback !== 'none'}
              style={{
                ...style,
                borderRadius: tokens.radius.md,
                padding: '14px 18px',
                fontFamily: tokens.font.body,
                fontSize: 16,
                cursor: feedback !== 'none' ? 'default' : 'pointer',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 10,
                transition: `all ${tokens.motion.duration.fast} ease`,
              }}
            >
              <span>{option}</span>
              {feedback !== 'none' && isCorrect && (
                <CheckCircle size={18} color={c.success} />
              )}
              {feedback !== 'none' && isSelected && !isCorrect && (
                <XCircle size={18} color={c.danger} />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
