export const BRAND = {
  name: 'ORBIT-I',
  legalName: 'ORBIT-I Private Limited',
  tagline: 'Engineering software that stays in orbit around your business.',
} as const

export const ROUTES = {
  home: '/',
  about: '/about',
  services: '/services',
  serviceDetail: (slug: string) => `/services/${slug}`,
  products: '/products',
  productDetail: (slug: string) => `/products/${slug}`,
  caseStudies: '/case-studies',
  caseStudyDetail: (slug: string) => `/case-studies/${slug}`,
  blog: '/blog',
  blogDetail: (slug: string) => `/blog/${slug}`,
  team: '/team',
  careers: '/careers',
  jobDetail: (id: string) => `/careers/${id}`,
  contact: '/contact',
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
  privacy: '/privacy-policy',
  refundPolicy: '/refund-policy',
  terms: '/terms-and-conditions',
  securityPolicy: '/security-policy',
  disclaimer: '/disclaimer',

  clientDashboard: '/client/dashboard',
  clientOrders: '/client/orders',
  clientProjects: '/client/projects',
  clientProjectDetail: (id: string) => `/client/projects/${id}`,
  clientProfile: '/client/profile',
  clientSettings: '/client/settings',
  clientSupport: '/client/support',
  clientInvoices: '/client/invoices',

  adminDashboard: '/admin/dashboard',
  adminSeoDashboard: '/admin/seo',
  adminClients: '/admin/clients',
  adminProducts: '/admin/products',
  adminOrders: '/admin/orders',
  adminProjects: '/admin/projects',
  adminCareers: '/admin/careers',
  adminApplications: '/admin/applications',
  adminLeads: '/admin/leads',
  adminSupport: '/admin/support',
  adminCaseStudies: '/admin/case-studies',
  adminBlog: '/admin/blog',
  adminCategories: '/admin/categories',
  adminTags: '/admin/tags',
  adminTestimonials: '/admin/testimonials',
  adminTeam: '/admin/team',
  adminSettings: '/admin/settings',
} as const

export const MAIN_NAV_LINKS = [
  { label: 'Home', to: ROUTES.home },
  { label: 'About', to: ROUTES.about },
  { label: 'Services', to: ROUTES.services },
  { label: 'Products', to: ROUTES.products },
  { label: 'Case Studies', to: ROUTES.caseStudies },
  { label: 'Blog', to: ROUTES.blog },
  { label: 'Team', to: ROUTES.team },
  { label: 'Careers', to: ROUTES.careers },
  { label: 'Contact', to: ROUTES.contact },
] as const

/**
 * Footer navigation, grouped exactly as the site footer displays them:
 * primary site navigation, client-account links, company links, and legal
 * pages. Update here only — Footer.tsx just renders these.
 */
export const FOOTER_LINKS = {
  navigation: [
    { label: 'Home', to: ROUTES.home },
    { label: 'About', to: ROUTES.about },
    { label: 'Services', to: ROUTES.services },
    { label: 'Products', to: ROUTES.products },
    { label: 'Case Studies', to: ROUTES.caseStudies },
    { label: 'Blog', to: ROUTES.blog },
    { label: 'Team', to: ROUTES.team },
    { label: 'Careers', to: ROUTES.careers },
    { label: 'Contact', to: ROUTES.contact },
  ],
  client: [
    { label: 'Client Login', to: ROUTES.login },
    { label: 'Client Dashboard', to: ROUTES.clientDashboard },
  ],
  company: [
    { label: 'About', to: ROUTES.about },
    { label: 'Team', to: ROUTES.team },
    { label: 'Careers', to: ROUTES.careers },
    { label: 'Contact', to: ROUTES.contact },
  ],
  legal: [
    { label: 'Privacy Policy', to: ROUTES.privacy },
    { label: 'Refund Policy', to: ROUTES.refundPolicy },
    { label: 'Terms & Conditions', to: ROUTES.terms },
    { label: 'Security Policy', to: ROUTES.securityPolicy },
    { label: 'Website Disclaimer', to: ROUTES.disclaimer },
  ],
} as const

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1'
