export type LessonLevel = 'A1' | 'A2' | 'B1' | 'B2'
export type LessonCategory = 'vocabulary' | 'grammar' | 'listening' | 'speaking'
export type LessonStatus = 'locked' | 'available' | 'in_progress' | 'completed'

export interface Lesson {
  id: string
  title: string
  description: string
  level: LessonLevel
  category: LessonCategory
  durationMin: number
  exerciseCount: number
  completedCount: number
  status: LessonStatus
}
