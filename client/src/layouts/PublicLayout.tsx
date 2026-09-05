import { Outlet } from 'react-router-dom'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { GlobalStructuredData } from '@/components/seo/GlobalStructuredData'
import { AdSense } from '@/components/ads/AdSense'

export function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-background)]">
      <GlobalStructuredData />
      <Navbar />
      <main className="flex-1">
        <AdSense />
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
