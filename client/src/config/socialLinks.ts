import { Mail } from 'lucide-react'
import { FaFacebook, FaInstagram, FaLinkedin, FaWhatsapp } from 'react-icons/fa6'
import type { ElementType } from 'react'

export interface SocialLink {
  name: string
  url: string
  icon: ElementType
}

export const CONTACT_EMAIL = 'isamadrind.work@gmail.com'
export const LINKEDIN_URL = 'https://www.linkedin.com/company/orbit-i-private-limited/'
export const WHATSAPP_CHANNEL_URL = 'https://whatsapp.com/channel/0029Vb8l4kvJJzUXqEnB50J'
export const FACEBOOK_URL = 'https://www.facebook.com/profile.php?id=61590347497312&mibextid=ZbWKwL'
export const INSTAGRAM_URL = 'https://www.instagram.com/Orbit_i?igsh=anpnbThjbnN2OGxm'

/**
 * Reusable social/contact link config. Add or remove entries here — every
 * component (Footer, structured data, contact sections) reads from this
 * single array instead of hardcoding URLs.
 *
 * Brand icons are used for social profiles; email retains a neutral mail icon.
 */
export const socialLinks: SocialLink[] = [
  { name: 'LinkedIn', url: LINKEDIN_URL, icon: FaLinkedin },
  { name: 'Email', url: `mailto:${CONTACT_EMAIL}`, icon: Mail },
  { name: 'WhatsApp', url: WHATSAPP_CHANNEL_URL, icon: FaWhatsapp },
  { name: 'Facebook', url: FACEBOOK_URL, icon: FaFacebook },
  { name: 'Instagram', url: INSTAGRAM_URL, icon: FaInstagram },
]
