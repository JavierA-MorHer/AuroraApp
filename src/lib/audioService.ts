import { supabase } from '@/lib/supabase'

// Cache to store generated audio Object URLs for the session
const ttsMemoryCache = new Map<string, string>()

/**
 * Plays English Text-to-Speech using OpenAI's TTS via Supabase Edge Functions,
 * with a seamless fallback to the browser's native window.speechSynthesis if offline/error.
 *
 * @param text The English phrase or word to speak.
 * @param voice OpenAI voices: 'nova', 'shimmer', 'alloy', 'echo', 'fable', 'onyx'.
 * @param speed Playback speed multiplier (e.g. 0.85).
 */
export async function playTTS(text: string, voice = 'nova', speed = 1.0): Promise<void> {
  const cacheKey = `${text.trim().toLowerCase()}_${voice}_${speed}`

  // 1. Check local session memory cache
  const cachedUrl = ttsMemoryCache.get(cacheKey)
  if (cachedUrl) {
    try {
      await playAudioUrl(cachedUrl, speed)
      return
    } catch (err) {
      console.warn('Cached Object URL failed to play. Re-fetching...', err)
      ttsMemoryCache.delete(cacheKey)
    }
  }

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
      const errText = await response.text().catch(() => '')
      throw new Error(`TTS server responded with status: ${response.status}. Details: ${errText}`)
    }

    const blob = await response.blob()
    const audioUrl = URL.createObjectURL(blob)

    // Save in session cache for instant future playbacks
    ttsMemoryCache.set(cacheKey, audioUrl)

    await playAudioUrl(audioUrl, speed)
  } catch (err) {
    console.warn('OpenAI TTS failed or is unconfigured. Falling back to native SpeechSynthesis...', err)
    await playNativeFallback(text, speed)
  }
}

function playAudioUrl(url: string, speed: number): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const audio = new Audio(url)
    audio.playbackRate = speed
    audio.onended = () => resolve()
    audio.onerror = (e) => reject(e)
    audio.play().catch(reject)
  })
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
