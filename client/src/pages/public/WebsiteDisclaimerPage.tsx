import { LegalPageLayout } from '@/components/legal/LegalPageLayout'
import { SEO } from '@/components/seo/SEO'
import { PAGE_SEO } from '@/config/seo'
import { CONTACT_EMAIL } from '@/config/socialLinks'

export function WebsiteDisclaimerPage() {
  return (
    <>
      <SEO {...PAGE_SEO.disclaimer} />
      <LegalPageLayout title="Website Disclaimer" lastUpdated="September 2026">
        <p>The information on this website is provided by ORBIT-I Private Limited for general information and communication purposes. It is not legal, financial, tax, security, or professional advice.</p>
        <h2>Accuracy and availability</h2>
        <p>We aim to keep content accurate and current, but do not warrant that descriptions, prices, availability, or other information are complete, current, or error-free. Content and features may change or be unavailable without notice.</p>
        <h2>No professional advice</h2>
        <p>Website articles, examples, case studies, and estimates are illustrative. You should obtain advice suitable to your circumstances before relying on information or making a business, technical, or purchasing decision.</p>
        <h2>Third-party links and services</h2>
        <p>Links to third-party websites or services are provided for convenience. ORBIT-I does not control or endorse their content, availability, privacy practices, or security and is not responsible for losses arising from their use.</p>
        <h2>Case studies and testimonials</h2>
        <p>Results described in case studies and testimonials are examples of particular engagements and are not a promise or guarantee of comparable results. Outcomes depend on each client's circumstances and participation.</p>
        <h2>Limitation of liability</h2>
        <p>To the fullest extent permitted by law, ORBIT-I is not liable for indirect, incidental, special, or consequential loss arising from reliance on this website or its content. Any services we provide are governed by the applicable agreement or statement of work.</p>
        <h2>Questions</h2>
        <p>For clarification about this disclaimer, contact <a className="text-primary-400 hover:text-primary-300" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</p>
      </LegalPageLayout>
    </>
  )
}
