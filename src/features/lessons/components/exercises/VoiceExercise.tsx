import { useState, useEffect, useRef } from 'react'
import { Mic, MicOff, RefreshCw } from 'lucide-react'
import { useThemeStore } from '@/stores/useThemeStore'
import { tokens } from '@/design-system'
import type { VoiceContent } from '../../types'

interface WordResult {
  word: string
  correct: boolean
}

interface Props {
  content: VoiceContent
  onTranscript: (transcript: string) => void
  feedback: 'none' | 'correct' | 'incorrect'
  transcript: string
}

function scoreWords(transcript: string, target: string): WordResult[] {
  const normalize = (s: string) => s.toLowerCase().replace(/[.,!?'"]/g, '').trim()
  const targetWords = normalize(target).split(/\s+/)
  const recWords = normalize(transcript).split(/\s+/)
  return targetWords.map((word) => ({
    word,
    correct: recWords.includes(word),
  }))
}

export function VoiceExercise({ content, onTranscript, feedback, transcript }: Props) {
  const { c } = useThemeStore()
  const [recordState, setRecordState] = useState<'idle' | 'recording' | 'done'>('idle')
  const [error, setError] = useState<string | null>(null)
  const recognitionRef = useRef<any>(null)

  const SpeechRec =
    typeof window !== 'undefined'
      ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      : null

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop()
    }
  }, [])

  const startRecording = () => {
    if (!SpeechRec) {
      setError('Tu navegador no soporta reconocimiento de voz. Usa Chrome.')
      return
    }
    setError(null)
    setRecordState('recording')

    const recognition = new SpeechRec()
    recognitionRef.current = recognition
    recognition.lang = 'en-US'
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onresult = (e: any) => {
      const text = e.results[0][0].transcript
      onTranscript(text)
      setRecordState('done')
    }

    recognition.onerror = () => {
      setRecordState('idle')
      setError('No se pudo capturar el audio. Intenta de nuevo.')
    }

    recognition.onend = () => {
      if (recordState === 'recording') setRecordState('idle')
    }

    recognition.start()
  }

  const stopRecording = () => {
    recognitionRef.current?.stop()
    setRecordState('idle')
  }

  const retry = () => {
    onTranscript('')
    setRecordState('idle')
    setError(null)
  }

  const wordResults = feedback !== 'none' && transcript ? scoreWords(transcript, content.target_phrase) : null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'center' }}>
      {/* Target phrase */}
      <div
        style={{
          background: c.bgSurfaceRaised,
          borderRadius: tokens.radius.lg,
          padding: '24px',
          textAlign: 'center',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <p
          style={{
            fontFamily: tokens.font.mono,
            fontSize: 11,
            color: c.textFaint,
            margin: '0 0 10px',
            textTransform: 'uppercase',
            letterSpacing: 1.5,
          }}
        >
          Di en voz alta:
        </p>
        <p
          style={{
            fontFamily: tokens.font.display,
            fontSize: 22,
            fontWeight: 700,
            color: c.text,
            margin: '0 0 8px',
            lineHeight: 1.3,
          }}
        >
          {content.target_phrase}
        </p>
        {content.tip && (
          <p
            style={{
              fontFamily: tokens.font.body,
              fontSize: 13,
              color: c.textFaint,
              margin: 0,
              fontStyle: 'italic',
            }}
          >
            {content.tip}
          </p>
        )}
      </div>

      {/* Mic button */}
      {feedback === 'none' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <button
            onClick={recordState === 'recording' ? stopRecording : startRecording}
            style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              border: 'none',
              background:
                recordState === 'recording'
                  ? `radial-gradient(circle, ${c.glow}, ${c.primary})`
                  : recordState === 'done'
                  ? `${c.success}33`
                  : c.bgSurfaceRaised,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow:
                recordState === 'recording'
                  ? `0 0 0 8px ${c.primary}22, 0 0 24px ${c.glow}66`
                  : c.shadowSm,
              transition: `all ${tokens.motion.duration.normal} ease`,
            }}
          >
            {recordState === 'recording' ? (
              <MicOff size={28} color="#fff" />
            ) : (
              <Mic size={28} color={recordState === 'done' ? c.success : c.textMuted} />
            )}
          </button>
          <p style={{ fontFamily: tokens.font.body, fontSize: 13, color: c.textFaint, margin: 0 }}>
            {recordState === 'recording'
              ? 'Escuchando... (toca para detener)'
              : recordState === 'done'
              ? 'Grabado'
              : 'Toca para hablar'}
          </p>
        </div>
      )}

      {/* Transcript preview */}
      {transcript && feedback === 'none' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexDirection: 'column' }}>
          <p
            style={{
              fontFamily: tokens.font.body,
              fontSize: 15,
              color: c.textMuted,
              margin: 0,
              fontStyle: 'italic',
            }}
          >
            "{transcript}"
          </p>
          <button
            onClick={retry}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'none',
              border: 'none',
              color: c.primary,
              fontFamily: tokens.font.body,
              fontSize: 13,
              cursor: 'pointer',
              padding: '4px 0',
            }}
          >
            <RefreshCw size={13} />
            Intentar de nuevo
          </button>
        </div>
      )}

      {/* Feedback: word-by-word */}
      {wordResults && (
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontFamily: tokens.font.mono, fontSize: 11, color: c.textFaint, margin: '0 0 10px', letterSpacing: 1, textTransform: 'uppercase' }}>
            Tu pronunciación:
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
            {wordResults.map((w, i) => (
              <span
                key={i}
                style={{
                  fontFamily: tokens.font.display,
                  fontSize: 18,
                  fontWeight: 600,
                  color: w.correct ? c.success : (c.danger),
                  padding: '2px 6px',
                  borderRadius: tokens.radius.sm,
                  background: w.correct ? `${c.success}15` : `${c.danger}15`,
                }}
              >
                {w.word}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <p style={{ fontFamily: tokens.font.body, fontSize: 13, color: c.danger, margin: 0, textAlign: 'center' }}>
          {error}
        </p>
      )}

      {/* No SpeechRecognition fallback */}
      {!SpeechRec && !error && (
        <p style={{ fontFamily: tokens.font.body, fontSize: 13, color: c.textMuted, margin: 0, textAlign: 'center' }}>
          Reconocimiento de voz no disponible en este navegador.
        </p>
      )}
    </div>
  )
}
