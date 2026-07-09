import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/useAuthStore'
import type { Lesson, LessonCategory, LessonLevel, LessonStatus, Module, LevelGroup, LevelStatus } from '../types'

type LevelRow  = { code: string; name: string; description: string | null; order: number }
type ModuleRow = { id: string; title: string; description: string | null; level: string; order: number }
type LessonRow = {
  id: string; title: string; description: string | null; level: string; category: string
  estimated_minutes: number | null; module_id: string; order: number; xp_reward: number
}
type ExerciseRow = { id: string; lesson_id: string }
type ProgressRow = { lesson_id: string; status: string; score: number | null }

export function useLessons() {
  const user = useAuthStore((s) => s.user)

  const { data, isLoading } = useQuery({
    queryKey: ['lessons', user?.id],
    queryFn: async () => {
      const [levelsRes, modulesRes, lessonsRes, exercisesRes, progressRes] = await Promise.all([
        supabase.from('levels').select('code, name, description, order').eq('is_active', true).order('order'),
        supabase.from('modules').select('id, title, description, level, order').eq('is_published', true).order('order'),
        supabase.from('lessons').select('id, title, description, level, category, estimated_minutes, module_id, order, xp_reward').eq('is_published', true).order('order'),
        supabase.from('exercises').select('id, lesson_id').eq('is_published', true),
        supabase.from('user_lesson_progress').select('lesson_id, status, score'),
      ])

      if (levelsRes.error) throw levelsRes.error
      if (modulesRes.error) throw modulesRes.error
      if (lessonsRes.error) throw lessonsRes.error

      const levelRows  = (levelsRes.data  ?? []) as LevelRow[]
      const moduleRows = (modulesRes.data ?? []) as ModuleRow[]
      const lessonRows = (lessonsRes.data ?? []) as LessonRow[]
      const exerciseRows = (exercisesRes.data ?? []) as ExerciseRow[]
      const progressRows = (progressRes.data ?? []) as ProgressRow[]

      const exerciseCountMap = new Map<string, number>()
      for (const ex of exerciseRows) {
        exerciseCountMap.set(ex.lesson_id, (exerciseCountMap.get(ex.lesson_id) ?? 0) + 1)
      }
      const progressMap = new Map(progressRows.map((p) => [p.lesson_id, p]))
      const moduleOrderMap = new Map(moduleRows.map((m) => [m.id, m.order]))
      const hasAnyProgress = progressRows.length > 0

      // Orden global para determinar cuál es la primera lección
      const sorted = [...lessonRows].sort((a, b) => {
        const modDiff = (moduleOrderMap.get(a.module_id) ?? 0) - (moduleOrderMap.get(b.module_id) ?? 0)
        return modDiff !== 0 ? modDiff : a.order - b.order
      })

      const lessons: Lesson[] = sorted.map((lesson, index): Lesson => {
        const progress = progressMap.get(lesson.id)
        const exerciseCount = exerciseCountMap.get(lesson.id) ?? 0
        const score = progress?.score ?? 0
        const completedCount = Math.round((score / 100) * exerciseCount)

        // El servidor es la fuente de verdad del status.
        // Único fallback cliente: si el usuario no tiene ningún progreso aún,
        // mostrar la primera lección como disponible (el trigger la inicializará
        // al completar, pero antes de la primera visita puede estar vacío).
        let status: LessonStatus
        if (progress?.status) {
          status = progress.status as LessonStatus
        } else if (!hasAnyProgress && index === 0) {
          status = 'available'
        } else {
          status = 'locked'
        }

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
          moduleId: lesson.module_id,
          lessonOrder: lesson.order,
          moduleOrder: moduleOrderMap.get(lesson.module_id) ?? 0,
        }
      })

      // Agrupar lecciones por módulo
      const lessonsByModule = new Map<string, Lesson[]>()
      for (const lesson of lessons) {
        const arr = lessonsByModule.get(lesson.moduleId) ?? []
        arr.push(lesson)
        lessonsByModule.set(lesson.moduleId, arr)
      }

      const modules: Module[] = moduleRows.map((mod) => ({
        id: mod.id,
        title: mod.title,
        description: mod.description ?? '',
        level: mod.level as LessonLevel,
        order: mod.order,
        lessons: lessonsByModule.get(mod.id) ?? [],
      }))

      // Agrupar módulos por nivel
      const modulesByLevel = new Map<string, Module[]>()
      for (const mod of modules) {
        const arr = modulesByLevel.get(mod.level) ?? []
        arr.push(mod)
        modulesByLevel.set(mod.level, arr)
      }

      // Construir grupos desde la tabla levels de la BD
      const levels: LevelGroup[] = levelRows.map((lr) => {
        const levelModules = modulesByLevel.get(lr.code) ?? []
        const levelLessons = levelModules.flatMap((m) => m.lessons)

        let status: LevelStatus
        if (levelModules.length === 0) {
          status = 'empty'
        } else if (levelLessons.every((l) => l.status === 'completed')) {
          status = 'completed'
        } else if (levelLessons.every((l) => l.status === 'locked')) {
          status = 'locked'
        } else if (levelLessons.some((l) => l.status === 'completed' || l.status === 'in_progress')) {
          status = 'in_progress'
        } else {
          status = 'available'
        }

        return {
          level: lr.code as LessonLevel,
          name: lr.name,
          description: lr.description ?? '',
          order: lr.order,
          modules: levelModules,
          status,
        }
      })

      return { levels, modules, lessons }
    },
    enabled: !!user,
  })

  const levels = data?.levels ?? []
  const lessons = data?.lessons ?? []
  const completedCount = lessons.filter((l) => l.status === 'completed').length
  const totalCount = lessons.length

  return { levels, lessons, completedCount, totalCount, isLoading }
}
