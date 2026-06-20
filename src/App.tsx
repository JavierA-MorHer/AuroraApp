import { useState } from 'react'
import { ArrowRight, Sparkles, Flame, BookOpen } from 'lucide-react'
import { useThemeStore } from '@/stores/useThemeStore'
import {
  Page,
  Container,
  Stack,
  Grid,
  Spacer,
  Card,
  Button,
  Badge,
  Avatar,
  ProgressBar,
  Tooltip,
  Input,
  Switch,
  StreakConstellation,
  WordCard,
  Toast,
  RewardCard,
  tokens,
} from '@/design-system'

function ThemeToggle() {
  const { mode, toggle, c } = useThemeStore()
  return (
    <button
      onClick={toggle}
      className="aurora-focusable"
      aria-label={mode === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
      style={{
        position: 'fixed',
        top: 20,
        right: 20,
        zIndex: tokens.zIndex.sticky,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        background: c.bgSurfaceRaised,
        border: `1px solid ${c.border}`,
        borderRadius: tokens.radius.full,
        padding: '8px 14px',
        cursor: 'pointer',
        fontFamily: tokens.font.body,
        fontSize: 12.5,
        fontWeight: 600,
        color: c.text,
        boxShadow: c.shadow,
        minHeight: 38,
        transition: `transform ${tokens.motion.duration.fast} ${tokens.motion.easing.standard}`,
      }}
    >
      {mode === 'dark' ? '☀️ Claro' : '🌙 Oscuro'}
    </button>
  )
}

export default function App() {
  const { c } = useThemeStore()
  const [toastOpen, setToastOpen] = useState(false)

  return (
    <Page>
      <ThemeToggle />
      <Container size="md">
        {/* Header */}
        <div style={{ textAlign: 'center', paddingTop: 48, paddingBottom: 40 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
            <Sparkles size={16} color={c.glow} />
            <span
              style={{
                fontFamily: tokens.font.mono,
                fontSize: 11,
                letterSpacing: 2,
                textTransform: 'uppercase',
                color: c.glow,
              }}
            >
              Aurora Design System
            </span>
          </div>
          <h1
            style={{
              fontFamily: tokens.font.display,
              fontWeight: 700,
              fontSize: 'clamp(32px, 6vw, 52px)',
              background: c.heroGradient,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: '0 0 12px',
              letterSpacing: -1,
            }}
          >
            Aurora
          </h1>
          <p
            style={{
              fontFamily: tokens.font.body,
              fontSize: 15,
              color: c.textMuted,
              maxWidth: 420,
              margin: '0 auto',
            }}
          >
            Migración del design system verificada. Componentes cargando desde{' '}
            <code
              style={{ fontFamily: tokens.font.mono, fontSize: 13, color: c.glow }}
            >
              src/design-system/
            </code>
            .
          </p>
        </div>

        {/* StreakConstellation — la pieza firma */}
        <section style={{ marginBottom: 40 }}>
          <h2
            style={{
              fontFamily: tokens.font.display,
              fontSize: 20,
              fontWeight: 600,
              color: c.text,
              marginBottom: 16,
            }}
          >
            StreakConstellation
          </h2>
          <div style={{ maxWidth: 420 }}>
            <StreakConstellation lit={4} total={7} />
          </div>
        </section>

        {/* Buttons */}
        <section style={{ marginBottom: 40 }}>
          <h2
            style={{
              fontFamily: tokens.font.display,
              fontSize: 20,
              fontWeight: 600,
              color: c.text,
              marginBottom: 16,
            }}
          >
            Botones
          </h2>
          <Stack direction="horizontal" gap={3} wrap>
            <Button variant="primary" icon={ArrowRight}>
              Continuar
            </Button>
            <Button variant="glow" icon={Flame}>
              Mantener racha
            </Button>
            <Button variant="secondary">Más tarde</Button>
            <Button variant="ghost">Saltar</Button>
            <Button variant="primary" disabled>
              Bloqueado
            </Button>
          </Stack>
        </section>

        {/* Card + Badge + Avatar + ProgressBar */}
        <section style={{ marginBottom: 40 }}>
          <h2
            style={{
              fontFamily: tokens.font.display,
              fontSize: 20,
              fontWeight: 600,
              color: c.text,
              marginBottom: 16,
            }}
          >
            Primitivos
          </h2>
          <Grid minColWidth={260} gap={4}>
            <Card>
              <Stack direction="horizontal" gap={3} align="center">
                <Avatar initials="MJ" size={44} online />
                <div>
                  <div
                    style={{ fontFamily: tokens.font.display, fontSize: 16, fontWeight: 600, color: c.text }}
                  >
                    María José
                  </div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                    <Badge>Nivel A2</Badge>
                    <Badge variant="glow">
                      <Sparkles size={11} /> Racha activa
                    </Badge>
                  </div>
                </div>
              </Stack>
              <Spacer size={4} />
              <ProgressBar value={65} max={100} label="Lección de hoy" />
            </Card>

            <Card>
              <Stack gap={4}>
                <Input label="Tu respuesta" placeholder="Escribe en inglés..." />
                <Input
                  label="Correo"
                  placeholder="tu@email.com"
                  type="email"
                  status="error"
                  message="Formato no válido."
                />
                <Switch label="Notificaciones diarias" defaultChecked />
              </Stack>
            </Card>
          </Grid>
        </section>

        {/* WordCard */}
        <section style={{ marginBottom: 40 }}>
          <h2
            style={{
              fontFamily: tokens.font.display,
              fontSize: 20,
              fontWeight: 600,
              color: c.text,
              marginBottom: 16,
            }}
          >
            WordCard
          </h2>
          <Grid minColWidth={220} gap={3}>
            <WordCard
              word="serendipity"
              translation="serendipia"
              example="Finding this café was pure serendipity."
            />
            <WordCard
              word="thrive"
              translation="prosperar"
              example="She thrives under pressure."
            />
          </Grid>
        </section>

        {/* RewardCard */}
        <section style={{ marginBottom: 40 }}>
          <h2
            style={{
              fontFamily: tokens.font.display,
              fontSize: 20,
              fontWeight: 600,
              color: c.text,
              marginBottom: 16,
            }}
          >
            RewardCard
          </h2>
          <Stack direction="horizontal" gap={4} wrap>
            <RewardCard
              category="massage"
              title="Masaje relajante"
              subtitle="Por completar el módulo de Listening"
              code="AURORA-MAS"
              size={180}
            />
            <RewardCard
              category="surprise"
              title="Sorpresa misteriosa"
              subtitle="Por tu primer módulo completado"
              code="AURORA-001"
              size={180}
            />
          </Stack>
        </section>

        {/* Toast demo */}
        <section style={{ marginBottom: 64 }}>
          <h2
            style={{
              fontFamily: tokens.font.display,
              fontSize: 20,
              fontWeight: 600,
              color: c.text,
              marginBottom: 16,
            }}
          >
            Toast
          </h2>
          <Tooltip label="Dispara un toast de éxito">
            <Button
              variant="secondary"
              icon={BookOpen}
              onClick={() => setToastOpen(true)}
            >
              Simular respuesta correcta
            </Button>
          </Tooltip>
          <Toast
            open={toastOpen}
            onClose={() => setToastOpen(false)}
            variant="success"
            message="¡Correcto! +10 XP"
          />
        </section>
      </Container>
    </Page>
  )
}
