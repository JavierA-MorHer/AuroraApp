import { Controller } from 'react-hook-form'
import { Save, LogOut, Eye, EyeOff, Flame, Sparkles, Zap } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
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
import { soundEffects } from '@/lib/soundEffects'
import { useStreak } from '@/features/profile/hooks/useStreak'

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
  const queryClient = useQueryClient()
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [soundsEnabled, setSoundsEnabled] = useState(soundEffects.isSoundEnabled())

  const { totalXp, dailyGoal: currentGoal, streakDays, level } = useStreak()
  const [dailyGoal, setDailyGoal] = useState(currentGoal)

  useEffect(() => {
    setDailyGoal(currentGoal)
  }, [currentGoal])

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
    profile,
    uploadAvatar,
    uploading,
    avatarSaved,
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
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <ProfileAvatar
                initials={initials}
                avatarUrl={profile?.avatar_url}
                onUpload={uploadAvatar}
                uploading={uploading}
                size={88}
              />
              {avatarSaved && (
                <p style={{ fontFamily: tokens.font.body, fontSize: 13, color: c.success, margin: '4px 0 0 0', fontWeight: 500 }}>
                  ¡Foto de perfil actualizada con éxito!
                </p>
              )}
            </div>

            {/* Resumen de Estadísticas */}
            <Card style={{ overflow: 'hidden', padding: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', textAlign: 'center', padding: '16px 0 14px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <p style={{ fontFamily: tokens.font.mono, fontSize: 11, color: c.textFaint, textTransform: 'uppercase', margin: '0 0 4px', letterSpacing: 1 }}>
                    Nivel
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, height: 28 }}>
                    <Sparkles size={16} color={c.glow} style={{ minWidth: 16 }} />
                    <span style={{ fontFamily: tokens.font.display, fontSize: 20, fontWeight: 700, color: c.text }}>
                      {level}
                    </span>
                  </div>
                </div>

                <div style={{ width: 1, height: 32, background: c.border }} />

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <p style={{ fontFamily: tokens.font.mono, fontSize: 11, color: c.textFaint, textTransform: 'uppercase', margin: '0 0 4px', letterSpacing: 1 }}>
                    XP Totales
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, height: 28 }}>
                    <Zap size={16} color={c.secondary} fill={c.secondary} style={{ minWidth: 16 }} />
                    <span style={{ fontFamily: tokens.font.display, fontSize: 20, fontWeight: 700, color: c.text }}>
                      {totalXp}
                    </span>
                  </div>
                </div>

                <div style={{ width: 1, height: 32, background: c.border }} />

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <p style={{ fontFamily: tokens.font.mono, fontSize: 11, color: c.textFaint, textTransform: 'uppercase', margin: '0 0 4px', letterSpacing: 1 }}>
                    Racha
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, height: 28 }}>
                    <Flame size={16} color={c.glow} fill={c.glow} style={{ minWidth: 16 }} />
                    <span style={{ fontFamily: tokens.font.display, fontSize: 20, fontWeight: 700, color: c.text }}>
                      {streakDays} {streakDays === 1 ? 'día' : 'días'}
                    </span>
                  </div>
                </div>
              </div>
              <div
                style={{
                  background: c.bgSurfaceRaised,
                  padding: '10px 16px',
                  borderTop: `1px solid ${c.border}`,
                  textAlign: 'center',
                }}
              >
                <p
                  style={{
                    fontFamily: tokens.font.body,
                    fontSize: 12,
                    color: c.textMuted,
                    margin: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                  }}
                >
                  <Sparkles size={13} color={c.glow} style={{ minWidth: 13 }} />
                  <span>
                    El Nivel {level + 1} se alcanza a los <strong>{level * 1000} XP</strong> totales (faltan {level * 1000 - totalXp} XP)
                  </span>
                </p>
              </div>
            </Card>

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

            {/* Preferencias */}
            <Stack gap={3}>
              <SectionLabel>Preferencias</SectionLabel>
              <Card>
                <Stack gap={4}>
                  <SegmentedControl
                    label="Efectos de sonido"
                    options={[
                      { label: 'Activados', value: 'on' },
                      { label: 'Silenciados', value: 'off' },
                    ]}
                    value={soundsEnabled ? 'on' : 'off'}
                    onChange={(val) => {
                      const isNowOn = val === 'on'
                      if (isNowOn !== soundEffects.isSoundEnabled()) {
                        soundEffects.toggleSound()
                        setSoundsEnabled(isNowOn)
                        if (isNowOn) {
                          soundEffects.playSuccess()
                        }
                      }
                    }}
                  />

                  <SegmentedControl
                    label="Meta diaria de estudio"
                    options={[
                      { label: 'Casual (20 XP)', value: '20' },
                      { label: 'Normal (50 XP)', value: '50' },
                      { label: 'Intenso (100 XP)', value: '100' },
                    ]}
                    value={String(dailyGoal)}
                    onChange={async (val) => {
                      const newGoal = parseInt(val, 10)
                      setDailyGoal(newGoal)
                      localStorage.setItem('aurora-daily-xp-goal', String(newGoal))
                      await queryClient.invalidateQueries({ queryKey: ['streak', user?.id] })
                    }}
                  />
                </Stack>
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
