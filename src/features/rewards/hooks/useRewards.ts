import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/useAuthStore'
import type { RewardItem } from '../types'
import type { RewardCategory } from '@/design-system'

type RewardRow = {
  id: string
  title: string
  description: string | null
  unlock_hint: string | null
  category: string
  code: string | null
  is_active: boolean
  display_order: number
}

type UserRewardRow = { reward_id: string; is_redeemed: boolean; unlocked_at: string }

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
        supabase.from('rewards').select('*').eq('is_active', true).order('display_order'),
        supabase.from('user_rewards').select('reward_id, is_redeemed, unlocked_at'),
      ])

      if (rewardsResult.error) throw rewardsResult.error

      const rewardRows = (rewardsResult.data ?? []) as RewardRow[]
      const userRewardRows = (userRewardsResult.data ?? []) as UserRewardRow[]

      const earnedMap = new Map(userRewardRows.map((r) => [r.reward_id, r]))

      return rewardRows.map((reward): RewardItem => {
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

  function triggerUnlock() {
    const next = (items as RewardItem[]).find((i) => !i.earned)
    if (!next) return
    setPendingUnlock({
      rewardId: next.id,
      category: 'surprise',
      title: 'Recompensa desbloqueada',
      subtitle: 'Demo de desbloqueo',
      code: 'AURORA-DEMO',
    })
  }

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
    triggerUnlock,
    setPendingUnlock,
    saveToVault,
    closeUnlock,
  }
}
