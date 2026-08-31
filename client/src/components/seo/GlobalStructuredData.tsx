import { Helmet } from 'react-helmet-async'
import { buildOrganizationJsonLd, buildWebsiteJsonLd } from '@/config/seo'

export function GlobalStructuredData() {
  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(buildOrganizationJsonLd())}</script>
      <script type="application/ld+json">{JSON.stringify(buildWebsiteJsonLd())}</script>
    </Helmet>
  )
}
