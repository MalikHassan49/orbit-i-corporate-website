import type { ReactNode } from 'react'
import { Logo } from '@/components/layout/Logo'
import { Card } from '@/components/ui/Card'

export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px]"
        style={{ background: 'var(--gradient-glow)' }}
        aria-hidden
      />
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <Card hoverable={false} className="px-7 py-8 sm:px-9">
          <h1 className="font-display text-2xl font-semibold text-[var(--color-text-primary)]">{title}</h1>
          <p className="mt-1.5 text-sm text-[var(--color-text-secondary)]">{subtitle}</p>
          <div className="mt-7">{children}</div>
        </Card>
      </div>
    </div>
  )
}
