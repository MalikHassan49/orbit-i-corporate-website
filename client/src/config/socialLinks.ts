import { Camera, Link2, Mail, MessageCircle, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface SocialLink {
  name: string
  url: string
  icon: LucideIcon
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
 * Note: a generic link icon is used for LinkedIn rather than the LinkedIn
 * brand mark, since this icon set doesn't ship brand/logo glyphs.
 */
export const socialLinks: SocialLink[] = [
  { name: 'LinkedIn', url: LINKEDIN_URL, icon: Link2 },
  { name: 'Email', url: `mailto:${CONTACT_EMAIL}`, icon: Mail },
  { name: 'WhatsApp', url: WHATSAPP_CHANNEL_URL, icon: MessageCircle },
  { name: 'Facebook', url: FACEBOOK_URL, icon: Users },
  { name: 'Instagram', url: INSTAGRAM_URL, icon: Camera },
]
