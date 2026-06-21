import { useState } from 'react'
import { MOCK_REWARDS } from '../data/mockRewards'
import type { RewardItem } from '../types'
import type { RewardCategory } from '@/design-system'

export interface PendingUnlock {
  itemId: string
  category: RewardCategory
  title: string
  subtitle: string
  code: string
}

// Reward unlocked when the user completes "Verbos en pasado"
// TODO: trigger this from the lesson completion flow
const NEXT_UNLOCK: PendingUnlock = {
  itemId: '3',
  category: 'massage',
  title: 'Masaje relajante',
  subtitle: 'Por completar "Verbos en pasado"',
  code: 'AURORA-MAS',
}

export function useRewards() {
  const [items, setItems] = useState<RewardItem[]>(MOCK_REWARDS)
  const [pendingUnlock, setPendingUnlock] = useState<PendingUnlock | null>(null)

  function triggerUnlock() {
    setPendingUnlock(NEXT_UNLOCK)
  }

  function saveToVault() {
    if (!pendingUnlock) return
    setItems((prev) =>
      prev.map((item) =>
        item.id === pendingUnlock.itemId
          ? {
              ...item,
              earned: true,
              category: pendingUnlock.category,
              title: pendingUnlock.title,
              subtitle: pendingUnlock.subtitle,
              code: pendingUnlock.code,
            }
          : item,
      ),
    )
    setPendingUnlock(null)
  }

  function closeUnlock() {
    setPendingUnlock(null)
  }

  const earnedCount = items.filter((i) => i.earned).length
  const totalCount = items.length

  return {
    items,
    pendingUnlock,
    earnedCount,
    totalCount,
    triggerUnlock,
    saveToVault,
    closeUnlock,
  }
}
