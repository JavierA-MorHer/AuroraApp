export interface ThemeColors {
  bgDeep: string
  bgSurface: string
  bgSurfaceRaised: string
  primary: string
  primaryDim: string
  secondary: string
  glow: string
  glowSoft: string
  success: string
  warning: string
  danger: string
  text: string
  textMuted: string
  textFaint: string
  border: string
  starColor: string
  heroGradient: string
  shadowSm: string
  shadow: string
  shadowLg: string
  shadowXl: string
  focusRing: string
}

export type ThemeMode = 'dark' | 'light'

export const themes: Record<ThemeMode, ThemeColors> = {
  dark: {
    bgDeep: '#1A0E2E',
    bgSurface: '#2A1B45',
    bgSurfaceRaised: '#35225A',
    primary: '#C13FCC',
    primaryDim: '#8C2E94',
    secondary: '#7C4DFF',
    glow: '#FF8FE3',
    glowSoft: '#FF8FE333',
    success: '#4ADE80',
    warning: '#FBBF24',
    danger: '#FB7185',
    text: '#F5F0FF',
    textMuted: '#B8A9D9',
    textFaint: '#7A6896',
    border: '#3F2B63',
    starColor: '#FFFFFF',
    heroGradient: 'linear-gradient(135deg, #fff, #FF8FE3)',
    shadowSm: '0 2px 6px rgba(0,0,0,0.2)',
    shadow: '0 4px 16px rgba(0,0,0,0.25)',
    shadowLg: '0 20px 60px rgba(0,0,0,0.5)',
    shadowXl: '0 28px 80px rgba(0,0,0,0.6)',
    focusRing: '#FF8FE3',
  },
  light: {
    bgDeep: '#FBF7FF',
    bgSurface: '#FFFFFF',
    bgSurfaceRaised: '#F6EEFC',
    primary: '#B82FC2',
    primaryDim: '#9421A0',
    secondary: '#6C3CE9',
    glow: '#E0249A',
    glowSoft: '#E0249A22',
    success: '#16A34A',
    warning: '#D97706',
    danger: '#E11D48',
    text: '#2B1B42',
    textMuted: '#6B5A85',
    textFaint: '#9C8BB5',
    border: '#E7D9F4',
    starColor: '#B82FC2',
    heroGradient: 'linear-gradient(135deg, #B82FC2, #6C3CE9)',
    shadowSm: '0 1px 4px rgba(120,60,160,0.06)',
    shadow: '0 2px 12px rgba(120,60,160,0.08)',
    shadowLg: '0 20px 60px rgba(120,60,160,0.18)',
    shadowXl: '0 28px 90px rgba(120,60,160,0.24)',
    focusRing: '#B82FC2',
  },
}
