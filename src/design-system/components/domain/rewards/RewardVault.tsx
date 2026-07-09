import { useState } from 'react'
import { Lock, Gem, Sparkles } from 'lucide-react'
import { useThemeStore } from '@/stores/useThemeStore'
import { tokens } from '@/design-system/tokens'
import { EmptyState } from '../../feedback/EmptyState'
import { Modal } from '../../overlays/Modal'
import { RewardCard } from './RewardCard'
import { RewardCardMini } from './RewardCardMini'
import { REWARD_CATEGORIES, type RewardCategory, type RewardRarity } from './rewardCategories'

interface VaultItem {
  id: string
  earned: boolean
  unclaimed?: boolean
  category?: RewardCategory
  title?: string
  subtitle?: string
  code?: string
  unlockHint?: string
  rarity?: RewardRarity
}

interface RewardVaultProps {
  items: VaultItem[]
  onClaim?: (item: VaultItem) => void
}

function ProgressBarMini({ value, max }: { value: number; max: number }) {
  const { c } = useThemeStore()
  const pct = (value / max) * 100

  return (
    <div
      style={{
        width: 100,
        height: 6,
        background: c.bgDeep,
        borderRadius: tokens.radius.full,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: `${pct}%`,
          height: '100%',
          background: `linear-gradient(90deg, ${c.secondary}, ${c.glow})`,
          borderRadius: tokens.radius.full,
        }}
      />
    </div>
  )
}

export function RewardVault({ items, onClaim }: RewardVaultProps) {
  const { c } = useThemeStore()
  const [selected, setSelected] = useState<VaultItem | null>(null)

  const earned = items.filter((i) => i.earned)
  const unclaimed = items.filter((i) => i.unclaimed)
  const locked = items.filter((i) => !i.earned && !i.unclaimed)

  if (items.length === 0) {
    return (
      <EmptyState
        icon={Gem}
        title="Tu bóveda está vacía"
        description="Completa un módulo de práctica para ganar tu primera carta de recompensa."
      />
    )
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 18,
        }}
      >
        <span style={{ fontFamily: tokens.font.mono, fontSize: tokens.fontSize.sm, color: c.textMuted }}>
          {earned.length} de {items.length} cartas ganadas
        </span>
        <ProgressBarMini value={earned.length} max={items.length} />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
          gap: 12,
        }}
      >
        {/* Cartas ganadas y reclamadas */}
        {earned.map((item, i) => (
          <RewardCardMini
            key={i}
            category={item.category!}
            title={item.title!}
            onClick={() => setSelected(item)}
          />
        ))}

        {/* Cartas desbloqueadas listas para reclamar */}
        {unclaimed.map((item, i) => {
          const cat = REWARD_CATEGORIES[item.category!]
          const [g1, g2] = cat.gradient
          return (
            <div
              key={`unclaimed-${i}`}
              onClick={() => onClaim?.(item)}
              style={{
                aspectRatio: '0.69',
                borderRadius: 16,
                background: `linear-gradient(135deg, ${g1}, ${g2})`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: 10,
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: `0 8px 24px ${g2}55`,
                animation: 'pulseGlow 2s infinite alternate',
              }}
            >
              <style>{`
                @keyframes pulseGlow {
                  0% { transform: scale(1); box-shadow: 0 8px 24px ${g2}44; }
                  100% { transform: scale(1.03); box-shadow: 0 12px 32px ${g2}88, 0 0 15px ${c.glow}44; }
                }
              `}</style>
              <Sparkles size={20} color="#FFFFFF" strokeWidth={2.5} />
              <span
                style={{
                  fontFamily: tokens.font.mono,
                  fontSize: 9,
                  fontWeight: 600,
                  color: '#FFFFFFEE',
                  letterSpacing: 1,
                  textAlign: 'center',
                  textTransform: 'uppercase',
                }}
              >
                {cat.label}
              </span>
              <button
                style={{
                  background: '#FFFFFF',
                  color: g2,
                  border: 'none',
                  borderRadius: 20,
                  padding: '3px 10px',
                  fontFamily: tokens.font.display,
                  fontSize: 10,
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                }}
              >
                Reclamar
              </button>
            </div>
          )
        })}

        {/* Cartas bloqueadas */}
        {locked.map((item, i) => (
          <div
            key={`locked-${i}`}
            style={{
              aspectRatio: '0.69',
              borderRadius: 16,
              border: `2px dashed ${c.border}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              background: c.bgSurface,
              padding: 10,
              opacity: 0.8,
            }}
          >
            <Lock size={18} color={c.textFaint} />
            <span
              style={{
                fontFamily: tokens.font.mono,
                fontSize: tokens.fontSize['2xs'],
                color: c.textFaint,
                textAlign: 'center',
                lineHeight: 1.3,
              }}
            >
              {item.unlockHint ?? 'Sigue practicando'}
            </span>
          </div>
        ))}
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)}>
        {selected && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4px 0' }}>
            <RewardCard
              category={selected.category}
              title={selected.title!}
              subtitle={selected.subtitle!}
              code={selected.code!}
              size={210}
              rarity={selected.rarity}
            />
          </div>
        )}
      </Modal>
    </div>
  )
}
