import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/useAuthStore'

export interface WordOfDay {
  id: string
  word: string
  translation: string
  partOfSpeech: string
  example: string
  exampleEs: string
  phonetic: string | null
}

function getDayOfYear(): number {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  const diff = now.getTime() - start.getTime()
  return Math.floor(diff / 86_400_000)
}

export function useWordOfDay() {
  const user = useAuthStore((s) => s.user)

  const { data, isLoading } = useQuery<WordOfDay | null>({
    queryKey: ['word-of-day', getDayOfYear()],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('words_of_day')
        .select('id, word, translation, part_of_speech, example, example_es, phonetic')
        .eq('day_of_year', getDayOfYear())
        .single()

      if (error || !data) return null

      return {
        id: data.id,
        word: data.word,
        translation: data.translation,
        partOfSpeech: data.part_of_speech,
        example: data.example,
        exampleEs: data.example_es,
        phonetic: data.phonetic ?? null,
      }
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 60, // 1 hora — la palabra no cambia en el día
  })

  return { word: data ?? null, isLoading }
}
