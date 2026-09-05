import { useEffect } from 'react'

declare global {
  interface Window { adsbygoogle?: unknown[] }
}

export function AdSense() {
  const client = import.meta.env.VITE_ADSENSE_CLIENT as string | undefined
  const enabled = import.meta.env.VITE_ENABLE_ADSENSE === 'true' && Boolean(client)

  useEffect(() => {
    if (!enabled || document.querySelector('script[data-adsense]')) return
    const script = document.createElement('script')
    script.async = true
    script.crossOrigin = 'anonymous'
    script.dataset.adsense = 'true'
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`
    document.head.appendChild(script)
  }, [client, enabled])

  if (!enabled) return null
  return <ins className="adsbygoogle" style={{ display: 'block' }} data-ad-client={client} data-ad-format="auto" data-full-width-responsive="true" />
}
