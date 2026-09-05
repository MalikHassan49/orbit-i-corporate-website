import { LegalPageLayout } from '@/components/legal/LegalPageLayout'
import { SEO } from '@/components/seo/SEO'
import { PAGE_SEO } from '@/config/seo'
import { CONTACT_EMAIL } from '@/config/socialLinks'

export function PrivacyPolicyPage() {
  return (
    <>
      <SEO {...PAGE_SEO.privacyPolicy} />
      <LegalPageLayout title="Privacy Policy" lastUpdated="August 2026">
        <p>
          ORBIT-I Private Limited ("ORBIT-I", "we", "us") respects your privacy. This page describes,
          in general terms, the categories of information we collect through this website and how we
          use it. This is a template and should be reviewed by qualified legal counsel before
          production use.
        </p>

        <h2>Introduction</h2>
        <p>
          This Privacy Policy applies to the ORBIT-I website and client platform. By using this site,
          you agree to the collection and use of information as described here.
        </p>

        <h2>Information We Collect</h2>
        <p>We collect information you provide directly, information generated when you use the site or platform, and information received from service providers or business contacts. We collect only what is reasonably needed for the purposes described below.</p>

        <h2>Categories of personal information</h2>
        <ul>
          <li><strong>Identity and contact:</strong> name, email, phone, company, address, and account profile details.</li>
          <li><strong>Account and project:</strong> login credentials (stored as hashes), orders, project records, support requests, and communications.</li>
          <li><strong>Transaction and payment:</strong> order, invoice, currency, payment status, and payment reference. We do not ask you to send full card numbers, PINs, passwords, or one-time codes through forms or email; payment details are handled by the relevant payment provider.</li>
          <li><strong>Technical and usage:</strong> IP address, device and browser information, logs, cookies, approximate location, and interactions used for security and performance.</li>
          <li><strong>Recruitment:</strong> application details, resume links, portfolio, LinkedIn profile, and correspondence.</li>
        </ul>

        <h2>Automatically Collected Information</h2>
        <p>
          Standard technical data such as browser type, device information, and IP address, collected
          for security, performance, and analytics purposes.
        </p>

        <h2>How We Use Information</h2>
        <p>We use information to provide and secure the website and client platform, authenticate accounts, fulfil orders and projects, process support and applications, communicate with you, prevent abuse, improve products, meet legal obligations, and keep business records. We do not sell personal information.</p>

        <h2>Payment safety warning</h2>
        <p>Never send card numbers, CVV, online-banking passwords, authentication codes, or wallet private keys to ORBIT-I by email, chat, or a contact form. Use only payment instructions presented through an authorized checkout or documented invoice, and contact us if a request appears suspicious.</p>

        <h2>Cookies</h2>
        <p>
          The site may use cookies or similar technologies to keep you signed in and to understand how
          the site is used. You can control cookies through your browser settings.
        </p>

        <h2>Analytics</h2>
        <p>We may use analytics tools to understand aggregate site usage. This data is not used to identify individual visitors personally.</p>

        <h2>Data Storage</h2>
        <p>Account and project data is stored in our database and retained for as long as your account remains active, or as required by law.</p>

        <h2>Data Security</h2>
        <p>
          We apply reasonable technical safeguards — including password hashing and access controls —
          to protect information, though no method of transmission or storage is completely secure.
        </p>

        <h2>Third-Party Services</h2>
        <p>We may use third-party service providers (e.g. hosting, email delivery) that process data on our behalf under appropriate confidentiality terms.</p>

        <h2>Data Sharing</h2>
        <p>We do not share personal information with third parties except as necessary to operate the service, comply with law, or with your consent.</p>

        <h2>User Rights</h2>
        <p>You may request access to, correction of, or deletion of your personal information by contacting us using the details below.</p>

        <h2>Data Retention</h2>
        <p>We retain information for as long as necessary to provide our services and fulfil the purposes described in this policy.</p>

        <h2>Children's Privacy</h2>
        <p>This site is not directed at children, and we do not knowingly collect personal information from children.</p>

        <h2>Changes to This Privacy Policy</h2>
        <p>We may update this policy from time to time. Material changes will be reflected by updating the "Last updated" date above.</p>

        <h2>Contact Information</h2>
        <p>
          Questions about this policy can be sent to{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary-400 hover:text-primary-300">
            {CONTACT_EMAIL}
          </a>
          .
        </p>
        <h2>Business Registration</h2>
        <p>ORBIT-I Private Limited operates as a company incorporated with the Securities and Exchange Commission of Pakistan (SECP), with applicable Federal Board of Revenue (FBR) registration and Pakistan Software Export Board (PSEB) participation.</p>
      </LegalPageLayout>
    </>
  )
}
