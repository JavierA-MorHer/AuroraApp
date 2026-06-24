import { Page, Container, Stack, tokens } from '@/design-system'
import { useThemeStore } from '@/stores/useThemeStore'
import { TopBar } from '@/features/navigation/components/TopBar'
import { BottomNav } from '@/features/navigation/components/BottomNav'
import { LessonCard } from '@/features/lessons/components/LessonCard'
import { useLessons } from '@/features/lessons/hooks/useLessons'

const TOP_BAR_H = 60
const BOTTOM_NAV_H = 70

export default function Lessons() {
  const { c } = useThemeStore()
  const { lessons, completedCount, totalCount } = useLessons()

  return (
    <Page padding="0">
      <TopBar initials="NV" name="Nayeli Valadez" streak={4} />

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
            {/* Header */}
            <div>
              <h1
                style={{
                  fontFamily: tokens.font.display,
                  fontWeight: 700,
                  fontSize: 'clamp(24px, 5vw, 32px)',
                  background: c.heroGradient,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  margin: '0 0 6px',
                  letterSpacing: -0.5,
                }}
              >
                Lecciones
              </h1>
              <p style={{ fontFamily: tokens.font.body, fontSize: 14, color: c.textMuted, margin: 0 }}>
                {completedCount} de {totalCount} completadas
              </p>
            </div>

            {/* Progress bar global */}
            <div
              style={{
                height: 6,
                background: c.bgSurfaceRaised,
                borderRadius: tokens.radius.full,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${(completedCount / totalCount) * 100}%`,
                  height: '100%',
                  background: `linear-gradient(90deg, ${c.secondary}, ${c.glow})`,
                  borderRadius: tokens.radius.full,
                  boxShadow: `0 0 8px ${c.glow}aa`,
                  transition: 'width 0.6s ease',
                }}
              />
            </div>

            {/* Lesson list */}
            <Stack gap={3}>
              {lessons.map((lesson) => (
                <LessonCard
                  key={lesson.id}
                  lesson={lesson}
                  onClick={lesson.status !== 'locked' ? () => console.log('open lesson', lesson.id) : undefined}
                />
              ))}
            </Stack>
          </Stack>
        </div>
      </Container>

      <BottomNav />
    </Page>
  )
}
