import { Check } from 'lucide-react'
import { useThemeStore } from '@/stores/useThemeStore'
import { tokens } from '@/design-system/tokens'

interface StepperProps {
  steps: string[]
  current?: number
}

export function Stepper({ steps, current = 0 }: StepperProps) {
  const { c } = useThemeStore()

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {steps.map((step, i) => {
        const isDone = i < current
        const isActive = i === current

        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < steps.length - 1 ? 1 : undefined }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: isDone
                    ? `linear-gradient(135deg, ${c.primary}, ${c.secondary})`
                    : isActive
                    ? c.glowSoft
                    : c.bgSurfaceRaised,
                  border: isActive
                    ? `2px solid ${c.glow}`
                    : `1.5px solid ${isDone ? 'transparent' : c.border}`,
                  transition: `all ${tokens.motion.duration.base} ${tokens.motion.easing.standard}`,
                  flexShrink: 0,
                }}
              >
                {isDone ? (
                  <Check size={14} color="#fff" strokeWidth={3} />
                ) : (
                  <span
                    style={{
                      fontFamily: tokens.font.mono,
                      fontSize: 12,
                      fontWeight: 600,
                      color: isActive ? c.glow : c.textFaint,
                    }}
                  >
                    {i + 1}
                  </span>
                )}
              </div>
              <span
                style={{
                  fontFamily: tokens.font.body,
                  fontSize: 11,
                  color: isActive ? c.text : c.textFaint,
                  textAlign: 'center',
                  maxWidth: 70,
                }}
              >
                {step}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                style={{
                  flex: 1,
                  height: 2,
                  marginBottom: 18,
                  background: isDone ? c.primary : c.border,
                  transition: `background ${tokens.motion.duration.base} ${tokens.motion.easing.standard}`,
                }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
