import { useRef, useState } from 'react'
import { Camera } from 'lucide-react'
import { useThemeStore } from '@/stores/useThemeStore'
import { tokens } from '@/design-system/tokens'

interface ProfileAvatarProps {
  initials: string
  size?: number
}

export function ProfileAvatar({ initials, size = 88 }: ProfileAvatarProps) {
  const { c } = useThemeStore()
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    // TODO: upload to Supabase Storage and update user metadata
    const reader = new FileReader()
    reader.onload = (ev) => setPreview(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="aurora-focusable"
        aria-label="Cambiar foto de perfil"
        style={{
          position: 'relative',
          width: size,
          height: size,
          borderRadius: '50%',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          background: 'transparent',
        }}
      >
        {/* Avatar base */}
        {preview ? (
          <img
            src={preview}
            alt="Foto de perfil"
            style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover' }}
          />
        ) : (
          <div
            style={{
              width: size,
              height: size,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${c.secondary}, ${c.primary})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: tokens.font.display,
              fontWeight: 600,
              color: '#fff',
              fontSize: size * 0.33,
            }}
          >
            {initials}
          </div>
        )}

        {/* Camera overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: 'rgba(0,0,0,0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0,
            transition: `opacity ${tokens.motion.duration.fast} ${tokens.motion.easing.standard}`,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = '1' }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = '0' }}
        >
          <Camera size={22} color="#fff" />
        </div>

        {/* Small camera badge always visible */}
        <div
          style={{
            position: 'absolute',
            bottom: 2,
            right: 2,
            width: 26,
            height: 26,
            borderRadius: '50%',
            background: c.primary,
            border: `2px solid ${c.bgSurface}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Camera size={12} color="#fff" />
        </div>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        aria-hidden="true"
      />

      <p style={{ fontFamily: tokens.font.body, fontSize: 12, color: c.textFaint, margin: 0 }}>
        Toca para cambiar tu foto
      </p>
    </div>
  )
}
