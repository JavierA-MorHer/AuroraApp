import { useState } from 'react'
import { useThemeStore } from '@/stores/useThemeStore'

interface StarfieldProps {
  density?: number
}

interface Star {
  id: number
  x: number
  y: number
  size: number
  delay: number
  duration: number
}

export function Starfield({ density = 40 }: StarfieldProps) {
  const { mode, c } = useThemeStore()
  const [stars] = useState<Star[]>(() =>
    Array.from({ length: density }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.8 + 0.6,
      delay: Math.random() * 4,
      duration: Math.random() * 3 + 2,
    }))
  )

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {stars.map((s) => (
        <div
          key={s.id}
          style={{
            position: 'absolute',
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            borderRadius: '50%',
            background: c.starColor,
            opacity: mode === 'dark' ? 0.5 : 0.35,
            animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}
    </div>
  )
}
