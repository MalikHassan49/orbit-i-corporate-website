import { LegalPageLayout } from '@/components/legal/LegalPageLayout'
import { SEO } from '@/components/seo/SEO'
import { PAGE_SEO } from '@/config/seo'
import { CONTACT_EMAIL } from '@/config/socialLinks'

export function SecurityPolicyPage() {
  return (
    <>
      <SEO {...PAGE_SEO.securityPolicy} />
      <LegalPageLayout title="Security Policy" lastUpdated="September 2026">
        <p>ORBIT-I Private Limited maintains reasonable administrative, technical, and physical safeguards to protect our website, client platform, and the information entrusted to us.</p>
        <h2>Security controls</h2>
        <p>We use least-privilege access, role-based authorization, password hashing, encrypted transport, rate limiting, security headers, backups, and monitoring appropriate to the services we operate.</p>
        <h2>Account security</h2>
        <p>Keep your credentials private, use a unique password, and notify us immediately if you suspect unauthorized access. We may suspend accounts or sessions to protect users and systems.</p>
        <h2>Data handling</h2>
        <p>Access to client and business information is limited to personnel and service providers who need it to provide the service. We retain information only as long as necessary for the stated purpose, contractual obligations, or applicable law.</p>
        <h2>Third-party providers</h2>
        <p>Hosting, storage, analytics, email, and payment providers may process information under their own security and privacy terms. We assess providers appropriate to the nature of the data and service.</p>
        <h2>Vulnerability reporting</h2>
        <p>Please report suspected vulnerabilities responsibly to <a className="text-primary-400 hover:text-primary-300" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. Include reproduction steps and avoid accessing, changing, or disclosing other users' data.</p>
        <h2>Limitations and updates</h2>
        <p>No internet service can guarantee absolute security. We review this policy and our controls periodically and may update this page as our systems and legal obligations change.</p>
      </LegalPageLayout>
    </>
  )
}
