/**
 * Reusable company-location config. Keep the customer-facing location and
 * structured address details here so pages and SEO stay in sync.
 */
export const OFFICE_LOCATION = 'Karachi, Nawabshah, Pakistan'

/**
 * Only verified address fields are included for schema.org structured data.
 */
export const OFFICE_ADDRESS = {
  addressLocality: 'Nawabshah',
  addressCountry: 'PK',
} as const

export const COMPLIANCE_STATEMENT =
  'ORBIT-I Private Limited is incorporated with SECP, registered with FBR, and participates in the Pakistan Software Export Board (PSEB) ecosystem.'
