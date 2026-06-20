import { useState } from 'react'

interface Particle {
  id: number
  angle: number
  distance: number
  size: number
  delay: number
  duration: number
  color: string
  isStar: boolean
}

interface ParticleBurstProps {
  colors: string[]
}

export function ParticleBurst({ colors }: ParticleBurstProps) {
  const [particles] = useState<Particle[]>(() =>
    Array.from({ length: 24 }, (_, i) => ({
      id: i,
      angle: (i / 24) * 360 + Math.random() * 15,
      distance: 60 + Math.random() * 90,
      size: Math.random() * 4 + 3,
      delay: Math.random() * 0.15,
      duration: 0.9 + Math.random() * 0.6,
      color: colors[i % colors.length],
      isStar: Math.random() > 0.5,
    }))
  )

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {particles.map((p) => {
        const rad = (p.angle * Math.PI) / 180
        const x = Math.cos(rad) * p.distance
        const y = Math.sin(rad) * p.distance

        return (
          <div
            key={p.id}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: p.size,
              height: p.size,
              background: p.color,
              borderRadius: p.isStar ? '2px' : '50%',
              transform: `rotate(${p.angle}deg)`,
              animation: `burstOut${p.id % 4} ${p.duration}s ${p.delay}s cubic-bezier(0.16, 1, 0.3, 1) forwards`,
              opacity: 0,
              ['--tx' as string]: `${x}px`,
              ['--ty' as string]: `${y}px`,
            }}
          />
        )
      })}
      <style>{`
        ${[0, 1, 2, 3]
          .map(
            (i) => `
          @keyframes burstOut${i} {
            0% { opacity: 1; transform: translate(-50%, -50%) scale(0.4); }
            70% { opacity: 1; }
            100% { transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(1); opacity: 0; }
          }
        `
          )
          .join('\n')}
      `}</style>
    </div>
  )
}
