import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/useAuthStore'
import { useThemeStore } from '@/stores/useThemeStore'
import { tokens } from '@/design-system'

function Splash() {
  const { c } = useThemeStore()
  return (
    <div
      style={{
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: c.bgDeep,
      }}
    >
      <span
        style={{
          fontFamily: tokens.font.mono,
          fontSize: 11,
          letterSpacing: 3,
          textTransform: 'uppercase',
          color: c.glow,
          opacity: 0.6,
        }}
      >
        Aurora
      </span>
    </div>
  )
}

/** Protege rutas que requieren sesión activa. */
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuthStore()
  if (isLoading) return <Splash />
  if (!user) return <Navigate to="/" replace />
  return <>{children}</>
}

/** Redirige al home si ya hay sesión (evita que el login se muestre logueado). */
export function GuestRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuthStore()
  if (isLoading) return <Splash />
  if (user) return <Navigate to="/home" replace />
  return <>{children}</>
}
