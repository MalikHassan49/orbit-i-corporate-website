import { Helmet } from 'react-helmet-async'
import { SITE_URL, SITE_NAME, type PageSeo } from '@/config/seo'

interface SeoProps extends PageSeo {
  /** One or more JSON-LD structured-data objects to inject as <script type="application/ld+json"> tags. */
  jsonLd?: object | object[]
  image?: string
  canonicalUrl?: string
  robots?: string
}

export function SEO({ title, description, path, keywords, noindex, jsonLd, image, canonicalUrl: explicitCanonicalUrl, robots }: SeoProps) {
  const canonicalUrl = explicitCanonicalUrl || `${SITE_URL}${path}`
  const jsonLdItems = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : []

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={canonicalUrl} />
      <meta name="robots" content={robots || (noindex ? 'noindex, nofollow' : 'index, follow')} />

      {/* Open Graph */}
      <meta property="og:type" content={jsonLdItems.some((item) => (item as { '@type'?: string })['@type'] === 'Article') ? 'article' : 'website'} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      {image && <meta property="og:image" content={image} />}

      {/* Twitter card */}
      <meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}

      {jsonLdItems.map((item, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(item)}
        </script>
      ))}
    </Helmet>
  )
}
