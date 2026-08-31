import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
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

const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})
type LoginForm = z.infer<typeof loginSchema>

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [formError, setFormError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (values: LoginForm) => {
    setFormError(null)
    try {
      const loggedInUser = await login(values)
      const isAdmin = loggedInUser.role === 'admin' || loggedInUser.role === 'super_admin'
      const defaultRoute = isAdmin ? ROUTES.adminDashboard : ROUTES.clientDashboard
      const redirectTo = (location.state as { from?: Location })?.from?.pathname ?? defaultRoute
      navigate(redirectTo, { replace: true })
    } catch (err) {
      const message = axios.isAxiosError(err) ? err.response?.data?.message : null
      setFormError(message || 'Invalid email or password.')
    }
  }

  return (
    <>
      <SEO {...PAGE_SEO.login} />
      <AuthShell title="Welcome back" subtitle="Log in to access your ORBIT-I dashboard.">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input label="Email" type="email" placeholder="you@example.com" error={errors.email?.message} {...register('email')} />
          <div>
            <Input label="Password" type="password" placeholder="••••••••" error={errors.password?.message} {...register('password')} />
            <Link to={ROUTES.forgotPassword} className="mt-2 inline-block text-xs font-medium text-primary-400 hover:text-primary-300">
              Forgot password?
            </Link>
          </div>
          {formError && <p className="text-sm text-[var(--color-danger)]">{formError}</p>}
          <Button type="submit" isLoading={isSubmitting} size="lg" className="mt-2">
            Log in
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-[var(--color-text-secondary)]">
          Don't have an account?{' '}
          <Link to={ROUTES.register} className="font-medium text-primary-400 hover:text-primary-300">
            Create one
          </Link>
        </p>
      </AuthShell>
    </>
  )
}
