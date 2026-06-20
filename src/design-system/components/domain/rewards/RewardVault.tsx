import { useState } from 'react'
import { Lock, Gem } from 'lucide-react'
import { useThemeStore } from '@/stores/useThemeStore'
import { tokens } from '@/design-system/tokens'
import { EmptyState } from '../../feedback/EmptyState'
import { Modal } from '../../overlays/Modal'
import { RewardCard } from './RewardCard'
import { RewardCardMini } from './RewardCardMini'
import type { RewardCategory } from './rewardCategories'

interface VaultItem {
  earned: boolean
  category?: RewardCategory
  title?: string
  subtitle?: string
  code?: string
  unlockHint?: string
}

interface RewardVaultProps {
  items: VaultItem[]
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

export function RewardVault({ items }: RewardVaultProps) {
  const { c } = useThemeStore()
  const [selected, setSelected] = useState<VaultItem | null>(null)

  const earned = items.filter((i) => i.earned)
  const locked = items.filter((i) => !i.earned)

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
        <span style={{ fontFamily: tokens.font.mono, fontSize: 12, color: c.textMuted }}>
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
        {earned.map((item, i) => (
          <RewardCardMini
            key={i}
            category={item.category!}
            title={item.title!}
            onClick={() => setSelected(item)}
          />
        ))}
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
            }}
          >
            <Lock size={18} color={c.textFaint} />
            <span
              style={{
                fontFamily: tokens.font.mono,
                fontSize: 9.5,
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
            />
          </div>
        )}
      </Modal>
    </div>
  )
}
