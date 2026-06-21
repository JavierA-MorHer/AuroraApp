import { useLocation, useNavigate } from 'react-router-dom'
import { Home, BookOpen, Gift, User } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useThemeStore } from '@/stores/useThemeStore'
import { tokens } from '@/design-system/tokens'

interface NavItem {
  key: string
  label: string
  icon: LucideIcon
  path: string
}

const NAV_ITEMS: NavItem[] = [
  { key: 'home',     label: 'Inicio',       icon: Home,     path: '/home' },
  { key: 'lessons',  label: 'Lecciones',    icon: BookOpen, path: '/lessons' },
  { key: 'rewards',  label: 'Recompensas',  icon: Gift,     path: '/rewards' },
  { key: 'profile',  label: 'Perfil',       icon: User,     path: '/profile' },
]

export function BottomNav() {
  const { c } = useThemeStore()
  const { pathname } = useLocation()
  const navigate = useNavigate()

  return (
    <nav
      role="navigation"
      aria-label="Navegación principal"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: tokens.zIndex.sticky,
        background: c.bgSurface,
        borderTop: `1px solid ${c.border}`,
        display: 'flex',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {NAV_ITEMS.map(({ key, label, icon: Icon, path }) => {
        const active = pathname === path
        return (
          <button
            key={key}
            onClick={() => navigate(path)}
            className="aurora-focusable"
            aria-label={label}
            aria-current={active ? 'page' : undefined}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              padding: '10px 0',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              minHeight: tokens.touchTarget.min,
            }}
          >
            <div
              style={{
                width: 36,
                height: 28,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: tokens.radius.full,
                background: active ? c.glowSoft : 'transparent',
                transition: `background ${tokens.motion.duration.fast} ${tokens.motion.easing.standard}`,
              }}
            >
              <Icon
                size={20}
                color={active ? c.primary : c.textFaint}
                strokeWidth={active ? 2.5 : 1.8}
              />
            </div>
            <span
              style={{
                fontFamily: tokens.font.body,
                fontSize: 10,
                fontWeight: active ? 700 : 500,
                color: active ? c.primary : c.textFaint,
                letterSpacing: 0.2,
              }}
            >
              {label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
