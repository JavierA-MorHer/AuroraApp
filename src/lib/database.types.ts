export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type LessonLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
export type LessonCategory = 'vocabulary' | 'grammar' | 'listening' | 'speaking' | 'writing'
export type ExerciseType = 'voice' | 'dictation' | 'writing' | 'multiple_choice' | 'fill_blank'
export type ProgressStatus = 'locked' | 'available' | 'in_progress' | 'completed'
export type ExerciseStatus = 'completed' | 'skipped' | 'failed'
export type RewardCategory = 'surprise' | 'dinner' | 'date' | 'massage' | 'makeup'
export type ConditionType =
  | 'module_completed'
  | 'lesson_completed'
  | 'streak_reached'
  | 'xp_reached'
  | 'exercises_completed'
  | 'lessons_count'
export type XpSource =
  | 'exercise_completed'
  | 'lesson_completed'
  | 'streak_bonus'
  | 'reward_bonus'
  | 'manual_adjustment'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          first_name: string
          last_name: string | null
          avatar_url: string | null
          streak_days: number
          longest_streak: number
          last_streak_date: string | null
          total_xp: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          first_name: string
          last_name?: string | null
          avatar_url?: string | null
          streak_days?: number
          longest_streak?: number
          last_streak_date?: string | null
          total_xp?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          first_name?: string
          last_name?: string | null
          avatar_url?: string | null
          streak_days?: number
          longest_streak?: number
          last_streak_date?: string | null
          total_xp?: number
          updated_at?: string
        }
      }
      user_settings: {
        Row: {
          id: string
          user_id: string
          daily_goal_minutes: number
          notifications_enabled: boolean
          reminder_time: string | null
          ui_language: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          daily_goal_minutes?: number
          notifications_enabled?: boolean
          reminder_time?: string | null
          ui_language?: string
        }
        Update: {
          daily_goal_minutes?: number
          notifications_enabled?: boolean
          reminder_time?: string | null
          ui_language?: string
        }
      }
      user_daily_activity: {
        Row: {
          id: string
          user_id: string
          activity_date: string
          minutes_studied: number
          xp_earned: number
          exercises_completed: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          activity_date: string
          minutes_studied?: number
          xp_earned?: number
          exercises_completed?: number
        }
        Update: {
          minutes_studied?: number
          xp_earned?: number
          exercises_completed?: number
        }
      }
      modules: {
        Row: {
          id: string
          title: string
          description: string | null
          level: LessonLevel
          order: number
          thumbnail_url: string | null
          estimated_minutes: number | null
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          level: LessonLevel
          order: number
          thumbnail_url?: string | null
          estimated_minutes?: number | null
          is_published?: boolean
        }
        Update: {
          title?: string
          description?: string | null
          level?: LessonLevel
          order?: number
          thumbnail_url?: string | null
          estimated_minutes?: number | null
          is_published?: boolean
        }
      }
      lessons: {
        Row: {
          id: string
          module_id: string
          title: string
          description: string | null
          level: LessonLevel
          category: LessonCategory
          order: number
          xp_reward: number
          estimated_minutes: number | null
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          module_id: string
          title: string
          description?: string | null
          level: LessonLevel
          category: LessonCategory
          order: number
          xp_reward?: number
          estimated_minutes?: number | null
          is_published?: boolean
        }
        Update: {
          title?: string
          description?: string | null
          level?: LessonLevel
          category?: LessonCategory
          order?: number
          xp_reward?: number
          estimated_minutes?: number | null
          is_published?: boolean
        }
      }
      exercises: {
        Row: {
          id: string
          lesson_id: string
          type: ExerciseType
          order: number
          content: Json
          xp_reward: number
          difficulty: number
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          lesson_id: string
          type: ExerciseType
          order: number
          content: Json
          xp_reward?: number
          difficulty?: number
          is_published?: boolean
        }
        Update: {
          type?: ExerciseType
          order?: number
          content?: Json
          xp_reward?: number
          difficulty?: number
          is_published?: boolean
        }
      }
      user_module_progress: {
        Row: {
          id: string
          user_id: string
          module_id: string
          status: ProgressStatus
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          module_id: string
          status?: ProgressStatus
          completed_at?: string | null
        }
        Update: {
          status?: ProgressStatus
          completed_at?: string | null
        }
      }
      user_lesson_progress: {
        Row: {
          id: string
          user_id: string
          lesson_id: string
          status: ProgressStatus
          last_exercise_id: string | null
          score: number | null
          attempts: number
          completed_at: string | null
          last_accessed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          lesson_id: string
          status?: ProgressStatus
          last_exercise_id?: string | null
          score?: number | null
          attempts?: number
          completed_at?: string | null
          last_accessed_at?: string | null
        }
        Update: {
          status?: ProgressStatus
          last_exercise_id?: string | null
          score?: number | null
          attempts?: number
          completed_at?: string | null
          last_accessed_at?: string | null
        }
      }
      user_exercise_progress: {
        Row: {
          id: string
          user_id: string
          exercise_id: string
          lesson_progress_id: string
          status: ExerciseStatus
          score: number | null
          response: Json | null
          time_spent_seconds: number | null
          completed_at: string
        }
        Insert: {
          id?: string
          user_id: string
          exercise_id: string
          lesson_progress_id: string
          status: ExerciseStatus
          score?: number | null
          response?: Json | null
          time_spent_seconds?: number | null
          completed_at?: string
        }
        Update: never
      }
      xp_transactions: {
        Row: {
          id: string
          user_id: string
          amount: number
          source: XpSource
          reference_id: string | null
          reference_type: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          source: XpSource
          reference_id?: string | null
          reference_type?: string | null
        }
        Update: never
      }
      rewards: {
        Row: {
          id: string
          title: string
          description: string | null
          unlock_hint: string | null
          category: RewardCategory
          code: string | null
          icon: string | null
          condition_type: ConditionType
          condition_value: Json
          is_active: boolean
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          unlock_hint?: string | null
          category: RewardCategory
          code?: string | null
          icon?: string | null
          condition_type: ConditionType
          condition_value: Json
          is_active?: boolean
          display_order?: number
        }
        Update: {
          title?: string
          description?: string | null
          unlock_hint?: string | null
          category?: RewardCategory
          code?: string | null
          icon?: string | null
          condition_type?: ConditionType
          condition_value?: Json
          is_active?: boolean
          display_order?: number
        }
      }
      user_rewards: {
        Row: {
          id: string
          user_id: string
          reward_id: string
          unlocked_at: string
          is_redeemed: boolean
          redeemed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          reward_id: string
          unlocked_at?: string
          is_redeemed?: boolean
          redeemed_at?: string | null
        }
        Update: {
          is_redeemed?: boolean
          redeemed_at?: string | null
        }
      }
    }
    Views: Record<string, never>
    Functions: {
      record_daily_activity: {
        Args: {
          p_user_id: string
          p_xp_earned: number
          p_minutes_studied?: number
        }
        Returns: void
      }
    }
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
