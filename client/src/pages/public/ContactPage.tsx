import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, MapPin, CheckCircle2 } from 'lucide-react'
import { getApiErrorMessage } from '@/utils/apiError'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui'
import { Badge } from '@/components/ui/Badge'
import { contactService } from '@/services/contactService'
import { SEO } from '@/components/seo/SEO'
import { PAGE_SEO } from '@/config/seo'
import { CONTACT_EMAIL } from '@/config/socialLinks'
import { OFFICE_LOCATION } from '@/config/companyInfo'

const contactSchema = z.object({
  name: z.string().min(2, 'Enter your name'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().optional(),
  company: z.string().optional(),
  subject: z.string().min(3, 'Add a short subject'),
  message: z.string().min(10, 'Message should be at least 10 characters'),
})
type ContactForm = z.infer<typeof contactSchema>

export function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactForm>({ resolver: zodResolver(contactSchema) })

  const onSubmit = async (data: ContactForm) => {
    setSubmitError(null)
    try {
      await contactService.submit(data)
      setSubmitted(true)
    } catch (err) {
      setSubmitError(getApiErrorMessage(err, 'Could not send your message. Please try again.'))
    }
  }

  return (
    <div className="pb-24">
      <SEO {...PAGE_SEO.contact} />
      <section className="border-b border-[var(--color-border)] py-20">
        <div className="container-app">
          <Badge tone="primary" className="mb-5">Contact</Badge>
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-5xl">
            Let's talk about your project
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--color-text-secondary)]">
            Tell us a bit about what you're building. We reply to every message within one
            business day.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container-app grid gap-10 lg:grid-cols-[1fr_1.3fr]">
          <div className="flex flex-col gap-6">
            <ContactInfoRow icon={Mail} label="Email" value={CONTACT_EMAIL} />
            <ContactInfoRow icon={MapPin} label="Office" value={OFFICE_LOCATION} />
          </div>

          <Card hoverable={false}>
            {submitted ? (
              <div className="flex flex-col items-center gap-3 py-10 text-center">
                <CheckCircle2 className="size-10 text-[var(--color-success)]" aria-hidden />
                <h2 className="font-display text-xl font-semibold text-[var(--color-text-primary)]">
                  Message sent
                </h2>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Thanks — we'll get back to you within one business day.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input label="Name" placeholder="Jane Doe" error={errors.name?.message} {...register('name')} />
                  <Input label="Email" type="email" placeholder="you@example.com" error={errors.email?.message} {...register('email')} />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input label="Phone" placeholder="Optional" {...register('phone')} />
                  <Input label="Company" placeholder="Optional" {...register('company')} />
                </div>
                <Input label="Subject" placeholder="What's this about?" error={errors.subject?.message} {...register('subject')} />
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="message" className="text-sm font-medium text-[var(--color-text-primary)]">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    placeholder="Tell us about your project…"
                    className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-background-elevated)] px-3.5 py-2.5 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
                    {...register('message')}
                  />
                  {errors.message && <p className="text-xs text-[var(--color-danger)]">{errors.message.message}</p>}
                </div>
                {submitError && <p className="text-sm text-[var(--color-danger)]">{submitError}</p>}
                <Button type="submit" isLoading={isSubmitting} size="lg" className="mt-2">
                  Send message
                </Button>
              </form>
            )}
          </Card>
        </div>
      </section>
    </div>
  )
}

function ContactInfoRow({ icon: Icon, label, value }: { icon: typeof Mail; label: string; value: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-500/10 text-primary-300">
        <Icon className="size-4.5" aria-hidden />
      </div>
      <div>
        <p className="text-xs text-[var(--color-text-muted)]">{label}</p>
        <p className="text-sm font-medium text-[var(--color-text-primary)]">{value}</p>
      </div>
    </div>
  )
}
