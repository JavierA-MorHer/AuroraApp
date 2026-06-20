import { useRef } from 'react'
import { Download } from 'lucide-react'
import { useThemeStore } from '@/stores/useThemeStore'
import { tokens } from '@/design-system/tokens'
import { Button } from '../../primitives/Button'
import { Starfield } from '../../layout/Starfield'
import {
  REWARD_CATEGORIES,
  RARITY_LABEL,
  buildRewardCardSvg,
} from './rewardCategories'
import type { RewardCategory } from './rewardCategories'

interface RewardCardProps {
  category?: RewardCategory
  title: string
  subtitle: string
  code: string
  size?: number
}

export function RewardCard({
  category = 'dinner',
  title,
  subtitle,
  code,
  size = 220,
}: RewardCardProps) {
  const { c, mode } = useThemeStore()
  const cardId = useRef(`card-${Math.random().toString(36).slice(2, 9)}`).current
  const cat = REWARD_CATEGORIES[category]
  const [g1, g2] = cat.gradient
  const { Illustration } = cat
  const rarityRing = cat.rarity === 'unique' ? 3 : cat.rarity === 'common' ? 1.5 : 2

  function handleDownload() {
    const svgString = buildRewardCardSvg(category, title, subtitle, code, mode)
    const blob = new Blob([svgString], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `aurora-carta-${category}-${code}.svg`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const bgColor = mode === 'dark' ? c.bgDeep : '#FFFFFF'

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <div
        style={{
          width: size,
          height: size * 1.44,
          borderRadius: 20,
          background: bgColor,
          border: `${rarityRing}px solid transparent`,
          backgroundImage: `linear-gradient(${bgColor}, ${bgColor}), linear-gradient(135deg, ${g1}, ${g2})`,
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box',
          boxShadow: `0 12px 36px ${g2}44, ${c.shadowLg}`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: 16,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* halo de fondo de ilustración */}
        <div
          style={{
            width: '100%',
            aspectRatio: '1.1',
            borderRadius: 14,
            marginBottom: 12,
            background: `radial-gradient(circle at 50% 40%, ${g2}, ${g1})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Starfield density={10} />
          <svg viewBox="0 0 100 100" width="62%" height="62%" style={{ position: 'relative' }}>
            <Illustration id={cardId} />
          </svg>
        </div>

        <span
          style={{
            fontFamily: tokens.font.mono,
            fontSize: 9.5,
            letterSpacing: 2,
            color: '#ffffffaa',
            marginBottom: 4,
            textAlign: 'center',
          }}
        >
          {cat.label.toUpperCase()} · {RARITY_LABEL[cat.rarity].toUpperCase()}
        </span>
        <h3
          style={{
            fontFamily: tokens.font.display,
            fontSize: 17,
            fontWeight: 600,
            color: c.text,
            textAlign: 'center',
            margin: '0 0 4px',
            lineHeight: 1.2,
          }}
        >
          {title}
        </h3>
        <p
          style={{
            fontFamily: tokens.font.body,
            fontSize: 11,
            color: c.textMuted,
            textAlign: 'center',
            margin: '0 0 10px',
            lineHeight: 1.4,
          }}
        >
          {subtitle}
        </p>
        <div style={{ width: '100%', borderTop: `1px dashed ${c.border}`, marginBottom: 8 }} />
        <span style={{ fontFamily: tokens.font.mono, fontSize: 11.5, letterSpacing: 1.5, color: c.text }}>
          {code}
        </span>
      </div>
      <Button variant="secondary" size="sm" icon={Download} onClick={handleDownload}>
        Descargar carta
      </Button>
    </div>
  )
}
