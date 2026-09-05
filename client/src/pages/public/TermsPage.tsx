import { LegalPageLayout } from '@/components/legal/LegalPageLayout'
import { SEO } from '@/components/seo/SEO'
import { PAGE_SEO } from '@/config/seo'
import { CONTACT_EMAIL } from '@/config/socialLinks'

export function TermsPage() {
  return (
    <>
      <SEO {...PAGE_SEO.terms} />
      <LegalPageLayout title="Terms & Conditions" lastUpdated="August 2026">
        <p>
          These terms govern your use of the ORBIT-I Private Limited website and client platform.
          This is a template and should be reviewed by qualified legal counsel before production use.
        </p>

        <h2>Introduction</h2>
        <p>By accessing this website or creating an account, you agree to be bound by these Terms &amp; Conditions.</p>

        <h2>Website Usage</h2>
        <p>You agree to use this website only for lawful purposes and in a way that does not infringe the rights of, or restrict or inhibit the use of, this site by any third party.</p>

        <h2>Services and project agreements</h2>
        <p>ORBIT-I provides software development, consulting, and related digital products and services as described on this website. A signed proposal, order, statement of work, or project agreement may include scope, milestones, acceptance criteria, fees, ownership, and support terms; that agreement controls if it conflicts with this page.</p>

        <h2>Accounts</h2>
        <p>
          Client accounts are provided for the purpose of managing orders, projects, and support
          requests with ORBIT-I. Accounts may not be shared or used for unauthorized access to other
          users' data.
        </p>

        <h2>User Responsibilities</h2>
        <p>You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account.</p>

        <h2>Intellectual Property</h2>
        <p>All content on this website, including the ORBIT-I name, logo, and branding, is the property of ORBIT-I Private Limited unless otherwise stated.</p>

        <h2>Payments</h2>
        <p>Fees for products and services are as described at the time of purchase or in the applicable order/agreement. You are responsible for accurate billing details, applicable taxes, and fees charged by your bank or payment provider.</p>

        <h2>Orders</h2>
        <p>
          Specific commercial terms for products and services are governed by the individual order or
          statement of work agreed with ORBIT-I, not by this page alone.
        </p>

        <h2>Third-Party Services</h2>
        <p>This site or our services may link to or integrate with third-party services that are governed by their own terms.</p>

        <h2>Limitation of Liability</h2>
        <p>To the fullest extent permitted by law, ORBIT-I is not liable for indirect, incidental, or consequential damages arising from use of this website or our services.</p>

        <h2>Disclaimer</h2>
        <p>This website and its content are provided "as is" without warranties of any kind, express or implied.</p>

        <h2>Termination</h2>
        <p>ORBIT-I may suspend or terminate account access for violation of these terms or for misuse of the platform.</p>

        <h2>Changes to Terms</h2>
        <p>These terms may be updated from time to time. Continued use of the site after changes constitutes acceptance of the updated terms.</p>

        <h2>Governing Law</h2>
        <p>These terms are governed by the laws of the Islamic Republic of Pakistan. Subject to any mandatory consumer protection rights, the courts of Pakistan having jurisdiction over ORBIT-I Private Limited's registered office will have exclusive jurisdiction over disputes.</p>

        <h2>Contact Information</h2>
        <p>
          Questions about these terms can be sent to{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary-400 hover:text-primary-300">
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </LegalPageLayout>
    </>
  )
}
