import { ArrowRight, BookOpen } from 'lucide-react'
import { useThemeStore } from '@/stores/useThemeStore'
import {
  Page,
  Container,
  Card,
  Stack,
  Button,
  ProgressBar,
  StreakConstellation,
  WordCard,
  tokens,
} from '@/design-system'
import { TopBar } from '@/features/navigation/components/TopBar'
import { BottomNav } from '@/features/navigation/components/BottomNav'

const TOP_BAR_H = 60
const BOTTOM_NAV_H = 70

export default function Home() {
  const { c } = useThemeStore()

  return (
    <Page padding="0">
      <TopBar initials="MJ" name="María José" streak={4} />

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
                ¡Buenos días! 👋
              </h1>
              <p
                style={{
                  fontFamily: tokens.font.body,
                  fontSize: 14,
                  color: c.textMuted,
                  margin: 0,
                }}
              >
                Llevas 4 días seguidos. ¡No pares ahora!
              </p>
            </div>

            {/* Racha semanal */}
            <StreakConstellation lit={4} total={7} />

            {/* Lección de hoy */}
            <Card>
              <Stack gap={4}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: tokens.radius.md,
                      background: c.glowSoft,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <BookOpen size={20} color={c.glow} />
                  </div>
                  <div>
                    <p
                      style={{
                        fontFamily: tokens.font.body,
                        fontSize: 11,
                        color: c.textFaint,
                        margin: 0,
                        textTransform: 'uppercase',
                        letterSpacing: 1,
                      }}
                    >
                      Lección de hoy
                    </p>
                    <p
                      style={{
                        fontFamily: tokens.font.display,
                        fontSize: 16,
                        fontWeight: 600,
                        color: c.text,
                        margin: 0,
                      }}
                    >
                      Verbos en pasado
                    </p>
                  </div>
                </div>

                <ProgressBar value={3} max={5} label="Ejercicios completados" />

                <div style={{ display: 'grid' }}>
                  <Button variant="primary" icon={ArrowRight}>
                    Continuar lección
                  </Button>
                </div>
              </Stack>
            </Card>

            {/* Palabra del día */}
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
              <WordCard
                word="resilient"
                translation="resiliente"
                example="She remained resilient through every challenge."
              />
            </div>
          </Stack>
        </div>
      </Container>

      <BottomNav />
    </Page>
  )
}
