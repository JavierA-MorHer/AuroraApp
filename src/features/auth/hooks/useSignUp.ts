import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { supabase } from '@/lib/supabase'

const schema = z
  .object({
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    email: z.string().min(1, 'El correo es obligatorio').email('Introduce un correo válido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })

export type SignUpCredentials = z.infer<typeof schema>

export function useSignUp() {
  const navigate = useNavigate()
  const [serverError, setServerError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false)

  const form = useForm<SignUpCredentials>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  })

  async function handleSubmit(data: SignUpCredentials) {
    setIsLoading(true)
    setServerError(null)
    try {
      const firstName = data.name.split(' ')[0]
      const lastName = data.name.split(' ').slice(1).join(' ') || undefined

      const { data: result, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: { first_name: firstName, last_name: lastName },
        },
      })

      if (error) throw error

      if (result.session) {
        // Email confirmation desactivada: sesión inmediata
        navigate('/home')
      } else {
        // Supabase envió un email de confirmación
        setAwaitingConfirmation(true)
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : null
      setServerError(msg ?? 'No se pudo crear la cuenta. Vuelve a intentarlo.')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    form,
    onSubmit: form.handleSubmit(handleSubmit),
    isLoading,
    serverError,
    awaitingConfirmation,
  }
}
