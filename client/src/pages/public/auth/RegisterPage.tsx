import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import axios from 'axios'
import { AuthShell } from './AuthShell'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui'
import { useAuth } from '@/contexts/AuthContext'
import { ROUTES } from '@/constants'
import { SEO } from '@/components/seo/SEO'
import { PAGE_SEO } from '@/config/seo'

const registerSchema = z
  .object({
    fullName: z.string().min(2, 'Enter your full name'),
    email: z.string().email('Enter a valid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
type RegisterForm = z.infer<typeof registerSchema>

export function RegisterPage() {
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  const [formError, setFormError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) })

  const onSubmit = async (values: RegisterForm) => {
    setFormError(null)
    try {
      await registerUser({ fullName: values.fullName, email: values.email, password: values.password })
      navigate(ROUTES.clientDashboard, { replace: true })
    } catch (err) {
      const message = axios.isAxiosError(err) ? err.response?.data?.message : null
      setFormError(message || 'Could not create your account. Please try again.')
    }
  }

  return (
    <>
      <SEO {...PAGE_SEO.register} />
      <AuthShell title="Create your account" subtitle="Get access to orders, projects, and support in one place.">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input label="Full name" placeholder="Jane Doe" error={errors.fullName?.message} {...register('fullName')} />
          <Input label="Email" type="email" placeholder="you@example.com" error={errors.email?.message} {...register('email')} />
          <Input label="Password" type="password" placeholder="At least 8 characters" error={errors.password?.message} {...register('password')} />
          <Input label="Confirm password" type="password" placeholder="Re-enter your password" error={errors.confirmPassword?.message} {...register('confirmPassword')} />
          {formError && <p className="text-sm text-[var(--color-danger)]">{formError}</p>}
          <Button type="submit" isLoading={isSubmitting} size="lg" className="mt-2">
            Create account
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-[var(--color-text-secondary)]">
          Already have an account?{' '}
          <Link to={ROUTES.login} className="font-medium text-primary-400 hover:text-primary-300">
            Log in
          </Link>
        </p>
      </AuthShell>
    </>
  )
}
