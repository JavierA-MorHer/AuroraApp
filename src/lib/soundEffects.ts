/**
 * Web Audio API based Synthesizer Service for Aurora UI Sound Effects.
 * Generates lightweight, instant, high-fidelity chimes programmatically with 0KB assets.
 * 
 * Optimized for Safari & mobile browser Autoplay policies by lazy-initializing 
 * and resuming a single shared AudioContext upon user interactions.
 */
class SoundEffectsService {
  private enabled = true
  private ctx: AudioContext | null = null

  constructor() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('aurora-sounds-enabled')
      this.enabled = saved !== 'false'
    }
  }

  isSoundEnabled(): boolean {
    return this.enabled
  }

  toggleSound(): boolean {
    this.enabled = !this.enabled
    localStorage.setItem('aurora-sounds-enabled', String(this.enabled))
    return this.enabled
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null
    
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioContextClass) return null
      this.ctx = new AudioContextClass()
    }

    // Safari policies keep the context suspended until a direct click/touch triggers playback.
    // We resume it programmatically here inside the user event handler execution stack.
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch((err) => console.debug('AudioContext resume failed:', err))
    }

    return this.ctx
  }

  /**
   * Ascending sweet chime (E5 -> A5) for correct answers.
   */
  playSuccess() {
    if (!this.enabled) return
    const ctx = this.getAudioContext()
    if (!ctx) return

    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.connect(gain)
    gain.connect(ctx.destination)

    // Tone 1: E5 (659.25 Hz)
    osc.frequency.setValueAtTime(659.25, now)
    gain.gain.setValueAtTime(0, now)
    gain.gain.linearRampToValueAtTime(0.12, now + 0.04)
    gain.gain.setValueAtTime(0.12, now + 0.08)

    // Tone 2: A5 (880.00 Hz)
    osc.frequency.setValueAtTime(880.00, now + 0.09)
    gain.gain.linearRampToValueAtTime(0.16, now + 0.12)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6)

    osc.start(now)
    osc.stop(now + 0.65)
  }

  /**
   * Soft double buzz downward (C3 -> A2) for incorrect answers.
   */
  playError() {
    if (!this.enabled) return
    const ctx = this.getAudioContext()
    if (!ctx) return

    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    // Using triangle waveform for a softer, non-aggressive sound
    osc.type = 'triangle'
    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.frequency.setValueAtTime(130.81, now) // C3
    osc.frequency.linearRampToValueAtTime(110.00, now + 0.15) // A2

    gain.gain.setValueAtTime(0, now)
    gain.gain.linearRampToValueAtTime(0.2, now + 0.03)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45)

    osc.start(now)
    osc.stop(now + 0.5)
  }

  /**
   * Magical swift arpeggio cascade for unlocking items and rewards.
   */
  playUnlock() {
    if (!this.enabled) return
    const ctx = this.getAudioContext()
    if (!ctx) return

    const now = ctx.currentTime
    // Rapidly arpeggiating note frequencies
    const notes = [523.25, 783.99, 1046.50, 1567.98, 2093.00] // C5, G5, C6, G6, C7

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.connect(gain)
      gain.connect(ctx.destination)

      const startNoteTime = now + (idx * 0.05)
      osc.frequency.setValueAtTime(freq, startNoteTime)

      gain.gain.setValueAtTime(0, startNoteTime)
      gain.gain.linearRampToValueAtTime(0.08, startNoteTime + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, startNoteTime + 0.35)

      osc.start(startNoteTime)
      osc.stop(startNoteTime + 0.4)
    })
  }

  /**
   * Joyful bell harmony arpeggio for completing a lesson.
   */
  playCompleted() {
    if (!this.enabled) return
    const ctx = this.getAudioContext()
    if (!ctx) return

    const now = ctx.currentTime
    const notes = [523.25, 659.25, 783.99, 1046.50] // C5, E5, G5, C6

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.connect(gain)
      gain.connect(ctx.destination)

      const startNoteTime = now + (idx * 0.1)
      osc.frequency.setValueAtTime(freq, startNoteTime)

      gain.gain.setValueAtTime(0, startNoteTime)
      gain.gain.linearRampToValueAtTime(0.12, startNoteTime + 0.05)
      gain.gain.exponentialRampToValueAtTime(0.0001, startNoteTime + 0.8)

      osc.start(startNoteTime)
      osc.stop(startNoteTime + 0.855)
    })
  }
}

export const soundEffects = new SoundEffectsService()
export default soundEffects
