import { useState, useEffect, useRef } from 'react'
import { Mic, MicOff, RefreshCw, Languages, Lightbulb, Loader } from 'lucide-react'
import { useThemeStore } from '@/stores/useThemeStore'
import { tokens } from '@/design-system'
import type { VoiceContent } from '../../types'
import { supabase } from '@/lib/supabase'

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
  const [recordState, setRecordState] = useState<'idle' | 'recording' | 'transcribing' | 'done'>('idle')
  const [error, setError] = useState<string | null>(null)
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  const startRecording = async () => {
    setError(null)
    setRecordState('recording')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        await transcribeAudio(audioBlob)
      }

      mediaRecorder.start()
    } catch (err: any) {
      console.error('Error starting media recording:', err)
      setError('No se pudo acceder al micrófono. Por favor concede los permisos e intenta nuevamente.')
      setRecordState('idle')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && recordState === 'recording') {
      mediaRecorderRef.current.stop()
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
        streamRef.current = null
      }
    }
  }

  const transcribeAudio = async (blob: Blob) => {
    setRecordState('transcribing')
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const formData = new FormData()
      formData.append('file', blob, 'recording.webm')

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/openai-audio?action=stt`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session?.access_token || ''}`,
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY || '',
          },
          body: formData,
        }
      )

      if (!response.ok) {
        throw new Error('La transcripción con Whisper falló.')
      }

      const data = await response.json()
      const text = data.text || ''
      onTranscript(text)
      setRecordState('done')
    } catch (err) {
      console.error('STT Transcription error:', err)
      setError('Hubo un problema al procesar tu pronunciación.')
      setRecordState('idle')
    }
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
        {content.translation && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, margin: '4px 0 0' }}>
            <Languages size={13} color={c.textFaint} />
            <span style={{ fontFamily: tokens.font.body, fontSize: 13, color: c.textFaint, fontStyle: 'italic' }}>
              {content.translation}
            </span>
          </div>
        )}
        {content.tip && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, margin: '8px 0 0' }}>
            <Lightbulb size={13} color={c.textFaint} />
            <span style={{ fontFamily: tokens.font.body, fontSize: 13, color: c.textFaint, fontStyle: 'italic' }}>
              {content.tip}
            </span>
          </div>
        )}
      </div>

      {/* Mic button */}
      {feedback === 'none' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <button
            onClick={
              recordState === 'recording'
                ? stopRecording
                : recordState === 'transcribing'
                ? undefined
                : startRecording
            }
            disabled={recordState === 'transcribing'}
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
              cursor: recordState === 'transcribing' ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow:
                recordState === 'recording'
                  ? `0 0 0 8px ${c.primary}22, 0 0 24px ${c.glow}66`
                  : c.shadowSm,
              transition: `all ${tokens.motion.duration.base} ease`,
            }}
          >
            {recordState === 'recording' ? (
              <MicOff size={28} color="#fff" />
            ) : recordState === 'transcribing' ? (
              <Loader size={28} color={c.primary} style={{ animation: 'spin 1s linear infinite' }} />
            ) : (
              <Mic size={28} color={recordState === 'done' ? c.success : c.textMuted} />
            )}
          </button>
          <p style={{ fontFamily: tokens.font.body, fontSize: 13, color: c.textFaint, margin: 0 }}>
            {recordState === 'recording'
              ? 'Escuchando... (toca para detener)'
              : recordState === 'transcribing'
              ? 'Procesando tu voz...'
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

      {/* No Mic support fallback */}
      {typeof navigator !== 'undefined' && !navigator.mediaDevices?.getUserMedia && !error && (
        <p style={{ fontFamily: tokens.font.body, fontSize: 13, color: c.textMuted, margin: 0, textAlign: 'center' }}>
          Micrófono no compatible o bloqueado en este navegador.
        </p>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
