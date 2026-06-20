import type { ComponentType } from 'react'
import { DinnerIllustration } from './illustrations/DinnerIllustration'
import { MassageIllustration } from './illustrations/MassageIllustration'
import { MakeupIllustration } from './illustrations/MakeupIllustration'
import { DateIllustration } from './illustrations/DateIllustration'
import { SurpriseIllustration } from './illustrations/SurpriseIllustration'

export type RewardCategory = 'dinner' | 'massage' | 'makeup' | 'date' | 'surprise'
export type RewardRarity = 'common' | 'rare' | 'special' | 'unique'

export interface RewardCategoryDef {
  label: string
  rarity: RewardRarity
  gradient: [string, string]
  Illustration: ComponentType<{ id: string }>
}

export const REWARD_CATEGORIES: Record<RewardCategory, RewardCategoryDef> = {
  dinner: {
    label: 'Cena',
    rarity: 'special',
    gradient: ['#FF8FE3', '#C13FCC'],
    Illustration: DinnerIllustration,
  },
  massage: {
    label: 'Masaje',
    rarity: 'special',
    gradient: ['#B794F6', '#7C4DFF'],
    Illustration: MassageIllustration,
  },
  makeup: {
    label: 'Maquillaje',
    rarity: 'rare',
    gradient: ['#FF6FB5', '#FF8FE3'],
    Illustration: MakeupIllustration,
  },
  date: {
    label: 'Plan juntos',
    rarity: 'unique',
    gradient: ['#9D6FFF', '#FF8FE3'],
    Illustration: DateIllustration,
  },
  surprise: {
    label: 'Sorpresa',
    rarity: 'common',
    gradient: ['#7C4DFF', '#C13FCC'],
    Illustration: SurpriseIllustration,
  },
}

export const RARITY_LABEL: Record<RewardRarity, string> = {
  common: 'Común',
  rare: 'Especial',
  special: 'Especial',
  unique: 'Única',
}

function escapeXml(str = ''): string {
  return String(str).replace(
    /[<>&'"]/g,
    (ch) =>
      ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[ch] ?? ch)
  )
}

const ILLUSTRATION_STRINGS: Record<RewardCategory, string> = {
  dinner: `<g>
    <path d="M 38 28 Q 38 42 50 44 Q 62 42 62 28 Z" fill="none" stroke="#ffffffdd" stroke-width="2" stroke-linecap="round" />
    <line x1="50" y1="44" x2="50" y2="62" stroke="#ffffffdd" stroke-width="2" stroke-linecap="round" />
    <line x1="41" y1="62" x2="59" y2="62" stroke="#ffffffdd" stroke-width="2" stroke-linecap="round" />
    <line x1="22" y1="26" x2="22" y2="60" stroke="#ffffffdd" stroke-width="1.8" stroke-linecap="round" />
    <line x1="19" y1="26" x2="19" y2="34" stroke="#ffffffdd" stroke-width="1.6" stroke-linecap="round" />
    <line x1="25" y1="26" x2="25" y2="34" stroke="#ffffffdd" stroke-width="1.6" stroke-linecap="round" />
    <line x1="78" y1="26" x2="78" y2="60" stroke="#ffffffdd" stroke-width="1.8" stroke-linecap="round" />
    <circle cx="20" cy="18" r="1.6" fill="#fff" opacity="0.9" />
    <circle cx="80" cy="20" r="1.2" fill="#fff" opacity="0.7" />
  </g>`,
  massage: `<g>
    <circle cx="50" cy="46" r="22" fill="none" stroke="#ffffffaa" stroke-width="1.6" opacity="0.5" />
    <circle cx="50" cy="46" r="15" fill="none" stroke="#ffffffcc" stroke-width="1.8" opacity="0.7" />
    <circle cx="50" cy="46" r="8" fill="none" stroke="#ffffffee" stroke-width="2" />
    <path d="M 30 24 Q 26 18 30 12 Q 34 18 30 24" fill="none" stroke="#ffffffcc" stroke-width="1.6" stroke-linecap="round" />
    <path d="M 70 22 Q 66 15 70 8 Q 74 15 70 22" fill="none" stroke="#ffffffcc" stroke-width="1.6" stroke-linecap="round" />
    <circle cx="50" cy="46" r="2.4" fill="#fff" />
  </g>`,
  makeup: `<g>
    <ellipse cx="44" cy="36" rx="16" ry="20" fill="none" stroke="#ffffffdd" stroke-width="2" />
    <line x1="44" y1="56" x2="44" y2="72" stroke="#ffffffdd" stroke-width="2" stroke-linecap="round" />
    <line x1="36" y1="72" x2="52" y2="72" stroke="#ffffffdd" stroke-width="2" stroke-linecap="round" />
    <g transform="translate(68, 22) rotate(35)">
      <rect x="-2" y="0" width="4" height="22" rx="2" fill="#ffffffdd" />
      <ellipse cx="0" cy="-4" rx="5" ry="7" fill="#ffffffee" />
    </g>
    <circle cx="26" cy="20" r="1.4" fill="#fff" opacity="0.9" />
    <circle cx="78" cy="50" r="1.2" fill="#fff" opacity="0.8" />
  </g>`,
  date: `<g>
    <path d="M 38 24 A 16 16 0 1 0 38 56 A 12 12 0 1 1 38 24 Z" fill="#ffffffdd" />
    <path d="M 62 24 A 16 16 0 1 1 62 56 A 12 12 0 1 0 62 24 Z" fill="none" stroke="#ffffffee" stroke-width="1.8" />
    <circle cx="50" cy="40" r="2" fill="#fff" />
    <circle cx="50" cy="16" r="1.3" fill="#fff" opacity="0.8" />
    <circle cx="50" cy="64" r="1.3" fill="#fff" opacity="0.8" />
  </g>`,
  surprise: `<g>
    <rect x="32" y="38" width="36" height="28" rx="2" fill="none" stroke="#ffffffdd" stroke-width="2" />
    <line x1="32" y1="50" x2="68" y2="50" stroke="#ffffffcc" stroke-width="1.8" />
    <line x1="50" y1="38" x2="50" y2="66" stroke="#ffffffcc" stroke-width="1.8" />
    <path d="M 50 38 Q 40 28 32 32 Q 36 40 50 38" fill="#ffffffcc" />
    <path d="M 50 38 Q 60 28 68 32 Q 64 40 50 38" fill="#ffffffcc" />
    <circle cx="38" cy="16" r="1.6" fill="#fff" opacity="0.9" />
    <circle cx="62" cy="16" r="1.6" fill="#fff" opacity="0.9" />
  </g>`,
}

export function buildRewardCardSvg(
  category: RewardCategory,
  title: string,
  subtitle: string,
  code: string,
  mode: 'dark' | 'light'
): string {
  const cat = REWARD_CATEGORIES[category]
  const [g1, g2] = cat.gradient
  const rarityRing = cat.rarity === 'unique' ? 3 : cat.rarity === 'common' ? 1.5 : 2
  const w = 320
  const h = 460
  const bgBase = mode === 'dark' ? '#1A0E2E' : '#FBF7FF'
  const textColor = mode === 'dark' ? '#F5F0FF' : '#2B1B42'
  const mutedColor = mode === 'dark' ? '#B8A9D9' : '#6B5A85'

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="cardBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${g1}" />
      <stop offset="100%" stop-color="${g2}" />
    </linearGradient>
    <radialGradient id="illusBg" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="${g2}" stop-opacity="0.9" />
      <stop offset="100%" stop-color="${g1}" stop-opacity="0.5" />
    </radialGradient>
  </defs>
  <rect width="${w}" height="${h}" rx="24" fill="${bgBase}" />
  <rect x="3" y="3" width="${w - 6}" height="${h - 6}" rx="21" fill="none" stroke="url(#cardBg)" stroke-width="${rarityRing * 2}" />
  <rect x="20" y="20" width="${w - 40}" height="${h - 110}" rx="16" fill="url(#illusBg)" />
  <g transform="translate(${w / 2 - 60}, 60) scale(1.2)">
    ${ILLUSTRATION_STRINGS[category]}
  </g>
  <text x="${w / 2}" y="${h - 168}" text-anchor="middle" font-family="Georgia, serif" font-size="13" letter-spacing="3" fill="#ffffffcc">${cat.label.toUpperCase()} · ${RARITY_LABEL[cat.rarity].toUpperCase()}</text>
  <text x="${w / 2}" y="${h - 120}" text-anchor="middle" font-family="Georgia, serif" font-size="24" font-weight="600" fill="${textColor}">${escapeXml(title)}</text>
  <text x="${w / 2}" y="${h - 92}" text-anchor="middle" font-family="Arial, sans-serif" font-size="12.5" fill="${mutedColor}">${escapeXml(subtitle)}</text>
  <line x1="32" y1="${h - 64}" x2="${w - 32}" y2="${h - 64}" stroke="${mutedColor}" stroke-opacity="0.3" stroke-dasharray="3,4" />
  <text x="${w / 2}" y="${h - 38}" text-anchor="middle" font-family="'Courier New', monospace" font-size="13" letter-spacing="2" fill="${textColor}">${escapeXml(code)}</text>
  <text x="${w / 2}" y="${h - 18}" text-anchor="middle" font-family="Arial, sans-serif" font-size="9.5" letter-spacing="1.5" fill="${mutedColor}">AURORA · CARTA DE RECOMPENSA</text>
</svg>`
}
