import type { RewardCategory, RewardRarity } from '@/design-system'

export interface RewardItem {
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

