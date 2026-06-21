import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { ProfileData, PasswordData } from '../types'

const profileSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().min(1, 'El correo es obligatorio').email('Introduce un correo válido'),
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

export function useProfile() {
  const navigate = useNavigate()
  const [signOutDialogOpen, setSignOutDialogOpen] = useState(false)
  const [profileSaved, setProfileSaved] = useState(false)
  const [passwordSaved, setPasswordSaved] = useState(false)

  const profileForm = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
    // TODO: populate from supabase.auth.getUser()
    defaultValues: { name: 'María José', email: 'maria@example.com' },
  })

  const passwordForm = useForm<PasswordData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  })

  async function saveProfile(data: ProfileData) {
    // TODO: supabase.auth.updateUser({ data: { name: data.name }, email: data.email })
    await new Promise((r) => setTimeout(r, 600))
    console.log('Profile updated:', data)
    setProfileSaved(true)
    setTimeout(() => setProfileSaved(false), 2500)
  }

  async function savePassword(_data: PasswordData) {
    // TODO: supabase.auth.updateUser({ password: _data.newPassword })
    await new Promise((r) => setTimeout(r, 600))
    console.log('Password updated')
    passwordForm.reset()
    setPasswordSaved(true)
    setTimeout(() => setPasswordSaved(false), 2500)
  }

  function signOut() {
    // TODO: supabase.auth.signOut()
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
