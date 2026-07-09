export type LessonLevel = 'A1' | 'A2' | 'B1' | 'B2'
export type LessonCategory = 'vocabulary' | 'grammar' | 'listening' | 'speaking'
export type LessonStatus = 'locked' | 'available' | 'in_progress' | 'completed'
export type ExerciseType = 'multiple_choice' | 'fill_blank' | 'voice' | 'dictation'

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
  moduleId: string
  lessonOrder: number
  moduleOrder: number
}

export interface Module {
  id: string
  title: string
  description: string
  level: LessonLevel
  order: number
  lessons: Lesson[]
}

export type LevelStatus = 'available' | 'in_progress' | 'completed' | 'locked' | 'empty'

export interface LevelGroup {
  level: LessonLevel
  name: string
  description: string
  order: number
  modules: Module[]
  status: LevelStatus
}

export interface MultipleChoiceContent {
  question: string
  options: string[]
  answer: string
  explanation?: string
}

export interface FillBlankContent {
  sentence: string
  answer: string
  hint: string
  explanation?: string
}

export interface VoiceContent {
  target_phrase: string
  tip: string
  explanation?: string
}

export interface DictationContent {
  audio_text: string
  prompt: string
  explanation?: string
}

export interface Exercise {
  id: string
  lesson_id: string
  type: ExerciseType
  order: number
  content: MultipleChoiceContent | FillBlankContent | VoiceContent | DictationContent
  xp_reward: number
  difficulty: number
}
