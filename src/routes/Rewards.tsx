import { Sparkles } from 'lucide-react'
import { useThemeStore } from '@/stores/useThemeStore'
import {
  Container,
  Stack,
  Card,
  RewardVault,
  RewardUnlockModal,
  tokens,
} from '@/design-system'
import { useRewards } from '@/features/rewards/hooks/useRewards'
import { soundEffects } from '@/lib/soundEffects'

const TOP_BAR_H = 60
const BOTTOM_NAV_H = 70

export default function Rewards() {
  const { c } = useThemeStore()
  const {
    items,
    pendingUnlock,
    setPendingUnlock,
    saveToVault,
    closeUnlock,
  } = useRewards()

  const nextLocked = items.find((i) => !i.earned && !i.unclaimed)
  const hasNextUnlock = !!nextLocked

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
                      {nextLocked.unlockHint || 'Sigue practicando para desbloquearla'}
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Vault */}
            <RewardVault
              items={items}
              onClaim={(item) => {
                soundEffects.playUnlock()
                setPendingUnlock({
                  rewardId: item.id,
                  category: item.category!,
                  title: item.title!,
                  subtitle: item.subtitle!,
                  code: item.code ?? '',
                  rarity: item.rarity!,
                })
              }}
            />


          </Stack>
        </div>
      </Container>

      {/* Unlock celebration modal */}
      {pendingUnlock && (
        <RewardUnlockModal
          open={!!pendingUnlock}
          onClose={closeUnlock}
          category={pendingUnlock.category}
          title={pendingUnlock.title}
          subtitle={pendingUnlock.subtitle}
          code={pendingUnlock.code}
          rarity={pendingUnlock.rarity}
          onSaveToVault={saveToVault}
        />
      )}
    </>
  )
}
