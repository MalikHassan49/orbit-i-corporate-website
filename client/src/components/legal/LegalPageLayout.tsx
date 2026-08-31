import type { ReactNode } from 'react'

interface LegalPageLayoutProps {
  title: string
  lastUpdated: string
  children: ReactNode
}

export function LegalPageLayout({ title, lastUpdated, children }: LegalPageLayoutProps) {
  return (
    <div className="container-app py-20">
      <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-text-primary)]">{title}</h1>
      <p className="mt-2 text-sm text-[var(--color-text-muted)]">Last updated: {lastUpdated}</p>
      <div className="mt-8 flex max-w-2xl flex-col gap-4 text-[var(--color-text-secondary)] [&_h2]:mt-4 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-[var(--color-text-primary)]">
        {children}
      </div>
    </div>
  )
}
