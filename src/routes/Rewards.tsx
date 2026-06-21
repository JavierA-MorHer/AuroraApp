import { Gem, Sparkles } from 'lucide-react'
import { useThemeStore } from '@/stores/useThemeStore'
import {
  Page,
  Container,
  Stack,
  Card,
  Button,
  RewardVault,
  RewardUnlockModal,
  tokens,
} from '@/design-system'
import { TopBar } from '@/features/navigation/components/TopBar'
import { BottomNav } from '@/features/navigation/components/BottomNav'
import { useRewards } from '@/features/rewards/hooks/useRewards'

const TOP_BAR_H = 60
const BOTTOM_NAV_H = 70

export default function Rewards() {
  const { c } = useThemeStore()
  const {
    items,
    pendingUnlock,
    triggerUnlock,
    saveToVault,
    closeUnlock,
  } = useRewards()

  const hasNextUnlock = items.some((i) => !i.earned)

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
                Bóveda
              </h1>
              <p style={{ fontFamily: tokens.font.body, fontSize: 14, color: c.textMuted, margin: 0 }}>
                Tus cartas de recompensa coleccionadas
              </p>
            </div>

            {/* Banner de próxima recompensa */}
            {hasNextUnlock && (
              <Card>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: tokens.radius.md,
                      background: c.glowSoft,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Sparkles size={20} color={c.glow} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        fontFamily: tokens.font.display,
                        fontSize: 15,
                        fontWeight: 600,
                        color: c.text,
                        margin: '0 0 2px',
                      }}
                    >
                      Próxima recompensa
                    </p>
                    <p style={{ fontFamily: tokens.font.body, fontSize: 13, color: c.textMuted, margin: 0 }}>
                      Completa "Verbos en pasado" para desbloquearla
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Vault */}
            <RewardVault items={items} />

            {/* Demo: simular desbloqueo */}
            <Card>
              <Stack gap={3}>
                <p
                  style={{
                    fontFamily: tokens.font.mono,
                    fontSize: 11,
                    letterSpacing: 1.5,
                    textTransform: 'uppercase',
                    color: c.textFaint,
                    margin: 0,
                  }}
                >
                  Demo
                </p>
                <p style={{ fontFamily: tokens.font.body, fontSize: 13, color: c.textMuted, margin: 0 }}>
                  Simula completar una lección y recibir tu carta de recompensa.
                </p>
                <div style={{ display: 'grid' }}>
                  <Button variant="glow" icon={Gem} onClick={triggerUnlock}>
                    Simular desbloqueo
                  </Button>
                </div>
              </Stack>
            </Card>
          </Stack>
        </div>
      </Container>

      <BottomNav />

      {/* Unlock celebration modal */}
      {pendingUnlock && (
        <RewardUnlockModal
          open={!!pendingUnlock}
          onClose={closeUnlock}
          category={pendingUnlock.category}
          title={pendingUnlock.title}
          subtitle={pendingUnlock.subtitle}
          code={pendingUnlock.code}
          onSaveToVault={saveToVault}
        />
      )}
    </Page>
  )
}
