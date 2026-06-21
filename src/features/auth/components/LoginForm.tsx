import { useState } from 'react'
import { Controller } from 'react-hook-form'
import { Sparkles, Eye, EyeOff, LogIn, UserPlus } from 'lucide-react'
import { useThemeStore } from '@/stores/useThemeStore'
import { Card, Stack, Button, Input, tokens } from '@/design-system'
import { useLogin } from '../hooks/useLogin'
import { useSignUp } from '../hooks/useSignUp'

type AuthMode = 'login' | 'signup'

function ModeToggle({
  mode,
  onChange,
}: {
  mode: AuthMode
  onChange: (m: AuthMode) => void
}) {
  const { c } = useThemeStore()

  const tabStyle = (active: boolean): React.CSSProperties => ({
    flex: 1,
    fontFamily: tokens.font.body,
    fontSize: 13,
    fontWeight: 600,
    padding: '8px 0',
    borderRadius: tokens.radius.full,
    border: 'none',
    cursor: 'pointer',
    background: active ? c.primary : 'transparent',
    color: active ? '#fff' : c.textMuted,
    transition: `all ${tokens.motion.duration.fast} ${tokens.motion.easing.standard}`,
    minHeight: 38,
  })

  return (
    <div
      style={{
        display: 'flex',
        gap: 4,
        background: c.bgDeep,
        padding: 4,
        borderRadius: tokens.radius.full,
        marginBottom: 24,
      }}
    >
      <button
        type="button"
        className="aurora-focusable"
        aria-selected={mode === 'login'}
        onClick={() => onChange('login')}
        style={tabStyle(mode === 'login')}
      >
        Iniciar sesión
      </button>
      <button
        type="button"
        className="aurora-focusable"
        aria-selected={mode === 'signup'}
        onClick={() => onChange('signup')}
        style={tabStyle(mode === 'signup')}
      >
        Crear cuenta
      </button>
    </div>
  )
}

export function LoginForm() {
  const { c } = useThemeStore()
  const [mode, setMode] = useState<AuthMode>('login')
  const [showPassword, setShowPassword] = useState(false)

  const login = useLogin()
  const signup = useSignUp()

  function handleModeChange(next: AuthMode) {
    setMode(next)
    setShowPassword(false)
    login.form.reset()
    signup.form.reset()
  }

  const isLogin = mode === 'login'
  const loginErrors = login.form.formState.errors
  const signupErrors = signup.form.formState.errors

  const passwordToggle = (
    <button
      type="button"
      onClick={() => setShowPassword((v) => !v)}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        color: c.textFaint,
        fontFamily: tokens.font.body,
        fontSize: 12,
        padding: 0,
      }}
      aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
    >
      {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
      {showPassword ? 'Ocultar' : 'Mostrar'}
    </button>
  )

  return (
    <div style={{ maxWidth: 420, margin: '0 auto', width: '100%' }}>
      {/* Branding */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <Sparkles size={18} color={c.glow} />
          <span
            style={{
              fontFamily: tokens.font.mono,
              fontSize: 11,
              letterSpacing: 2,
              textTransform: 'uppercase',
              color: c.glow,
            }}
          >
            Aurora
          </span>
        </div>
        <h1
          style={{
            fontFamily: tokens.font.display,
            fontWeight: 700,
            fontSize: 'clamp(28px, 5vw, 40px)',
            background: c.heroGradient,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: '0 0 8px',
            letterSpacing: -0.5,
          }}
        >
          {isLogin ? 'Bienvenida de nuevo' : 'Empieza tu aventura'}
        </h1>
        <p
          style={{
            fontFamily: tokens.font.body,
            fontSize: 14,
            color: c.textMuted,
            margin: 0,
          }}
        >
          {isLogin ? 'Continúa tu progreso en inglés' : 'Aprende inglés juntos, día a día'}
        </p>
      </div>

      {/* Card */}
      <Card glow padding={32}>
        <ModeToggle mode={mode} onChange={handleModeChange} />

        {/* Login form */}
        {isLogin && (
          <form onSubmit={login.onSubmit} noValidate>
            <Stack gap={5}>
              <Controller
                name="email"
                control={login.form.control}
                render={({ field }) => (
                  <Input
                    label="Correo electrónico"
                    placeholder="tu@email.com"
                    type="email"
                    value={field.value}
                    onChange={field.onChange}
                    status={loginErrors.email ? 'error' : undefined}
                    message={loginErrors.email?.message}
                  />
                )}
              />

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                  <label style={{ fontFamily: tokens.font.body, fontSize: 13, fontWeight: 600, color: c.textMuted }}>
                    Contraseña
                  </label>
                  {passwordToggle}
                </div>
                <Controller
                  name="password"
                  control={login.form.control}
                  render={({ field }) => (
                    <Input
                      placeholder="••••••••"
                      type={showPassword ? 'text' : 'password'}
                      value={field.value}
                      onChange={field.onChange}
                      status={loginErrors.password ? 'error' : undefined}
                      message={loginErrors.password?.message}
                    />
                  )}
                />
              </div>

              {login.serverError && (
                <p role="alert" style={{ fontFamily: tokens.font.body, fontSize: 13, color: c.danger, margin: 0, textAlign: 'center' }}>
                  {login.serverError}
                </p>
              )}

              <div style={{ paddingTop: 4, display: 'grid' }}>
                <Button variant="glow" size="lg" icon={LogIn} disabled={login.isLoading}>
                  {login.isLoading ? 'Entrando…' : 'Entrar'}
                </Button>
              </div>
            </Stack>
          </form>
        )}

        {/* Sign-up form */}
        {!isLogin && (
          <form onSubmit={signup.onSubmit} noValidate>
            <Stack gap={5}>
              <Controller
                name="name"
                control={signup.form.control}
                render={({ field }) => (
                  <Input
                    label="Tu nombre"
                    placeholder="María José"
                    value={field.value}
                    onChange={field.onChange}
                    status={signupErrors.name ? 'error' : undefined}
                    message={signupErrors.name?.message}
                  />
                )}
              />

              <Controller
                name="email"
                control={signup.form.control}
                render={({ field }) => (
                  <Input
                    label="Correo electrónico"
                    placeholder="tu@email.com"
                    type="email"
                    value={field.value}
                    onChange={field.onChange}
                    status={signupErrors.email ? 'error' : undefined}
                    message={signupErrors.email?.message}
                  />
                )}
              />

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                  <label style={{ fontFamily: tokens.font.body, fontSize: 13, fontWeight: 600, color: c.textMuted }}>
                    Contraseña
                  </label>
                  {passwordToggle}
                </div>
                <Controller
                  name="password"
                  control={signup.form.control}
                  render={({ field }) => (
                    <Input
                      placeholder="••••••••"
                      type={showPassword ? 'text' : 'password'}
                      value={field.value}
                      onChange={field.onChange}
                      status={signupErrors.password ? 'error' : undefined}
                      message={signupErrors.password?.message}
                    />
                  )}
                />
              </div>

              <Controller
                name="confirmPassword"
                control={signup.form.control}
                render={({ field }) => (
                  <Input
                    label="Confirmar contraseña"
                    placeholder="••••••••"
                    type={showPassword ? 'text' : 'password'}
                    value={field.value}
                    onChange={field.onChange}
                    status={signupErrors.confirmPassword ? 'error' : undefined}
                    message={signupErrors.confirmPassword?.message}
                  />
                )}
              />

              {signup.serverError && (
                <p role="alert" style={{ fontFamily: tokens.font.body, fontSize: 13, color: c.danger, margin: 0, textAlign: 'center' }}>
                  {signup.serverError}
                </p>
              )}

              <div style={{ paddingTop: 4, display: 'grid' }}>
                <Button variant="glow" size="lg" icon={UserPlus} disabled={signup.isLoading}>
                  {signup.isLoading ? 'Creando cuenta…' : 'Crear cuenta'}
                </Button>
              </div>
            </Stack>
          </form>
        )}
      </Card>

      {/* Forgot password — solo en login */}
      {isLogin && (
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <button
            type="button"
            className="aurora-focusable"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: tokens.font.body,
              fontSize: 13,
              color: c.textFaint,
              padding: '8px 12px',
            }}
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>
      )}
    </div>
  )
}
