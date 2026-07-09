import { Controller } from 'react-hook-form'
import { Save, LogOut, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { useThemeStore } from '@/stores/useThemeStore'
import {
  Container,
  Stack,
  Card,
  Button,
  Input,
  AlertDialog,
  SegmentedControl,
  tokens,
} from '@/design-system'
import { ProfileAvatar } from '@/features/profile/components/ProfileAvatar'
import { useProfile } from '@/features/profile/hooks/useProfile'
import { useAuthStore } from '@/stores/useAuthStore'

const TOP_BAR_H = 60
const BOTTOM_NAV_H = 70

function SectionLabel({ children }: { children: string }) {
  const { c } = useThemeStore()
  return (
    <p
      style={{
        fontFamily: tokens.font.mono,
        fontSize: 11,
        letterSpacing: 1.5,
        textTransform: 'uppercase',
        color: c.textFaint,
        margin: 0,
      }}
    >
      {children}
    </p>
  )
}

export default function Profile() {
  const { c } = useThemeStore()
  const { user } = useAuthStore()
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)

  const firstName: string = user?.user_metadata?.first_name ?? ''
  const lastName: string = user?.user_metadata?.last_name ?? ''
  const initials = [firstName[0], lastName[0]].filter(Boolean).join('').toUpperCase() || '?'

  const {
    profileForm,
    passwordForm,
    profileSaved,
    passwordSaved,
    signOutDialogOpen,
    setSignOutDialogOpen,
    onSaveProfile,
    onSavePassword,
    signOut,
  } = useProfile()

  const pErr = profileForm.formState.errors
  const wErr = passwordForm.formState.errors

  return (
    <>
      <Container size="sm">
        <div
          style={{
            paddingTop: TOP_BAR_H + 24,
            paddingBottom: BOTTOM_NAV_H + 24,
            paddingLeft: 20,
            paddingRight: 20,
          }}
        >
          <Stack gap={6}>
            {/* Page title */}
            <h1
              style={{
                fontFamily: tokens.font.display,
                fontWeight: 700,
                fontSize: 'clamp(24px, 5vw, 32px)',
                background: c.heroGradient,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                margin: 0,
                letterSpacing: -0.5,
              }}
            >
              Perfil
            </h1>

            {/* Avatar */}
            <ProfileAvatar initials={initials} size={88} />

            {/* Información personal */}
            <Stack gap={3}>
              <SectionLabel>Información personal</SectionLabel>
              <Card>
                <form onSubmit={onSaveProfile} noValidate>
                  <Stack gap={5}>
                    <Controller
                      name="name"
                      control={profileForm.control}
                      render={({ field }) => (
                        <Input
                          label="Nombre"
                          placeholder="Tu nombre"
                          value={field.value}
                          onChange={field.onChange}
                          status={pErr.name ? 'error' : undefined}
                          message={pErr.name?.message}
                        />
                      )}
                    />
                    <Controller
                      name="email"
                      control={profileForm.control}
                      render={({ field }) => (
                        <Input
                          label="Correo electrónico"
                          placeholder="tu@email.com"
                          type="email"
                          value={field.value}
                          onChange={field.onChange}
                          status={pErr.email ? 'error' : undefined}
                          message={pErr.email?.message}
                        />
                      )}
                    />

                    <Controller
                      name="gender"
                      control={profileForm.control}
                      render={({ field }) => (
                        <SegmentedControl
                          label="Género"
                          options={[
                            { label: 'Hombre', value: 'male' },
                            { label: 'Mujer', value: 'female' },
                          ]}
                          value={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />

                    {profileSaved && (
                      <p style={{ fontFamily: tokens.font.body, fontSize: 13, color: c.success, margin: 0 }}>
                        Cambios guardados correctamente.
                      </p>
                    )}
                    <div style={{ display: 'grid' }}>
                      <Button
                        variant="primary"
                        icon={Save}
                        disabled={profileForm.formState.isSubmitting}
                      >
                        {profileForm.formState.isSubmitting ? 'Guardando…' : 'Guardar cambios'}
                      </Button>
                    </div>
                  </Stack>
                </form>
              </Card>
            </Stack>

            {/* Contraseña */}
            <Stack gap={3}>
              <SectionLabel>Contraseña</SectionLabel>
              <Card>
                <form onSubmit={onSavePassword} noValidate>
                  <Stack gap={5}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                        <label style={{ fontFamily: tokens.font.body, fontSize: 13, fontWeight: 600, color: c.textMuted }}>
                          Contraseña actual
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowCurrent((v) => !v)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4, color: c.textFaint, fontFamily: tokens.font.body, fontSize: 12, padding: 0 }}
                        >
                          {showCurrent ? <EyeOff size={13} /> : <Eye size={13} />}
                          {showCurrent ? 'Ocultar' : 'Mostrar'}
                        </button>
                      </div>
                      <Controller
                        name="currentPassword"
                        control={passwordForm.control}
                        render={({ field }) => (
                          <Input
                            placeholder="••••••••"
                            type={showCurrent ? 'text' : 'password'}
                            value={field.value}
                            onChange={field.onChange}
                            status={wErr.currentPassword ? 'error' : undefined}
                            message={wErr.currentPassword?.message}
                          />
                        )}
                      />
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                        <label style={{ fontFamily: tokens.font.body, fontSize: 13, fontWeight: 600, color: c.textMuted }}>
                          Nueva contraseña
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowNew((v) => !v)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4, color: c.textFaint, fontFamily: tokens.font.body, fontSize: 12, padding: 0 }}
                        >
                          {showNew ? <EyeOff size={13} /> : <Eye size={13} />}
                          {showNew ? 'Ocultar' : 'Mostrar'}
                        </button>
                      </div>
                      <Controller
                        name="newPassword"
                        control={passwordForm.control}
                        render={({ field }) => (
                          <Input
                            placeholder="••••••••"
                            type={showNew ? 'text' : 'password'}
                            value={field.value}
                            onChange={field.onChange}
                            status={wErr.newPassword ? 'error' : undefined}
                            message={wErr.newPassword?.message}
                          />
                        )}
                      />
                    </div>

                    <Controller
                      name="confirmPassword"
                      control={passwordForm.control}
                      render={({ field }) => (
                        <Input
                          label="Confirmar contraseña"
                          placeholder="••••••••"
                          type={showNew ? 'text' : 'password'}
                          value={field.value}
                          onChange={field.onChange}
                          status={wErr.confirmPassword ? 'error' : undefined}
                          message={wErr.confirmPassword?.message}
                        />
                      )}
                    />

                    {passwordSaved && (
                      <p style={{ fontFamily: tokens.font.body, fontSize: 13, color: c.success, margin: 0 }}>
                        Contraseña actualizada correctamente.
                      </p>
                    )}

                    <div style={{ display: 'grid' }}>
                      <Button
                        variant="secondary"
                        icon={Save}
                        disabled={passwordForm.formState.isSubmitting}
                      >
                        {passwordForm.formState.isSubmitting ? 'Guardando…' : 'Cambiar contraseña'}
                      </Button>
                    </div>
                  </Stack>
                </form>
              </Card>
            </Stack>

            {/* Cerrar sesión */}
            <Stack gap={3}>
              <SectionLabel>Cuenta</SectionLabel>
              <div style={{ display: 'grid' }}>
                <button
                  type="button"
                  className="aurora-focusable"
                  onClick={() => setSignOutDialogOpen(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    padding: '14px',
                    background: `${c.danger}11`,
                    border: `1px solid ${c.danger}44`,
                    borderRadius: tokens.radius.lg,
                    cursor: 'pointer',
                    fontFamily: tokens.font.body,
                    fontSize: 15,
                    fontWeight: 600,
                    color: c.danger,
                    minHeight: tokens.touchTarget.min,
                    transition: `all ${tokens.motion.duration.fast} ${tokens.motion.easing.standard}`,
                  }}
                >
                  <LogOut size={18} />
                  Cerrar sesión
                </button>
              </div>
            </Stack>
          </Stack>
        </div>
      </Container>

      <AlertDialog
        open={signOutDialogOpen}
        onClose={() => setSignOutDialogOpen(false)}
        onConfirm={signOut}
        variant="danger"
        title="¿Cerrar sesión?"
        description="Tendrás que volver a iniciar sesión para acceder a tu cuenta."
        confirmLabel="Cerrar sesión"
        cancelLabel="Cancelar"
      />
    </>
  )
}
