import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/useAuthStore'
import type { RewardItem } from '../types'
import type { RewardCategory, RewardRarity } from '@/design-system'

type RewardRow = {
  id: string
  title: string
  description: string | null
  unlock_hint: string | null
  category: string
  code: string | null
  rarity: string
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
  rarity: RewardRarity
}

export function useRewards() {
  const user = useAuthStore((s) => s.user)
  const queryClient = useQueryClient()
  const [pendingUnlock, setPendingUnlock] = useState<PendingUnlock | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['rewards', user?.id],
    queryFn: async () => {
      // 1. Ejecutar de manera retroactiva la evaluación en el servidor si hay usuario autenticado
      if (user?.id) {
        try {
          await supabase.rpc('check_and_unlock_rewards_for_user', { p_user_id: user.id })
        } catch (err) {
          console.warn('Error evaluating retroactive rewards:', err)
        }
      }

      // 2. Traer el catálogo y las recompensas desbloqueadas del usuario
      const [rewardsResult, userRewardsResult] = await Promise.all([
        supabase.from('rewards').select('*').eq('is_active', true).order('display_order'),
        supabase.from('user_rewards').select('reward_id, is_redeemed, unlocked_at'),
      ])

      if (rewardsResult.error) throw rewardsResult.error

      const rewardRows = (rewardsResult.data ?? []) as RewardRow[]
      const userRewardRows = (userRewardsResult.data ?? []) as UserRewardRow[]

      const earnedMap = new Map(userRewardRows.map((r) => [r.reward_id, r]))

      const mappedItems = rewardRows.map((reward): RewardItem => {
        const earnedRow = earnedMap.get(reward.id)
        const hasRecord = !!earnedRow
        const isClaimed = hasRecord && earnedRow.is_redeemed

        return {
          id: reward.id,
          earned: isClaimed,
          unclaimed: hasRecord && !earnedRow.is_redeemed,
          category: reward.category as RewardCategory,
          title: reward.title,
          subtitle: reward.description ?? undefined,
          code: hasRecord ? (reward.code ?? undefined) : undefined,
          unlockHint: !hasRecord ? (reward.unlock_hint ?? undefined) : undefined,
          rarity: reward.rarity as RewardRarity,
        }
      })

      return { items: mappedItems, rawRewards: rewardRows }
    },
  })

  const items = data?.items ?? []

  async function saveToVault() {
    if (!pendingUnlock || !user) return
    await supabase
      .from('user_rewards')
      .update({ is_redeemed: true })
      .eq('user_id', user.id)
      .eq('reward_id', pendingUnlock.rewardId)

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

