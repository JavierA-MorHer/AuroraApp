import { useRef } from 'react'
import { tokens } from '@/design-system/tokens'
import { REWARD_CATEGORIES } from './rewardCategories'
import type { RewardCategory } from './rewardCategories'

interface RewardCardMiniProps {
  category: RewardCategory
  title: string
  onClick?: () => void
}

export function RewardCardMini({ category, title, onClick }: RewardCardMiniProps) {
  const cat = REWARD_CATEGORIES[category]
  const [g1, g2] = cat.gradient
  const { Illustration } = cat
  const id = useRef(`mini-${Math.random().toString(36).slice(2, 9)}`).current

  return (
    <button
      onClick={onClick}
      className="aurora-focusable"
      style={{
        aspectRatio: '0.69',
        borderRadius: 16,
        border: 'none',
        cursor: 'pointer',
        padding: 10,
        background: `linear-gradient(160deg, ${g2}, ${g1})`,
        boxShadow: `0 6px 18px ${g2}44`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        transition: `transform ${tokens.motion.duration.fast} ${tokens.motion.easing.standard}`,
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.transform = 'translateY(-3px) scale(1.03)')
      }
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0) scale(1)')}
    >
      <svg viewBox="0 0 100 100" width="56%" height="56%">
        <Illustration id={id} />
      </svg>
      <span
        style={{
          fontFamily: tokens.font.body,
          fontSize: 10.5,
          fontWeight: 600,
          color: '#fff',
          textAlign: 'center',
          lineHeight: 1.3,
          padding: '0 4px',
        }}
      >
        {title}
      </span>
    </button>
  )
}
