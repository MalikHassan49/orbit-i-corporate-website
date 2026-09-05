import { LegalPageLayout } from '@/components/legal/LegalPageLayout'
import { SEO } from '@/components/seo/SEO'
import { PAGE_SEO } from '@/config/seo'
import { CONTACT_EMAIL } from '@/config/socialLinks'

export function RefundPolicyPage() {
  return (
    <>
      <SEO {...PAGE_SEO.refundPolicy} />
      <LegalPageLayout title="Refund Policy" lastUpdated="August 2026">
        <p>
          This Refund Policy outlines how ORBIT-I Private Limited ("ORBIT-I") handles refunds for
          digital products, subscriptions, and services. This is a policy template and should be
          reviewed by the company or its legal advisor before publishing.
        </p>

        <h2>Overview</h2>
        <p>
          ORBIT-I offers a mix of self-serve digital products and custom development/consulting
          services. Refund eligibility differs by offering type, described below.
        </p>

        <h2>Eligibility for Refunds</h2>
        <p>Refund eligibility depends on the type of purchase, how much of the service has already been delivered, and the terms agreed at the time of purchase.</p>

        <h2>Digital Products</h2>
        <p>Digital product purchases (e.g. Orbit CRM, Orbit Forms) may be eligible for a refund if requested within a limited window of the initial purchase, subject to reasonable use.</p>

        <h2>Software Services</h2>
        <p>Ongoing software services are billed for value delivered; fees for periods already rendered are generally non-refundable.</p>

        <h2>Project-based services</h2>
        <p>Custom development and consulting engagements are governed by the specific statement of work or agreement signed with the client, which takes precedence over this general policy. Because project work reserves people and capacity, payments for completed work, accepted milestones, discovery, and committed third-party costs are generally non-refundable.</p>

        <h2>Discovery, planning, and design</h2>
        <p>Discovery workshops, research, architecture, and design are delivered as scheduled. Once a session or deliverable has been supplied, its fee is non-refundable except where the applicable agreement says otherwise.</p>

        <h2>Milestones and acceptance</h2>
        <p>Where a project is billed by milestone, a refund request must identify the affected milestone and be made promptly after delivery. A client may request a correction for work that materially fails the agreed acceptance criteria; this is not a refund of unrelated completed milestones.</p>

        <h2>Change requests and pauses</h2>
        <p>Changes outside the agreed scope may require a new estimate. If a client pauses, delays, or cancels a project, ORBIT-I may invoice work performed, committed resources, and non-cancellable costs through the effective date.</p>

        <h2>Ongoing maintenance and support</h2>
        <p>Support retainers and maintenance subscriptions are billed for the period reserved. Cancellation stops future periods; fees for the current or already delivered period are not automatically refundable.</p>

        <h2>Subscription &amp; Cancellation Terms</h2>
        <p>Subscriptions can be cancelled at any time; cancellation stops future billing but does not automatically refund the current billing period unless otherwise agreed.</p>

        <h2>Non-Refundable Services</h2>
        <p>Work already completed, third-party costs already incurred on a client's behalf, and custom work delivered as specified are generally non-refundable.</p>

        <h2>Refund Request Process</h2>
        <p>
          To request a refund, contact us at{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary-400 hover:text-primary-300">
            {CONTACT_EMAIL}
          </a>{' '}
          with your order or project details and the reason for the request.
        </p>

        <h2>Processing Time</h2>
        <p>Approved refunds are typically processed within a reasonable number of business days, depending on the original payment method.</p>

        <h2>Exceptions</h2>
        <p>Exceptions to this policy may be made at ORBIT-I's discretion on a case-by-case basis.</p>

        <h2>Policy Changes</h2>
        <p>This policy may be updated from time to time. Material changes will be reflected by updating the "Last updated" date above.</p>

        <h2>Contact Information</h2>
        <p>
          Questions about this policy can be sent to{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary-400 hover:text-primary-300">
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </LegalPageLayout>
    </>
  )
}
