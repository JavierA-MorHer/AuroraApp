import { supabase } from '@/lib/supabase'

/**
 * Plays English Text-to-Speech using OpenAI's TTS via Supabase Edge Functions,
 * with a seamless fallback to the browser's native window.speechSynthesis if offline/error.
 *
 * @param text The English phrase or word to speak.
 * @param voice OpenAI voices: 'nova', 'shimmer', 'alloy', 'echo', 'fable', 'onyx'.
 * @param speed Playback speed multiplier (e.g. 0.85).
 */
export async function playTTS(text: string, voice = 'nova', speed = 1.0): Promise<void> {
  try {
    const { data: { session } } = await supabase.auth.getSession()

    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/openai-audio?action=tts`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token || ''}`,
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY || '',
        },
        body: JSON.stringify({ text, voice, speed }),
      }
    )

    if (!response.ok) {
      throw new Error(`TTS server responded with status: ${response.status}`)
    }

    const blob = await response.blob()
    const audioUrl = URL.createObjectURL(blob)
    const audio = new Audio(audioUrl)
    audio.playbackRate = speed

    await new Promise<void>((resolve, reject) => {
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl)
        resolve()
      }
      audio.onerror = (e) => {
        URL.revokeObjectURL(audioUrl)
        reject(e)
      }
      audio.play().catch(reject)
    })
  } catch (err) {
    console.warn('OpenAI TTS failed or is unconfigured. Falling back to native SpeechSynthesis...', err)
    await playNativeFallback(text, speed)
  }
}

function playNativeFallback(text: string, speed = 1.0): Promise<void> {
  return new Promise<void>((resolve) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      resolve()
      return
    }

    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'en-US'
    utterance.rate = speed * 0.95 // Native synthesis tends to go slightly faster than OpenAI

    utterance.onend = () => resolve()
    utterance.onerror = () => resolve() // resolve anyway to reset loading states
    
    window.speechSynthesis.speak(utterance)
  })
}
