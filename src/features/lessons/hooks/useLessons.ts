import { MOCK_LESSONS } from '../data/mockLessons'
import type { LessonStatus } from '../types'

const STATUS_ORDER: Record<LessonStatus, number> = {
  in_progress: 0,
  available: 1,
  completed: 2,
  locked: 3,
}

export function useLessons() {
  // TODO: replace with useQuery(() => supabase.from('lessons').select('*'))
  const lessons = [...MOCK_LESSONS].sort(
    (a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status],
  )

  const completedCount = lessons.filter((l) => l.status === 'completed').length
  const totalCount = lessons.length

  return { lessons, completedCount, totalCount, isLoading: false }
}
