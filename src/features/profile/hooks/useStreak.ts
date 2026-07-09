import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/useAuthStore'

function getCurrentWeekDates(): string[] {
  const today = new Date()
  const dayOfWeek = today.getDay() // 0=Sun, 1=Mon
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
  const monday = new Date(today)
  monday.setDate(today.getDate() + diff)

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d.toISOString().slice(0, 10)
  })
}

export function useStreak() {
  const user = useAuthStore((s) => s.user)

  const { data } = useQuery({
    queryKey: ['streak', user?.id],
    queryFn: async () => {
      const weekDates = getCurrentWeekDates()

      const [profileRes, activityRes] = await Promise.all([
        supabase
          .from('profiles')
          .select('streak_days, last_streak_date, total_xp, level')
          .eq('id', user!.id)
          .single(),
        supabase
          .from('user_daily_activity')
          .select('activity_date, xp_earned')
          .eq('user_id', user!.id)
          .in('activity_date', weekDates),
      ])

      if (profileRes.error) throw profileRes.error

      const { streak_days, last_streak_date, total_xp, level } = profileRes.data

      // Si la última actividad fue hace más de un día, la racha se cortó
      let streakDays = streak_days
      if (last_streak_date) {
        const today = new Date().toISOString().slice(0, 10)
        const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10)
        if (last_streak_date !== today && last_streak_date !== yesterday) {
          streakDays = 0
        }
      }

      const activeDates = new Set(activityRes.data?.map((r) => r.activity_date) ?? [])
      const activeDays = weekDates.map((date) => activeDates.has(date))

      // Buscar si hay XP ganada hoy
      const todayString = new Date().toISOString().slice(0, 10)
      const todayXp = activityRes.data?.find((r) => r.activity_date === todayString)?.xp_earned ?? 0

      // Meta diaria de XP guardada localmente
      const savedGoal = typeof window !== 'undefined' ? localStorage.getItem('aurora-daily-xp-goal') : '50'
      const dailyGoal = savedGoal ? parseInt(savedGoal, 10) : 50

      return { 
        streakDays, 
        activeDays, 
        totalXp: total_xp ?? 0, 
        todayXp, 
        dailyGoal,
        level: level ?? 1
      }
    },
    enabled: !!user,
  })

  return {
    streakDays: data?.streakDays ?? 0,
    activeDays: data?.activeDays ?? Array(7).fill(false) as boolean[],
    totalXp: data?.totalXp ?? 0,
    todayXp: data?.todayXp ?? 0,
    dailyGoal: data?.dailyGoal ?? 50,
    level: data?.level ?? 1,
  }
}
