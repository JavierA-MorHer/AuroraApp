import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/useAuthStore'
import type { RewardItem } from '../types'
import type { RewardCategory } from '@/design-system'

export interface PendingUnlock {
  rewardId: string
  category: RewardCategory
  title: string
  subtitle: string
  code: string
}

export function useRewards() {
  const user = useAuthStore((s) => s.user)
  const queryClient = useQueryClient()
  const [pendingUnlock, setPendingUnlock] = useState<PendingUnlock | null>(null)

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['rewards', user?.id],
    queryFn: async () => {
      const [rewardsResult, userRewardsResult] = await Promise.all([
        supabase
          .from('rewards')
          .select('*')
          .eq('is_active', true)
          .order('display_order'),
        user
          ? supabase
              .from('user_rewards')
              .select('reward_id, is_redeemed, unlocked_at')
              .eq('user_id', user.id)
          : Promise.resolve({ data: [] as Array<{ reward_id: string; is_redeemed: boolean; unlocked_at: string }>, error: null }),
      ])

      if (rewardsResult.error) throw rewardsResult.error

      const earnedMap = new Map(
        (userRewardsResult.data ?? []).map((r) => [r.reward_id, r]),
      )

      return (rewardsResult.data ?? []).map((reward): RewardItem => {
        const earned = earnedMap.get(reward.id)
        return {
          id: reward.id,
          earned: !!earned,
          category: earned ? (reward.category as RewardCategory) : undefined,
          title: earned ? reward.title : undefined,
          subtitle: earned ? (reward.description ?? undefined) : undefined,
          code: earned ? (reward.code ?? undefined) : undefined,
          unlockHint: !earned ? (reward.unlock_hint ?? undefined) : undefined,
        }
      })
    },
  })

  async function saveToVault() {
    if (!pendingUnlock || !user) return

    await supabase.from('user_rewards').insert({
      user_id: user.id,
      reward_id: pendingUnlock.rewardId,
    })

    queryClient.invalidateQueries({ queryKey: ['rewards', user.id] })
    setPendingUnlock(null)
  }

  function closeUnlock() {
    setPendingUnlock(null)
  }

  const earnedCount = items.filter((i) => i.earned).length
  const totalCount = items.length

  return {
    items,
    isLoading,
    pendingUnlock,
    earnedCount,
    totalCount,
    setPendingUnlock,
    saveToVault,
    closeUnlock,
  }
}
