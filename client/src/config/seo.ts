import { BRAND } from '@/constants'
import { OFFICE_ADDRESS } from '@/config/companyInfo'
import {
  CONTACT_EMAIL,
  FACEBOOK_URL,
  INSTAGRAM_URL,
  LINKEDIN_URL,
  WHATSAPP_CHANNEL_URL,
} from '@/config/socialLinks'

/**
 * Update this to the real production domain before launch — it's used for
 * canonical URLs, Open Graph tags, and the sitemap. Falls back to the
 * current origin at runtime if unset, so local dev still works correctly.
 */
export const SITE_URL =
  import.meta.env.VITE_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : 'https://orbit-i.com')

export const SITE_NAME = BRAND.legalName

export interface PageSeo {
  title: string
  description: string
  path: string
  keywords?: string
  noindex?: boolean
}

const titleSuffix = ` | ${BRAND.name}`

function page(config: Omit<PageSeo, 'title'> & { title: string }): PageSeo {
  return config
}

export const PAGE_SEO = {
  home: page({
    title: `${BRAND.legalName} | Software & Technology Solutions`,
    description:
      'ORBIT-I Private Limited designs and builds web platforms, mobile apps, and custom software for businesses that need reliable engineering.',
    path: '/',
    keywords: 'software company, web development, mobile app development, custom software, ORBIT-I',
  }),
  about: page({
    title: `About Us${titleSuffix}`,
    description:
      'Learn about ORBIT-I Private Limited — our mission, values, and approach to building software that removes real friction for our clients.',
    path: '/about',
  }),
  services: page({
    title: `Services${titleSuffix}`,
    description:
      'Web application development, mobile apps, custom software, UI/UX design, cloud & DevOps, and AI automation services from ORBIT-I.',
    path: '/services',
  }),
  products: page({
    title: `Products${titleSuffix}`,
    description: "Explore the software products ORBIT-I Private Limited builds and maintains for businesses.",
    path: '/products',
  }),
  caseStudies: page({
    title: `Case Studies${titleSuffix}`,
    description: 'Real problems ORBIT-I has solved for clients, and the systems we built to solve them.',
    path: '/case-studies',
  }),
  team: page({
    title: `Our Team${titleSuffix}`,
    description: 'Meet the team behind ORBIT-I Private Limited — the people designing and building our client projects.',
    path: '/team',
  }),
  careers: page({
    title: `Careers${titleSuffix}`,
    description: 'Open roles at ORBIT-I Private Limited. Join a small, remote-friendly team building software that ships.',
    path: '/careers',
  }),
  contact: page({
    title: `Contact${titleSuffix}`,
    description: "Get in touch with ORBIT-I Private Limited about your next software project.",
    path: '/contact',
  }),
  privacyPolicy: page({
    title: `Privacy Policy${titleSuffix}`,
    description: `How ${BRAND.legalName} collects, uses, and protects your information.`,
    path: '/privacy-policy',
  }),
  refundPolicy: page({
    title: `Refund Policy${titleSuffix}`,
    description: `Refund and cancellation terms for products and services from ${BRAND.legalName}.`,
    path: '/refund-policy',
  }),
  terms: page({
    title: `Terms & Conditions${titleSuffix}`,
    description: `Terms governing use of the ${BRAND.legalName} website and client platform.`,
    path: '/terms-and-conditions',
  }),
  login: page({
    title: `Log In${titleSuffix}`,
    description: 'Log in to your ORBIT-I client or admin dashboard.',
    path: '/login',
    noindex: true,
  }),
  register: page({
    title: `Create Account${titleSuffix}`,
    description: 'Create an ORBIT-I client account to track orders and projects.',
    path: '/register',
    noindex: true,
  }),
  notFound: page({
    title: `Page Not Found${titleSuffix}`,
    description: "The page you're looking for doesn't exist or has moved.",
    path: '',
    noindex: true,
  }),
} as const

// ---------------------------------------------------------------------------
// JSON-LD structured data builders
// ---------------------------------------------------------------------------

export function buildOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    email: CONTACT_EMAIL,
    address: {
      '@type': 'PostalAddress',
      ...OFFICE_ADDRESS,
    },
    sameAs: [LINKEDIN_URL, WHATSAPP_CHANNEL_URL, FACEBOOK_URL, INSTAGRAM_URL],
  }
}

export function buildWebsiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
  }
}

export function buildBreadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  }
}

export function buildServiceJsonLd(service: { title: string; summary: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.summary,
    provider: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
  }
}

export function buildProductJsonLd(product: { name: string; shortDescription: string; price: number; currency: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.shortDescription,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.currency,
    },
  }
}

export function buildCreativeWorkJsonLd(caseStudy: { projectName: string; problem: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: caseStudy.projectName,
    description: caseStudy.problem,
    creator: { '@type': 'Organization', name: SITE_NAME },
  }
}
