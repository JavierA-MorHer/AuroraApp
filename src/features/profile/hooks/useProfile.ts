import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/useAuthStore'
import type { PasswordData } from '../types'

const profileSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().min(1, 'El correo es obligatorio').email('Introduce un correo válido'),
  gender: z.enum(['male', 'female']).nullable(),
})

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Introduce tu contraseña actual'),
    newPassword: z.string().min(6, 'Mínimo 6 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })

type ProfileFormData = z.infer<typeof profileSchema>

export function useProfile() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const user = useAuthStore((s) => s.user)
  const [signOutDialogOpen, setSignOutDialogOpen] = useState(false)
  const [profileSaved, setProfileSaved] = useState(false)
  const [passwordSaved, setPasswordSaved] = useState(false)

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('first_name, last_name, gender')
        .eq('id', user!.id)
        .single()
      if (error) throw error
      return data as { first_name: string; last_name: string | null; gender: 'male' | 'female' | null }
    },
    enabled: !!user,
  })

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: '', email: '', gender: null },
  })

  const passwordForm = useForm<PasswordData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  })

  useEffect(() => {
    if (profile && user) {
      const fullName = [profile.first_name, profile.last_name].filter(Boolean).join(' ')
      profileForm.reset({ name: fullName, email: user.email ?? '', gender: profile.gender ?? null })
    }
  }, [profile, user, profileForm])

  async function saveProfile(data: ProfileFormData) {
    if (!user) return
    const firstName = data.name.split(' ')[0]
    const lastName = data.name.split(' ').slice(1).join(' ') || null

    await supabase
      .from('profiles')
      .update({ first_name: firstName, last_name: lastName, gender: data.gender })
      .eq('id', user.id)

    await supabase.auth.updateUser({
      ...(data.email !== user.email ? { email: data.email } : {}),
      data: { first_name: firstName, last_name: lastName, gender: data.gender },
    })

    queryClient.invalidateQueries({ queryKey: ['profile', user.id] })
    setProfileSaved(true)
    setTimeout(() => setProfileSaved(false), 2500)
  }

  async function savePassword(data: PasswordData) {
    const { error } = await supabase.auth.updateUser({ password: data.newPassword })
    if (error) throw error
    passwordForm.reset()
    setPasswordSaved(true)
    setTimeout(() => setPasswordSaved(false), 2500)
  }

  async function signOut() {
    await supabase.auth.signOut()
    navigate('/')
  }

  return {
    profileForm,
    passwordForm,
    profileSaved,
    passwordSaved,
    signOutDialogOpen,
    setSignOutDialogOpen,
    onSaveProfile: profileForm.handleSubmit(saveProfile),
    onSavePassword: passwordForm.handleSubmit(savePassword),
    signOut,
  }
}
