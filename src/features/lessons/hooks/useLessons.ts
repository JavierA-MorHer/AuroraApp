import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/useAuthStore'
import type { Lesson, LessonCategory, LessonLevel, LessonStatus } from '../types'

type LessonRow = {
  id: string
  title: string
  description: string | null
  level: string
  category: string
  estimated_minutes: number | null
  module_id: string
  order: number
  xp_reward: number
  is_published: boolean
  created_at: string
  updated_at: string
}

type ExerciseRow = { id: string; lesson_id: string }

type ProgressRow = { lesson_id: string; status: string; score: number | null }

const STATUS_ORDER: Record<LessonStatus, number> = {
  in_progress: 0,
  available: 1,
  completed: 2,
  locked: 3,
}

export function useLessons() {
  const user = useAuthStore((s) => s.user)

  const { data: lessons = [], isLoading } = useQuery({
    queryKey: ['lessons', user?.id],
    queryFn: async () => {
      const [lessonsResult, exercisesResult, progressResult] = await Promise.all([
        supabase.from('lessons').select('*').eq('is_published', true).order('order'),
        supabase.from('exercises').select('id, lesson_id').eq('is_published', true),
        supabase.from('user_lesson_progress').select('lesson_id, status, score'),
      ])

      if (lessonsResult.error) throw lessonsResult.error

      const lessonRows = (lessonsResult.data ?? []) as LessonRow[]
      const exerciseRows = (exercisesResult.data ?? []) as ExerciseRow[]
      const progressRows = (progressResult.data ?? []) as ProgressRow[]

      const exerciseCountMap = new Map<string, number>()
      for (const ex of exerciseRows) {
        exerciseCountMap.set(ex.lesson_id, (exerciseCountMap.get(ex.lesson_id) ?? 0) + 1)
      }

      const progressMap = new Map(progressRows.map((p) => [p.lesson_id, p]))

      return lessonRows
        .map((lesson, index): Lesson => {
          const progress = progressMap.get(lesson.id)
          const exerciseCount = exerciseCountMap.get(lesson.id) ?? 0
          const status = (progress?.status ?? (index === 0 ? 'available' : 'locked')) as LessonStatus
          const score = progress?.score ?? 0
          const completedCount = Math.round((score / 100) * exerciseCount)

          return {
            id: lesson.id,
            title: lesson.title,
            description: lesson.description ?? '',
            level: lesson.level as LessonLevel,
            category: lesson.category as LessonCategory,
            durationMin: lesson.estimated_minutes ?? 10,
            exerciseCount,
            completedCount,
            status,
          }
        })
        .sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status])
    },
  })

  const completedCount = lessons.filter((l) => l.status === 'completed').length
  const totalCount = lessons.length

  return { lessons, completedCount, totalCount, isLoading }
}
