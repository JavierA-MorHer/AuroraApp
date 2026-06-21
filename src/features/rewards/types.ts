import type { RewardCategory } from '@/design-system'

export interface RewardItem {
  id: string
  earned: boolean
  category?: RewardCategory
  title?: string
  subtitle?: string
  code?: string
  unlockHint?: string
}
