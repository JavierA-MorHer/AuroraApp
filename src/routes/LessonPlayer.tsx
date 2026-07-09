import { useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { X, Star } from 'lucide-react'
import { useThemeStore } from '@/stores/useThemeStore'
import { useAuthStore } from '@/stores/useAuthStore'
import { tokens, Button, Stack } from '@/design-system'
import { useLesson } from '@/features/lessons/hooks/useLesson'
import { supabase } from '@/lib/supabase'
import type { Exercise, MultipleChoiceContent, FillBlankContent, VoiceContent, DictationContent } from '@/features/lessons/types'
import { MultipleChoiceExercise } from '@/features/lessons/components/exercises/MultipleChoiceExercise'
import { FillBlankExercise } from '@/features/lessons/components/exercises/FillBlankExercise'
import { VoiceExercise } from '@/features/lessons/components/exercises/VoiceExercise'
import { DictationExercise } from '@/features/lessons/components/exercises/DictationExercise'

interface ExerciseResult {
  exerciseId: string
  correct: boolean
  score: number
  xpReward: number
}

type Feedback = 'none' | 'correct' | 'incorrect'
type Phase = 'answering' | 'feedback' | 'complete'

function wordScore(a: string, b: string): number {
  const norm = (s: string) => s.toLowerCase().replace(/[.,!?'"]/g, '').trim()
  const targetWords = norm(b).split(/\s+/)
  const inputWords = norm(a).split(/\s+/)
  const matches = targetWords.filter((w) => inputWords.includes(w)).length
  return Math.round((matches / targetWords.length) * 100)
}

function checkExercise(exercise: Exercise, answer: string): { correct: boolean; score: number } {
  const norm = (s: string) => s.toLowerCase().replace(/[.,!?'"]/g, '').trim()

  if (exercise.type === 'multiple_choice') {
    const c = exercise.content as MultipleChoiceContent
    const correct = norm(answer) === norm(c.answer)
    return { correct, score: correct ? 100 : 0 }
  }

  if (exercise.type === 'fill_blank') {
    const c = exercise.content as FillBlankContent
    const correct = norm(answer) === norm(c.answer)
    return { correct, score: correct ? 100 : 0 }
  }

  if (exercise.type === 'voice') {
    const c = exercise.content as VoiceContent
    const score = wordScore(answer, c.target_phrase)
    return { correct: score >= 70, score }
  }

  if (exercise.type === 'dictation') {
    const c = exercise.content as DictationContent
    const score = wordScore(answer, c.audio_text)
    return { correct: score >= 70, score }
  }

  return { correct: false, score: 0 }
}

export default function LessonPlayer() {
  const { lessonId } = useParams<{ lessonId: string }>()
  const navigate = useNavigate()
  const { c } = useThemeStore()
  const { user } = useAuthStore()
  const queryClient = useQueryClient()
  const { lesson, exercises, isLoading } = useLesson(lessonId ?? '')

  const [currentIndex, setCurrentIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState<string>('')
  const [phase, setPhase] = useState<Phase>('answering')
  const [feedback, setFeedback] = useState<Feedback>('none')
  const [results, setResults] = useState<ExerciseResult[]>([])
  const [saving, setSaving] = useState(false)
  const [showExitDialog, setShowExitDialog] = useState(false)

  const exercise = exercises[currentIndex]
  const totalExercises = exercises.length
  const progress = totalExercises > 0 ? (currentIndex / totalExercises) : 0
  const canCheck = userAnswer.trim().length > 0

  const handleCheck = useCallback(() => {
    if (!exercise || !canCheck) return
    const { correct, score } = checkExercise(exercise, userAnswer)
    setFeedback(correct ? 'correct' : 'incorrect')
    setResults((prev) => [
      ...prev,
      { exerciseId: exercise.id, correct, score, xpReward: exercise.xp_reward },
    ])
    setPhase('feedback')
  }, [exercise, userAnswer, canCheck])

  const handleNext = useCallback(async () => {
    if (currentIndex >= totalExercises - 1) {
      await saveProgress()
      setPhase('complete')
    } else {
      setCurrentIndex((i) => i + 1)
      setUserAnswer('')
      setFeedback('none')
      setPhase('answering')
    }
  }, [currentIndex, totalExercises])

  const saveProgress = async () => {
    if (!user || !lessonId) return
    setSaving(true)
    try {
      const allResults = [...results]
      const avgScore = Math.round(allResults.reduce((s, r) => s + r.score, 0) / allResults.length)
      const totalXP = allResults.reduce((s, r) => s + (r.correct ? r.xpReward : 0), 0)

      const { data: lessonProgress } = await supabase
        .from('user_lesson_progress')
        .upsert(
          {
            user_id: user.id,
            lesson_id: lessonId,
            status: 'completed',
            score: avgScore,
            attempts: 1,
            completed_at: new Date().toISOString(),
            last_accessed_at: new Date().toISOString(),
          },
          { onConflict: 'user_id,lesson_id' }
        )
        .select('id')
        .single()

      if (lessonProgress) {
        await supabase.from('user_exercise_progress').insert(
          allResults.map((r) => ({
            user_id: user.id,
            exercise_id: r.exerciseId,
            lesson_progress_id: lessonProgress.id,
            status: r.correct ? 'completed' : 'failed',
            score: r.score,
            completed_at: new Date().toISOString(),
          }))
        )
      }

      if (totalXP > 0) {
        await supabase.rpc('record_daily_activity', {
          p_user_id: user.id,
          p_xp_earned: totalXP,
          p_minutes_studied: Math.round(allResults.length * 1.5),
        })
      }

      // Invalidar caches para que Lessons y Home reflejen el nuevo estado
      await queryClient.invalidateQueries({ queryKey: ['lessons', user.id] })
      await queryClient.invalidateQueries({ queryKey: ['streak', user.id] })
    } finally {
      setSaving(false)
    }
  }

  // ─── Loading ───
  if (isLoading) {
    return (
      <div
        style={{
          minHeight: '100dvh',
          background: c.bgDeep,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            border: `3px solid ${c.border}`,
            borderTop: `3px solid ${c.primary}`,
            animation: 'spin 1s linear infinite',
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  // ─── Complete screen ───
  if (phase === 'complete') {
    const correctCount = results.filter((r) => r.correct).length
    const totalXP = results.reduce((s, r) => s + (r.correct ? r.xpReward : 0), 0)
    const pct = Math.round((correctCount / results.length) * 100)

    return (
      <div
        style={{
          minHeight: '100dvh',
          background: c.bgDeep,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          gap: 32,
        }}
      >
        {/* Trophy */}
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${c.glow}, ${c.primary})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 0 40px ${c.glow}66`,
          }}
        >
          <Star size={44} color="#fff" fill="#fff" />
        </div>

        <div style={{ textAlign: 'center' }}>
          <h1
            style={{
              fontFamily: tokens.font.display,
              fontSize: 28,
              fontWeight: 700,
              color: c.text,
              margin: '0 0 8px',
            }}
          >
            ¡Lección completada!
          </h1>
          <p style={{ fontFamily: tokens.font.body, fontSize: 15, color: c.textMuted, margin: 0 }}>
            {lesson?.title}
          </p>
        </div>

        {/* Stats */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: 16,
            width: '100%',
            maxWidth: 360,
          }}
        >
          {[
            { label: 'Correctas', value: `${correctCount}/${results.length}` },
            { label: 'Precisión', value: `${pct}%` },
            { label: 'XP ganada', value: `+${totalXP}` },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                background: c.bgSurface,
                border: `1px solid ${c.border}`,
                borderRadius: tokens.radius.md,
                padding: '14px 10px',
                textAlign: 'center',
              }}
            >
              <p
                style={{
                  fontFamily: tokens.font.display,
                  fontSize: 20,
                  fontWeight: 700,
                  color: c.primary,
                  margin: '0 0 4px',
                }}
              >
                {stat.value}
              </p>
              <p
                style={{
                  fontFamily: tokens.font.mono,
                  fontSize: 10,
                  color: c.textFaint,
                  margin: 0,
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <div style={{ width: '100%', maxWidth: 360 }}>
          <Button
            variant="primary"
            onClick={() => navigate('/lessons', { replace: true })}
            disabled={saving}
          >
            {saving ? 'Guardando...' : 'Volver a lecciones'}
          </Button>
        </div>
      </div>
    )
  }

  // ─── Exercise screen ───
  const isFeedbackCorrect = feedback === 'correct'
  const explanation = exercise?.content
    ? ((exercise.content as unknown as Record<string, unknown>).explanation as string | undefined) ?? null
    : null

  return (
    <div
      style={{
        minHeight: '100dvh',
        background: c.bgDeep,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Fixed header */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 56,
          background: c.bgDeep,
          borderBottom: `1px solid ${c.border}`,
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          gap: 12,
          zIndex: 100,
        }}
      >
        <button
          onClick={() => setShowExitDialog(true)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 6,
            borderRadius: tokens.radius.sm,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: c.textMuted,
            flexShrink: 0,
          }}
        >
          <X size={20} />
        </button>

        {/* Progress bar */}
        <div
          style={{
            flex: 1,
            height: 8,
            background: c.bgSurfaceRaised,
            borderRadius: tokens.radius.full,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${progress * 100}%`,
              height: '100%',
              background: `linear-gradient(90deg, ${c.secondary}, ${c.glow})`,
              borderRadius: tokens.radius.full,
              transition: 'width 0.4s ease',
            }}
          />
        </div>

        <span
          style={{
            fontFamily: tokens.font.mono,
            fontSize: 12,
            color: c.textMuted,
            flexShrink: 0,
            minWidth: 36,
            textAlign: 'right',
          }}
        >
          {currentIndex + 1}/{totalExercises}
        </span>
      </div>

      {/* Exercise content */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          paddingTop: 56 + 24,
          paddingBottom: 96 + 24,
          paddingLeft: 20,
          paddingRight: 20,
          maxWidth: 540,
          margin: '0 auto',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        {exercise && (
          <Stack gap={6}>
            {/* Exercise type label */}
            <p
              style={{
                fontFamily: tokens.font.mono,
                fontSize: 11,
                color: c.textFaint,
                margin: 0,
                textTransform: 'uppercase',
                letterSpacing: 1.5,
              }}
            >
              {exercise.type === 'multiple_choice' && 'Selecciona la respuesta'}
              {exercise.type === 'fill_blank' && 'Completa la oración'}
              {exercise.type === 'voice' && 'Práctica de pronunciación'}
              {exercise.type === 'dictation' && 'Dictado'}
            </p>

            {exercise.type === 'multiple_choice' && (
              <MultipleChoiceExercise
                content={exercise.content as MultipleChoiceContent}
                selected={userAnswer}
                onSelect={setUserAnswer}
                feedback={feedback}
              />
            )}

            {exercise.type === 'fill_blank' && (
              <FillBlankExercise
                content={exercise.content as FillBlankContent}
                value={userAnswer}
                onChange={setUserAnswer}
                feedback={feedback}
              />
            )}

            {exercise.type === 'voice' && (
              <VoiceExercise
                content={exercise.content as VoiceContent}
                transcript={userAnswer}
                onTranscript={setUserAnswer}
                feedback={feedback}
              />
            )}

            {exercise.type === 'dictation' && (
              <DictationExercise
                content={exercise.content as DictationContent}
                value={userAnswer}
                onChange={setUserAnswer}
                feedback={feedback}
              />
            )}
          </Stack>
        )}
      </div>

      {/* Exit confirmation dialog */}
      {showExitDialog && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
            zIndex: 200,
          }}
          onClick={() => setShowExitDialog(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: c.bgSurface,
              border: `1px solid ${c.border}`,
              borderRadius: tokens.radius.lg,
              padding: 28,
              width: '100%',
              maxWidth: 360,
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            <div>
              <p
                style={{
                  fontFamily: tokens.font.display,
                  fontSize: 18,
                  fontWeight: 700,
                  color: c.text,
                  margin: '0 0 6px',
                }}
              >
                ¿Abandonar la lección?
              </p>
              <p style={{ fontFamily: tokens.font.body, fontSize: 14, color: c.textMuted, margin: 0, lineHeight: 1.5 }}>
                Perderás el progreso de esta sesión. Tendrás que empezar la lección desde el principio.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button
                onClick={() => navigate('/lessons')}
                style={{
                  padding: '13px',
                  background: c.danger,
                  border: 'none',
                  borderRadius: tokens.radius.md,
                  fontFamily: tokens.font.display,
                  fontSize: 15,
                  fontWeight: 600,
                  color: '#fff',
                  cursor: 'pointer',
                }}
              >
                Salir sin guardar
              </button>
              <button
                onClick={() => setShowExitDialog(false)}
                style={{
                  padding: '13px',
                  background: 'none',
                  border: `1px solid ${c.border}`,
                  borderRadius: tokens.radius.md,
                  fontFamily: tokens.font.display,
                  fontSize: 15,
                  fontWeight: 600,
                  color: c.text,
                  cursor: 'pointer',
                }}
              >
                Continuar lección
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fixed bottom action bar */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '12px 20px',
          paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
          background: phase === 'feedback'
            ? isFeedbackCorrect ? `${c.success}15` : `${c.danger}15`
            : c.bgDeep,
          borderTop: `1px solid ${
            phase === 'feedback'
              ? isFeedbackCorrect ? `${c.success}44` : `${c.danger}44`
              : c.border
          }`,
          transition: `background ${tokens.motion.duration.base} ease, border-color ${tokens.motion.duration.base} ease`,
          zIndex: 100,
        }}
      >
        {phase === 'feedback' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 540, margin: '0 auto' }}>
            {/* Label */}
            <p
              style={{
                fontFamily: tokens.font.display,
                fontSize: 16,
                fontWeight: 700,
                color: isFeedbackCorrect ? c.success : c.danger,
                margin: 0,
              }}
            >
              {isFeedbackCorrect ? '¡Correcto!' : 'Incorrecto'}
            </p>

            {/* Explicación pedagógica */}
            {explanation && (
              <p
                style={{
                  fontFamily: tokens.font.body,
                  fontSize: 14,
                  color: c.textMuted,
                  margin: 0,
                  lineHeight: 1.5,
                  borderLeft: `3px solid ${isFeedbackCorrect ? c.success : c.danger}`,
                  paddingLeft: 10,
                }}
              >
                {explanation}
              </p>
            )}

            <button
              onClick={handleNext}
              style={{
                padding: '14px',
                background: isFeedbackCorrect ? c.success : (c.danger),
                border: 'none',
                borderRadius: tokens.radius.md,
                fontFamily: tokens.font.display,
                fontSize: 16,
                fontWeight: 600,
                color: '#fff',
                cursor: 'pointer',
                transition: `opacity ${tokens.motion.duration.fast} ease`,
              }}
            >
              {currentIndex >= totalExercises - 1 ? 'Ver resultados' : 'Continuar'}
            </button>
          </div>
        ) : (
          <div style={{ maxWidth: 540, margin: '0 auto' }}>
            <button
              onClick={handleCheck}
              disabled={!canCheck}
              style={{
                width: '100%',
                padding: '14px',
                background: canCheck ? c.primary : c.bgSurfaceRaised,
                border: 'none',
                borderRadius: tokens.radius.md,
                fontFamily: tokens.font.display,
                fontSize: 16,
                fontWeight: 600,
                color: canCheck ? '#fff' : c.textFaint,
                cursor: canCheck ? 'pointer' : 'default',
                transition: `all ${tokens.motion.duration.fast} ease`,
              }}
            >
              Comprobar
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
