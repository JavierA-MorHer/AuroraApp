import { useRef } from 'react'
import { Camera } from 'lucide-react'
import { useThemeStore } from '@/stores/useThemeStore'
import { tokens } from '@/design-system/tokens'

interface ProfileAvatarProps {
  initials: string
  avatarUrl?: string | null
  onUpload?: (file: File) => Promise<void>
  uploading?: boolean
  size?: number
}

export function ProfileAvatar({
  initials,
  avatarUrl,
  onUpload,
  uploading = false,
  size = 88,
}: ProfileAvatarProps) {
  const { c } = useThemeStore()
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (onUpload) {
      await onUpload(file)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
      <button
        type="button"
        disabled={uploading}
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
          cursor: uploading ? 'not-allowed' : 'pointer',
          background: 'transparent',
        }}
      >
        {/* Avatar base o Imagen */}
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="Foto de perfil"
            style={{
              width: size,
              height: size,
              borderRadius: '50%',
              objectFit: 'cover',
              opacity: uploading ? 0.5 : 1,
            }}
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
              opacity: uploading ? 0.5 : 1,
            }}
          >
            {initials}
          </div>
        )}

        {/* Spinner de carga si está subiendo */}
        {uploading && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              background: 'rgba(0,0,0,0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: size * 0.28,
                height: size * 0.28,
                borderRadius: '50%',
                border: '2px solid rgba(255,255,255,0.3)',
                borderTop: '2px solid #ffffff',
                animation: 'avatarSpin 0.75s linear infinite',
              }}
            />
            <style>{`
              @keyframes avatarSpin {
                to { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        )}

        {/* Camera overlay clickable */}
        {!uploading && (
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
        )}

        {/* Small camera badge always visible */}
        {!uploading && (
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
        )}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        aria-hidden="true"
        disabled={uploading}
      />

      <p style={{ fontFamily: tokens.font.body, fontSize: 12, color: c.textFaint, margin: 0 }}>
        {uploading ? 'Subiendo foto...' : 'Toca para cambiar tu foto'}
      </p>
    </div>
  )
}
