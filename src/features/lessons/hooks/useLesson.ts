import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Exercise } from '../types'

interface LessonInfo {
  id: string
  title: string
  category: string
  level: string
  xp_reward: number
  module_id: string
  estimated_minutes: number | null
}

export function useLesson(lessonId: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['lesson', lessonId],
    queryFn: async () => {
      const [lessonRes, exercisesRes] = await Promise.all([
        supabase
          .from('lessons')
          .select('id, title, category, level, xp_reward, module_id, estimated_minutes')
          .eq('id', lessonId)
          .single(),
        supabase
          .from('exercises')
          .select('id, lesson_id, type, order, content, xp_reward, difficulty')
          .eq('lesson_id', lessonId)
          .eq('is_published', true)
          .order('order'),
      ])

      if (lessonRes.error) throw lessonRes.error
      if (exercisesRes.error) throw exercisesRes.error

      return {
        lesson: lessonRes.data as LessonInfo,
        exercises: (exercisesRes.data ?? []) as Exercise[],
      }
    },
    enabled: !!lessonId,
  })

  return {
    lesson: data?.lesson ?? null,
    exercises: data?.exercises ?? [],
    isLoading,
    error,
  }
}
