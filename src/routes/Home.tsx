import { ArrowRight, BookOpen, CheckCircle, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useThemeStore } from '@/stores/useThemeStore'
import {
  Container,
  Card,
  Stack,
  Button,
  ProgressBar,
  StreakConstellation,
  WordCard,
  tokens,
} from '@/design-system'
import { useStreak } from '@/features/profile/hooks/useStreak'
import { useLessons } from '@/features/lessons/hooks/useLessons'
import { useWordOfDay } from '@/features/lessons/hooks/useWordOfDay'

const TOP_BAR_H = 60
const BOTTOM_NAV_H = 70

function greeting(): string {
  const h = new Date().getHours()
  if (h >= 5 && h < 12) return '¡Buenos días!'
  if (h >= 12 && h < 19) return '¡Buenas tardes!'
  return '¡Buenas noches!'
}

export default function Home() {
  const { c } = useThemeStore()
  const navigate = useNavigate()
  const { streakDays, activeDays, totalXp, todayXp, dailyGoal, level } = useStreak()
  const { lessons, isLoading } = useLessons()
  const { word: wordOfDay, isLoading: wordLoading } = useWordOfDay()

  const activeLesson =
    lessons.find((l) => l.status === 'in_progress') ??
    lessons.find((l) => l.status === 'available') ??
    null

  const allCompleted = !isLoading && lessons.length > 0 && lessons.every((l) => l.status === 'completed')

  return (
    <>

      <Container size="sm">
        <div
          style={{
            paddingTop: TOP_BAR_H + 24,
            paddingBottom: BOTTOM_NAV_H + 24,
            paddingLeft: 20,
            paddingRight: 20,
          }}
        >
          <Stack gap={6}>
            {/* Greeting */}
            <div>
              <h1
                style={{
                  fontFamily: tokens.font.display,
                  fontWeight: 700,
                  fontSize: 'clamp(24px, 5vw, 32px)',
                  background: c.heroGradient,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  margin: '0 0 4px',
                  letterSpacing: -0.5,
                }}
              >
                {greeting()}
              </h1>
              <p
                style={{
                  fontFamily: tokens.font.body,
                  fontSize: 14,
                  color: c.textMuted,
                  margin: 0,
                }}
              >
                {streakDays > 0
                  ? `Llevas ${streakDays} día${streakDays === 1 ? '' : 's'} seguidos. ¡No pares ahora!`
                  : 'Hoy es un buen día para practicar inglés.'}
              </p>
            </div>

            {/* Racha semanal */}
            <StreakConstellation streakDays={streakDays} activeDays={activeDays} />

            {/* Progreso del Estudiante y Meta Diaria */}
            <Card>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 20,
                }}
                className="aurora-home-stats-grid"
              >
                {/* Nivel de Experiencia */}
                <Stack gap={2}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <p style={{ fontFamily: tokens.font.display, fontSize: 14, fontWeight: 600, color: c.text, margin: 0 }}>
                      Nivel {level}
                    </p>
                    <span style={{ fontFamily: tokens.font.mono, fontSize: 11, color: c.textMuted }}>
                      {totalXp % 1000}/1000 XP
                    </span>
                  </div>
                  <ProgressBar value={totalXp % 1000} max={1000} />
                  <p style={{ fontFamily: tokens.font.body, fontSize: 11, color: c.textFaint, margin: 0 }}>
                    El Nivel {level + 1} se alcanza a los {level * 1000} XP totales (faltan {level * 1000 - totalXp} XP)
                  </p>
                </Stack>

                {/* Meta Diaria */}
                <Stack gap={2}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <p style={{ fontFamily: tokens.font.display, fontSize: 14, fontWeight: 600, color: c.text, margin: 0 }}>
                      Meta Diaria
                    </p>
                    <span style={{ fontFamily: tokens.font.mono, fontSize: 11, color: todayXp >= dailyGoal ? c.success : c.textMuted, fontWeight: todayXp >= dailyGoal ? 600 : 400 }}>
                      {todayXp}/{dailyGoal} XP
                    </span>
                  </div>
                  <ProgressBar value={todayXp} max={dailyGoal} />
                  <p
                    style={{
                      fontFamily: tokens.font.body,
                      fontSize: 11,
                      color: todayXp >= dailyGoal ? c.success : c.textFaint,
                      margin: 0,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    {todayXp >= dailyGoal ? (
                      <>
                        <Sparkles size={11} color={c.success} style={{ minWidth: 11 }} />
                        <span>¡Meta diaria completada!</span>
                      </>
                    ) : (
                      `${Math.max(dailyGoal - todayXp, 0)} XP para cumplir tu meta`
                    )}
                  </p>
                </Stack>
              </div>
            </Card>

            {/* Lección de hoy */}
            {isLoading ? (
              <Card>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 40, height: 40, borderRadius: tokens.radius.md, background: c.bgSurfaceRaised, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ height: 10, width: 80, background: c.bgSurfaceRaised, borderRadius: 4, marginBottom: 6 }} />
                      <div style={{ height: 14, width: 160, background: c.bgSurfaceRaised, borderRadius: 4 }} />
                    </div>
                  </div>
                  <div style={{ height: 8, background: c.bgSurfaceRaised, borderRadius: tokens.radius.full }} />
                  <div style={{ height: 44, background: c.bgSurfaceRaised, borderRadius: tokens.radius.md }} />
                </div>
              </Card>
            ) : allCompleted ? (
              <Card>
                <Stack gap={4}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div
                      style={{
                        width: 40, height: 40, borderRadius: tokens.radius.md,
                        background: `${c.success}22`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}
                    >
                      <CheckCircle size={20} color={c.success} />
                    </div>
                    <div>
                      <p style={{ fontFamily: tokens.font.body, fontSize: 11, color: c.textFaint, margin: 0, textTransform: 'uppercase', letterSpacing: 1 }}>
                        Nivel completado
                      </p>
                      <p style={{ fontFamily: tokens.font.display, fontSize: 16, fontWeight: 600, color: c.text, margin: 0 }}>
                        ¡Has terminado todas las lecciones!
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'grid' }}>
                    <Button variant="secondary" icon={Sparkles} onClick={() => navigate('/lessons')}>
                      Ver lecciones
                    </Button>
                  </div>
                </Stack>
              </Card>
            ) : activeLesson ? (
              <Card>
                <Stack gap={4}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div
                      style={{
                        width: 40, height: 40, borderRadius: tokens.radius.md,
                        background: c.glowSoft,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}
                    >
                      <BookOpen size={20} color={c.glow} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontFamily: tokens.font.body, fontSize: 11, color: c.textFaint, margin: 0, textTransform: 'uppercase', letterSpacing: 1 }}>
                        {activeLesson.status === 'in_progress' ? 'Continuar lección' : 'Siguiente lección'}
                      </p>
                      <p
                        style={{
                          fontFamily: tokens.font.display, fontSize: 16, fontWeight: 600, color: c.text, margin: 0,
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}
                      >
                        {activeLesson.title}
                      </p>
                    </div>
                  </div>

                  <ProgressBar
                    value={activeLesson.completedCount}
                    max={activeLesson.exerciseCount}
                    label={`${activeLesson.completedCount} / ${activeLesson.exerciseCount} ejercicios`}
                  />

                  <div style={{ display: 'grid' }}>
                    <Button variant="primary" icon={ArrowRight} onClick={() => navigate(`/lesson/${activeLesson.id}`)}>
                      {activeLesson.status === 'in_progress' ? 'Continuar' : 'Empezar lección'}
                    </Button>
                  </div>
                </Stack>
              </Card>
            ) : null}

            {/* Palabra del día */}
            {!wordLoading && (
              <div>
                <p
                  style={{
                    fontFamily: tokens.font.body,
                    fontSize: 11,
                    color: c.textFaint,
                    margin: '0 0 10px',
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                  }}
                >
                  Palabra del día
                </p>
                {wordOfDay ? (
                  <WordCard
                    word={wordOfDay.word}
                    translation={wordOfDay.translation}
                    example={wordOfDay.example}
                    exampleEs={wordOfDay.exampleEs}
                    partOfSpeech={wordOfDay.partOfSpeech}
                    phonetic={wordOfDay.phonetic}
                  />
                ) : (
                  <WordCard
                    word="resilient"
                    translation="resiliente"
                    example="She remained resilient through every challenge."
                  />
                )}
              </div>
            )}
          </Stack>
        </div>
      </Container>

    </>
  )
}
