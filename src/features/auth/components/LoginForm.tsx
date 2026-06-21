import { useState } from 'react'
import { Controller } from 'react-hook-form'
import { Sparkles, Eye, EyeOff, LogIn } from 'lucide-react'
import { useThemeStore } from '@/stores/useThemeStore'
import {
  Card,
  Stack,
  Button,
  Input,
  tokens,
} from '@/design-system'
import { useLogin } from '../hooks/useLogin'

export function LoginForm() {
  const { c } = useThemeStore()
  const { form, onSubmit, isLoading, serverError } = useLogin()
  const [showPassword, setShowPassword] = useState(false)

  const { formState: { errors } } = form

  return (
    <div style={{ maxWidth: 420, margin: '0 auto', width: '100%' }}>
      {/* Branding */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 12,
          }}
        >
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
          Bienvenida de nuevo
        </h1>
        <p
          style={{
            fontFamily: tokens.font.body,
            fontSize: 14,
            color: c.textMuted,
            margin: 0,
          }}
        >
          Continúa tu progreso en inglés
        </p>
      </div>

      {/* Form card */}
      <Card glow padding={32}>
        <form onSubmit={onSubmit} noValidate>
          <Stack gap={5}>
            {/* Email */}
            <Controller
              name="email"
              control={form.control}
              render={({ field }) => (
                <Input
                  label="Correo electrónico"
                  placeholder="tu@email.com"
                  type="email"
                  value={field.value}
                  onChange={field.onChange}
                  status={errors.email ? 'error' : undefined}
                  message={errors.email?.message}
                />
              )}
            />

            {/* Password */}
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  marginBottom: 6,
                }}
              >
                <label
                  style={{
                    fontFamily: tokens.font.body,
                    fontSize: 13,
                    fontWeight: 600,
                    color: c.textMuted,
                  }}
                >
                  Contraseña
                </label>
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
              </div>
              <Controller
                name="password"
                control={form.control}
                render={({ field }) => (
                  <Input
                    placeholder="••••••••"
                    type={showPassword ? 'text' : 'password'}
                    value={field.value}
                    onChange={field.onChange}
                    status={errors.password ? 'error' : undefined}
                    message={errors.password?.message}
                  />
                )}
              />
            </div>

            {/* Server error */}
            {serverError && (
              <p
                role="alert"
                style={{
                  fontFamily: tokens.font.body,
                  fontSize: 13,
                  color: c.danger,
                  margin: 0,
                  textAlign: 'center',
                }}
              >
                {serverError}
              </p>
            )}

            {/* Submit — display:grid stretches inline-flex Button to full width */}
            <div style={{ paddingTop: 4, display: 'grid' }}>
              <Button
                variant="glow"
                size="lg"
                icon={LogIn}
                disabled={isLoading}
              >
                {isLoading ? 'Entrando…' : 'Entrar'}
              </Button>
            </div>
          </Stack>
        </form>
      </Card>

      {/* Forgot password */}
      <div style={{ textAlign: 'center', marginTop: 20 }}>
        <button
          type="button"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontFamily: tokens.font.body,
            fontSize: 13,
            color: c.textFaint,
            padding: '8px 12px',
          }}
          className="aurora-focusable"
        >
          ¿Olvidaste tu contraseña?
        </button>
      </div>
    </div>
  )
}
