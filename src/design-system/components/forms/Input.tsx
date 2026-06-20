import { useState } from 'react'
import type { ChangeEvent } from 'react'
import { CircleX, CircleCheck } from 'lucide-react'
import { useThemeStore } from '@/stores/useThemeStore'
import { tokens } from '@/design-system/tokens'

type InputStatus = 'error' | 'success'

interface InputProps {
  label?: string
  placeholder?: string
  type?: string
  status?: InputStatus
  message?: string
  value?: string
  defaultValue?: string
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
}

export function Input({
  label,
  placeholder,
  type = 'text',
  status,
  message,
  value,
  defaultValue,
  onChange,
}: InputProps) {
  const { c } = useThemeStore()
  const [focused, setFocused] = useState(false)

  const statusColor =
    status === 'error' ? c.danger : status === 'success' ? c.success : null
  const borderColor = statusColor ?? (focused ? c.primary : c.border)

  return (
    <div>
      {label && (
        <label
          style={{
            display: 'block',
            fontFamily: tokens.font.body,
            fontSize: 13,
            fontWeight: 600,
            color: c.textMuted,
            marginBottom: 6,
          }}
        >
          {label}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          aria-invalid={status === 'error' || undefined}
          style={{
            width: '100%',
            background: c.bgDeep,
            border: `1.5px solid ${borderColor}`,
            borderRadius: tokens.radius.sm,
            padding: status ? '11px 40px 11px 14px' : '11px 14px',
            color: c.text,
            fontFamily: tokens.font.body,
            fontSize: 14,
            outline: 'none',
            boxShadow: focused ? `0 0 0 3px ${(statusColor ?? c.primary)}33` : 'none',
            transition: `all ${tokens.motion.duration.fast} ${tokens.motion.easing.standard}`,
            boxSizing: 'border-box',
          }}
        />
        {status && (
          <div
            style={{
              position: 'absolute',
              right: 12,
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          >
            {status === 'error' ? (
              <CircleX size={17} color={c.danger} />
            ) : (
              <CircleCheck size={17} color={c.success} />
            )}
          </div>
        )}
      </div>
      {message && (
        <p
          style={{
            fontFamily: tokens.font.body,
            fontSize: 12,
            marginTop: 6,
            marginBottom: 0,
            color: statusColor ?? c.textFaint,
          }}
        >
          {message}
        </p>
      )}
    </div>
  )
}
