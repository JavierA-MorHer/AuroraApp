import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { supabase } from '@/lib/supabase'
import type { LoginCredentials } from '../types'

const schema = z.object({
  email: z.string().min(1, 'El correo es obligatorio').email('Introduce un correo válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

export function useLogin() {
  const navigate = useNavigate()
  const [serverError, setServerError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<LoginCredentials>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  })

  useEffect(() => {
    const subscription = form.watch(() => setServerError(null))
    return () => subscription.unsubscribe()
  }, [form.watch])

  async function handleSubmit(data: LoginCredentials) {
    setIsLoading(true)
    setServerError(null)
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })
      if (error) throw error
      navigate('/home')
    } catch {
      setServerError('Correo o contraseña incorrectos. Vuelve a intentarlo.')
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
