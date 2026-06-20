import { useState, useEffect } from 'react'
import { Gem, PartyPopper } from 'lucide-react'
import { useThemeStore } from '@/stores/useThemeStore'
import { tokens } from '@/design-system/tokens'
import { Button } from '../../primitives/Button'
import { RewardCard } from './RewardCard'
import { ParticleBurst } from './ParticleBurst'
import { REWARD_CATEGORIES } from './rewardCategories'
import type { RewardCategory } from './rewardCategories'

interface RewardUnlockModalProps {
  open: boolean
  onClose: () => void
  category?: RewardCategory
  title: string
  subtitle: string
  code: string
  onSaveToVault?: () => void
}

export function RewardUnlockModal({
  open,
  onClose,
  category = 'dinner',
  title,
  subtitle,
  code,
  onSaveToVault,
}: RewardUnlockModalProps) {
  const { c } = useThemeStore()
  const [revealed, setRevealed] = useState(false)
  const cat = REWARD_CATEGORIES[category]

  useEffect(() => {
    if (open) {
      setRevealed(false)
      const t = setTimeout(() => setRevealed(true), 250)
      return () => clearTimeout(t)
    }
  }, [open])

  if (!open) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(8,4,16,0.82)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: tokens.zIndex.modal,
        padding: 20,
        animation: `fadeIn ${tokens.motion.duration.base} ${tokens.motion.easing.standard}`,
      }}
    >
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div style={{ position: 'relative' }}>
          {revealed && (
            <ParticleBurst colors={[cat.gradient[0], cat.gradient[1], '#FFFFFF']} />
          )}
          <div
            style={{
              animation: revealed
                ? `cardPop ${tokens.motion.duration.slow} ${tokens.motion.easing.bounce}`
                : 'none',
              opacity: revealed ? 1 : 0,
              transform: revealed ? 'scale(1)' : 'scale(0.6)',
              transition: revealed ? 'none' : `opacity ${tokens.motion.duration.fast} ease`,
            }}
          >
            <RewardCard
              category={category}
              title={title}
              subtitle={subtitle}
              code={code}
              size={230}
            />
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 20, maxWidth: 300 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              marginBottom: 8,
            }}
          >
            <PartyPopper size={18} color={c.glow} />
            <span
              style={{
                fontFamily: tokens.font.mono,
                fontSize: 11,
                letterSpacing: 1.5,
                textTransform: 'uppercase',
                color: c.glow,
              }}
            >
              Nueva carta desbloqueada
            </span>
          </div>
          <p
            style={{
              fontFamily: tokens.font.body,
              fontSize: 13.5,
              color: '#F5F0FFcc',
              lineHeight: 1.5,
              marginBottom: 22,
            }}
          >
            Completaste el módulo. Esta carta es tuya — guárdala en tu bóveda o descárgala ahora.
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <Button variant="secondary" onClick={onClose}>
              Seguir luego
            </Button>
            <Button
              variant="glow"
              icon={Gem}
              onClick={() => {
                onSaveToVault?.()
                onClose()
              }}
            >
              Guardar en bóveda
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
