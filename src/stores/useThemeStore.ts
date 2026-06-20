import { create } from 'zustand'
import { themes } from '@/design-system/tokens/colors'
import type { ThemeColors, ThemeMode } from '@/design-system/tokens/colors'

interface ThemeStore {
  mode: ThemeMode
  c: ThemeColors
  toggle: () => void
  setMode: (mode: ThemeMode) => void
}

export const useThemeStore = create<ThemeStore>((set) => ({
  mode: 'dark',
  c: themes.dark,
  toggle: () =>
    set((s) => {
      const next: ThemeMode = s.mode === 'dark' ? 'light' : 'dark'
      return { mode: next, c: themes[next] }
    }),
  setMode: (mode: ThemeMode) => set({ mode, c: themes[mode] }),
}))
