import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

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
  const [serverError, setServerError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<SignUpCredentials>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  })

  async function handleSubmit(data: SignUpCredentials) {
    setIsLoading(true)
    setServerError(null)
    try {
      // TODO: replace with supabase.auth.signUp({ email: data.email, password: data.password, options: { data: { name: data.name } } })
      await new Promise((r) => setTimeout(r, 1000))
      console.log('SignUp OK:', data.email)
    } catch {
      setServerError('No se pudo crear la cuenta. Vuelve a intentarlo.')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    form,
    onSubmit: form.handleSubmit(handleSubmit),
    isLoading,
    serverError,
  }
}
