import { Outlet } from 'react-router-dom'
import { Page } from '@/design-system'
import { useAuthStore } from '@/stores/useAuthStore'
import { useStreak } from '@/features/profile/hooks/useStreak'
import { TopBar } from './TopBar'
import { BottomNav } from './BottomNav'

export function AppLayout() {
  const { user } = useAuthStore()
  const { streakDays, totalXp, level } = useStreak()

  const firstName: string = user?.user_metadata?.first_name ?? ''
  const lastName: string = user?.user_metadata?.last_name ?? ''
  const gender: 'male' | 'female' | null = user?.user_metadata?.gender ?? null
  const displayName = [firstName, lastName].filter(Boolean).join(' ') || 'Tú'
  const initials = [firstName[0], lastName[0]].filter(Boolean).join('').toUpperCase() || '?'
  const avatarUrl: string | null = user?.user_metadata?.avatar_url ?? null

  return (
    <Page padding="0">
      <TopBar
        initials={initials}
        avatarUrl={avatarUrl}
        name={displayName}
        gender={gender}
        streak={streakDays}
        level={level}
        totalXp={totalXp}
      />
      <Outlet />
      <BottomNav />
    </Page>
  )
}
