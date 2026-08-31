import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CheckCircle2 } from 'lucide-react'
import { AuthShell } from './AuthShell'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui'
import { authService } from '@/services/authService'

const forgotSchema = z.object({ email: z.string().email('Enter a valid email') })
type ForgotForm = z.infer<typeof forgotSchema>

export function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotForm>({ resolver: zodResolver(forgotSchema) })

  const onSubmit = async (values: ForgotForm) => {
    try {
      await authService.forgotPassword(values.email)
    } finally {
      // Always show the same confirmation, regardless of whether the email
      // exists, so the form can't be used to enumerate registered accounts.
      setSent(true)
    }
  }

  return (
    <AuthShell title="Reset your password" subtitle="We'll email you a link to reset your password.">
      {sent ? (
        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <CheckCircle2 className="size-9 text-[var(--color-success)]" aria-hidden />
          <p className="text-sm text-[var(--color-text-secondary)]">
            If an account exists for that email, a reset link is on its way.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input label="Email" type="email" placeholder="you@example.com" error={errors.email?.message} {...register('email')} />
          <Button type="submit" isLoading={isSubmitting} size="lg" className="mt-2">
            Send reset link
          </Button>
        </form>
      )}
    </AuthShell>
  )
}

const resetSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
type ResetForm = z.infer<typeof resetSchema>

export function ResetPasswordPage() {
  const [params] = useSearchParams()
  const token = params.get('token') ?? ''
  const [done, setDone] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetForm>({ resolver: zodResolver(resetSchema) })

  const onSubmit = async (values: ResetForm) => {
    setFormError(null)
    try {
      await authService.resetPassword(token, values.password)
      setDone(true)
    } catch {
      setFormError('This reset link is invalid or has expired.')
    }
  }

  return (
    <AuthShell title="Set a new password" subtitle="Choose a new password for your account.">
      {done ? (
        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <CheckCircle2 className="size-9 text-[var(--color-success)]" aria-hidden />
          <p className="text-sm text-[var(--color-text-secondary)]">
            Your password has been updated. You can now log in.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input label="New password" type="password" placeholder="At least 8 characters" error={errors.password?.message} {...register('password')} />
          <Input label="Confirm password" type="password" placeholder="Re-enter your password" error={errors.confirmPassword?.message} {...register('confirmPassword')} />
          {formError && <p className="text-sm text-[var(--color-danger)]">{formError}</p>}
          <Button type="submit" isLoading={isSubmitting} size="lg" className="mt-2">
            Update password
          </Button>
        </form>
      )}
    </AuthShell>
  )
}
